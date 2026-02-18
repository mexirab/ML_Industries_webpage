# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static corporate website for **ML Industrial Air Corp.**, a North Texas industrial air products representative. Originally generated with Adobe Muse CC 2018, now maintained via manual edits. Deployed via FTP to `mlindustrialair.com`.

## Local Development

```bash
# Serve locally with any HTTP server
python -m http.server 8000
# or (needed if testing PHP forms)
php -S localhost:8000
```

No build step, package manager, or test framework exists.

## Architecture

- **Pages**: `index.html` (home), `manufacturers.html`, `contact.html`, `vacuum-systems.html`, `404.shtml`
- **CSS**: Per-page stylesheets in `css/` plus `layout-styles.css` at root. `nomq_*.css` files are IE<9 fallbacks.
- **JS**: jQuery 1.8.3 + Adobe Muse widget libraries in `scripts/`. Loaded via `Muse.assets` pattern in each HTML file.
- **Forms**: PHP handlers in `scripts/` (`form_process.php`, `form_check.php`, `form_throttle.php`). Rate limiting uses SQLite (`muse-throttle-db.sqlite3`).
- **Responsive breakpoints**: 320px, 414px, 736px, 768px, 960px via CSS media queries.

## Key Considerations When Editing

- HTML is Adobe Muse-generated with deeply nested `<div>` structures and utility classes (`clearfix`, `grpelem`, `colelem`). Preserve this structure when making changes.
- Layout uses `data-muse-uid` and `data-muse-type` attributes — do not remove these as Muse widgets depend on them.
- Editable content regions are marked with `<!-- m_editable region-id="..." -->` comments.
- Shared header/footer markup is duplicated across all pages (no templating); changes to navigation or footer must be applied to every HTML file.
- `vacuum-systems.html` is extremely large (~425 KB / 3074 lines). Use line offsets when reading.
- CSS files can also be very large (e.g., `vacuum-systems.css` is 186 KB).

## Git & Deployment

- Remote: `git@github.com:mexirab/ML_Industries_webpage.git` (branch: `main`)
- Production deployment is manual FTP to `107.180.44.148/public_html`
- `.gitignore` excludes `.DS_Store`, `cagefs/`, `error_log`, `.ftpquota`, `.htaccess`
