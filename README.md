# daringeorgiev.github.io

Personal portfolio site for [Darin Georgiev](https://daringeorgiev.github.io), deployed on GitHub Pages from the `master` branch.

**Live site:** https://daringeorgiev.github.io

## Tech stack

| Layer | Tool |
|---|---|
| Markup | HTML5 (single `index.html`) |
| Styles | SCSS → compiled by gulp-sass; Bootstrap 5 / Bootswatch Cosmo via CDN |
| Scripts | jQuery 3.5.1; Bootstrap 5 bundle via CDN |
| Build | Gulp 4 (`gulp-sass`, `gulp-uglify`, `critical`) |
| PWA | `serviceWorker.js` + `manifest.json` |

## Prerequisites

- Node.js 18+
- `gulp-cli` installed globally: `npm install -g gulp-cli`

## Local setup

```bash
git clone https://github.com/daringeorgiev/daringeorgiev.github.io.git
cd daringeorgiev.github.io
npm install
```

Serve the site locally with any static server, e.g.:

```bash
npx serve .
```

## Build commands

```bash
# Compile SCSS → css/styles.css + css/styles-min.css
gulp css

# Minify JS → js/scripts-min.js
gulp scripts

# Extract and inline critical CSS into dist/index.html
gulp critical
```

> Re-run `gulp critical` after any CSS change that affects above-the-fold rendering. See `CLAUDE.md` for the full workflow.

## Quality bar

Every change must maintain or improve:

- **Lighthouse 90+** in all four categories (Performance, Accessibility, Best Practices, SEO)
- **W3C valid HTML** — no errors ([validator.w3.org](https://validator.w3.org/))
- **Responsive layout** — tested at 360 px, 768 px, and 1200 px+
- **Accessible** — semantic HTML, ARIA labels, `alt` text, sufficient color contrast
