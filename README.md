# shawnnnliu.github.io

Source of Shawn Liu's personal site.
It is static HTML and CSS with no build step and no JavaScript; GitHub Pages serves the `main` branch.

- `index.html` is the home page, and its JSON-LD block carries the structured data.
- `style.css` is the one stylesheet, shared with `writing/index.html`.
  Both pages load it as `style.css?v=<date>`; when the stylesheet changes, bump that date in both files, or returning visitors keep a cached old copy for up to 10 minutes and see an unstyled page.
- `assets/CV/` holds the linked resume and CV under stable file names, so a new render replaces the file without changing the URL.

Everything committed here is public, including Markdown files, so drafts and briefs stay out of this repo.
