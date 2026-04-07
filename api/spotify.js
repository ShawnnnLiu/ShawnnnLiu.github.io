const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

async function getAccessToken() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function spotifyGet(endpoint, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify ${endpoint} (${res.status}): ${text}`);
  }
  return res.json();
}

function parseTracks(data) {
  return (data.items || []).map((t) => ({
    name: t.name,
    artist: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album?.name || '',
    image: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
    url: t.external_urls?.spotify || '',
    popularity: t.popularity ?? null,
  }));
}

function deriveAlbums(data) {
  const seen = new Set();
  return data.items
    .filter((t) => {
      if (!t.album || seen.has(t.album.id)) return false;
      if ((t.album.total_tracks || 0) < 5) return false;
      seen.add(t.album.id);
      return true;
    })
    .map((t) => ({
      name: t.album.name,
      artist: t.artists.map((a) => a.name).join(', '),
      image: t.album.images?.[1]?.url || t.album.images?.[0]?.url || '',
      url: t.album.external_urls?.spotify || '',
    }));
}

function parseArtists(data) {
  return data.items.map((a) => ({
    name: a.name,
    image: a.images?.[1]?.url || a.images?.[0]?.url || '',
    url: a.external_urls.spotify,
    genres: (a.genres || []).slice(0, 3),
    popularity: a.popularity ?? null,
  }));
}

function parseRecent(data) {
  const seen = new Set();
  return data.items
    .filter((item) => {
      if (seen.has(item.track.id)) return false;
      seen.add(item.track.id);
      return true;
    })
    .map((item) => ({
      name: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(', '),
      album: item.track.album.name,
      image:
        item.track.album.images[1]?.url ||
        item.track.album.images[0]?.url ||
        '',
      url: item.track.external_urls.spotify,
    }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  // Edge-cache for 1 h, serve stale up to 2 h while revalidating
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=1200'
  );

  try {
    const token = await getAccessToken();

    const [
      shortTracks, medTracks, longTracks,
      shortArtists, medArtists, longArtists,
      recentlyPlayed,
    ] = await Promise.all([
      spotifyGet('/me/top/tracks?time_range=short_term&limit=50', token),
      spotifyGet('/me/top/tracks?time_range=medium_term&limit=50', token),
      spotifyGet('/me/top/tracks?time_range=long_term&limit=50', token),
      spotifyGet('/me/top/artists?time_range=short_term&limit=10', token),
      spotifyGet('/me/top/artists?time_range=medium_term&limit=10', token),
      spotifyGet('/me/top/artists?time_range=long_term&limit=10', token),
      spotifyGet('/me/player/recently-played?limit=30', token),
    ]);

    return res.status(200).json({
      recentTracks: parseRecent(recentlyPlayed).slice(0, 10),
      tracks: {
        short_term: parseTracks(shortTracks).slice(0, 10),
        medium_term: parseTracks(medTracks).slice(0, 10),
        long_term: parseTracks(longTracks).slice(0, 10),
      },
      albums: {
        short_term: deriveAlbums(shortTracks).slice(0, 8),
        medium_term: deriveAlbums(medTracks).slice(0, 8),
        long_term: deriveAlbums(longTracks).slice(0, 8),
      },
      artists: {
        short_term: parseArtists(shortArtists).slice(0, 10),
        medium_term: parseArtists(medArtists).slice(0, 10),
        long_term: parseArtists(longArtists).slice(0, 10),
      },
    });
  } catch (err) {
    console.error('Spotify proxy error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
};
