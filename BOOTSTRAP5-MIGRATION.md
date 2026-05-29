# Bootstrap 3 → 5 Migration Plan

## Context

The site runs Bootstrap 3.4.1 (EOL), which includes the now-removed `affix` plugin, a jQuery dependency, and Bootstrap 3-only class names/data attributes. The goal is to migrate to Bootstrap 5 while preserving all visible behavior: sticky navbar with opacity transition, smooth scrolling, link hover underlines, logo bounce animation, and carousel.

## Approach: CDN Bootstrap 5 + simplified SCSS

Rather than rewriting the ~150 Bootstrap 3 variable overrides in `_variablesCosmo.scss`, Bootstrap is dropped from the SCSS build pipeline and loaded via CDN instead. The custom `styles.scss` keeps all hand-written styles but replaces Bootstrap variable references with hardcoded values.

Bootstrap 5 ships its own JS bundle (no jQuery required). jQuery stays loaded for the custom scripts in `scripts.js` (smooth scroll, lazy load, go-to-top, etc.).

---

## Step 1 — `index.html`: CDN links

**In `<head>`:**
- Replace Font Awesome 4.4.0 CDN with Font Awesome 6 free CDN. Audit icon class prefixes (`fa` → `fa-solid` / `fa-brands` as needed).
- Replace the Bootstrap 3 CSS (compiled into `styles-min.css`) with the Bootswatch Cosmo theme for Bootstrap 5 — same visual look, no redesign needed:
  ```html
  <link rel="stylesheet" href="https://bootswatch.com/5/cosmo/bootstrap.min.css">
  ```
  Load this before the existing `styles-min.css` link so custom styles still take precedence.

**Before `</body>`:**
- Remove: `<script src=".../bootstrap/3.4.1/js/bootstrap.min.js">`
- Add: `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer>`
- Keep: jQuery (still needed for custom scripts).

---

## Step 2 — `index.html`: markup changes

| Location | Bootstrap 3 | Bootstrap 5 |
|---|---|---|
| `<body>` | `data-spy="scroll" data-target=".navbar" data-offset="0"` | `data-bs-spy="scroll" data-bs-target=".navbar" data-bs-offset="0"` |
| Profile `<img>` | `img-circle` | `rounded-circle` |
| Grid (line 223) | `col-lg-offset-2 col-md-offset-1` | `offset-lg-2 offset-md-1` |
| `<h1>` headings | `class="page-header"` | keep class, add custom style in CSS |
| Navbar `<nav>` | `navbar-default data-spy="affix" data-offset-top="450"` | `navbar-dark` (remove affix attrs) |
| Navbar `<div>` wrapper | `navbar-header` | remove wrapper entirely |
| Toggle `<button>` | `navbar-toggle data-toggle data-target` | `navbar-toggler data-bs-toggle data-bs-target` |
| Toggle icon spans | 3× `<span class="icon-bar">` | Bootstrap 5 SVG toggler icon |
| Nav `<ul>` | `navbar-right` | `ms-auto` |
| Carousel `<div>` | `data-ride="carousel"` | `data-bs-ride="carousel"` |
| Carousel indicators | `data-target data-slide-to` | `data-bs-target data-bs-slide-to` |
| Carousel items | `class="item"` | `class="carousel-item"` |
| Carousel inner | `role="listbox"` | remove (not valid here) |
| Carousel item | `role="option"` | remove |
| Carousel prev control | `left carousel-control data-slide="prev"` | `carousel-control-prev data-bs-slide="prev"` |
| Carousel next control | `right carousel-control data-slide="next"` | `carousel-control-next data-bs-slide="next"` |

---

## Step 3 — `css/styles.scss`: remove Bootstrap imports, fix variables

Remove the three Bootstrap-related imports:
```scss
// DELETE these three lines:
@import 'variablesCosmo';
@import 'bootstrap-custom';
@import 'bootswatchCosmo';
```

Add SCSS variable definitions at the top of `styles.scss` to replace Bootstrap 3 variables used in the file:
```scss
$primary:          #2780E3;
$link-color:       #2780E3;
$link-hover-color: #1560b3;
$gray-dark:        #373a3c;
$gray-lighter:     #eeeeee;
```

Replace every reference in `styles.scss`:
- `$brand-primary` → `$primary`
- `$navbar-default-bg` → `#1a1a1a` (only used in `.header` background)
- `$navbar-default-color` → `#fff`

Add styles for the now-removed Bootstrap 3 `.page-header`:
```scss
.page-header {
  border-bottom: 1px solid $gray-lighter;
  margin: 40px 0 20px;
  padding-bottom: 9px;
}
```

Rename `.affix` → `.navbar--scrolled` (see Step 4).

---

## Step 4 — Replace `affix` with custom scroll class

Bootstrap 5 removed the affix plugin. Current behavior: when scrolled past 450px the navbar gets `position: fixed; top: 0` plus a darker background and box-shadow.

**In `css/styles.scss`:** rename `.affix` → `.navbar--scrolled`.

**In `js/scripts.js`:** add a scroll listener (jQuery syntax for now — will be rewritten as vanilla JS in the jQuery removal task):
```js
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 450) {
    $('.navbar').addClass('navbar--scrolled');
  } else {
    $('.navbar').removeClass('navbar--scrolled');
  }
});
```

---

## Step 5 — `js/scripts.js`: Bootstrap 5 API updates

| Current (BS3) | Bootstrap 5 |
|---|---|
| `$('body').scrollspy({ target: '.navbar', offset: 50 })` | `new bootstrap.ScrollSpy(document.body, { target: '.navbar', offset: 50 })` |
| `.navbar-collapse.in` (expanded state) | `.navbar-collapse.show` |
| `$(this).collapse('hide')` | `bootstrap.Collapse.getInstance(this).hide()` |

Carousel event `slide.bs.carousel` is unchanged — still valid in BS5.

---

## Files to delete after migration

These are no longer imported by `styles.scss` and no longer needed:
- `css/_variablesCosmo.scss`
- `css/_bootstrap-custom.scss`
- `css/_bootswatchCosmo.scss`
- `libs/bootstrap-sass/` (Bootstrap 3 SCSS source, installed via Bower)
- `bower.json` (Bower is deprecated; its only dependencies were Bootstrap 3)

---

## Post-migration steps

Once all five steps above are complete:

1. Replace profile picture — swap `imgs/profile.*` (both WebP and JPG files).
2. Run `gulp css` to recompile `styles-min.css`.
3. Run `gulp critical` to regenerate the inlined critical CSS in `index.html`.

---

## Verification checklist

**Build**
- [ ] `gulp css` completes without errors

**Functionality**
- [ ] Navbar is semi-transparent on load, darkens after scrolling ~450px
- [ ] Navbar links show underline on hover and on active scroll position
- [ ] Logo bounces on hover
- [ ] Clicking nav links smooth-scrolls to the section
- [ ] Photoshop carousel slides correctly, lazy-loads images
- [ ] Mobile: hamburger button opens/closes the nav
- [ ] Go-to-top button appears after scrolling, returns to top smoothly

**Quality bar** (see `CLAUDE.md` for full standards)
- [ ] Lighthouse 90+ in all four categories: Performance, Accessibility, Best Practices, SEO
- [ ] HTML passes [W3C Markup Validator](https://validator.w3.org/) with no errors
- [ ] Layout correct at mobile (360px+), tablet (768px+), and desktop (1200px+)
- [ ] Tested in Chrome, Firefox, Safari, Edge (last 2 versions) and iOS Safari + Chrome for Android
