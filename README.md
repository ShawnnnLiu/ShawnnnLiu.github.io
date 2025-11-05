# Personal Site (No‑build GitHub Pages)

A minimal, no‑build academic homepage. Push this folder to a repo named `<your-username>.github.io` and it will be live at `https://<your-username>.github.io`.

## How to use
1. Rename the repo to **your GitHub username** + `.github.io` (example: `qwilfish123.github.io`).
2. Edit `index.html` (name, bio, links) and `publications.json` for your papers.
3. Replace `assets/Shawn_Liu_CV.pdf` with your real CV.
4. Commit and push. In the repo settings, ensure **Settings → Pages** is enabled (it uses the `main` branch by default).

## Custom domain (optional)
- Buy a domain (e.g., Namecheap, Google Domains).
- Add a DNS `A` record pointing to GitHub Pages IPs and a `CNAME` record to `<your-username>.github.io`.
- In GitHub, create a `CNAME` file at the project root with your custom domain inside.

## Notes
- This template avoids Jekyll/build steps for simplicity. If you want a more feature‑rich academic theme later, consider `academicpages`, `al-folio` (Jekyll) or `Wowchemy` (Hugo).
