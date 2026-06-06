# SOUP register — formicary.ai

SOUP (Software of Unknown Provenance): external and third-party components used by the site and its build pipeline.

| Component | Version / Reference | Purpose | Source |
|---|---|---|---|
| Jekyll | `~> 4.3` (resolved: 4.4.1) | Static site generator; builds `_site/` from layouts, includes, and markdown pages | `Gemfile`; https://jekyllrb.com |
| jekyll-seo-tag | `~> 2.8` (resolved: 2.9.0) | Injects SEO `<meta>` tags into page `<head>` | `Gemfile`; https://github.com/jekyll/jekyll-seo-tag |
| actions/checkout | `v4` | Checks out repository source in the Actions build runner | `.github/workflows/deploy.yml`; https://github.com/actions/checkout |
| actions/configure-pages | `v5` | Configures GitHub Pages settings and provides `base_path` to the build | `.github/workflows/deploy.yml`; https://github.com/actions/configure-pages |
| actions/upload-pages-artifact | `v3` | Packages `_site/` as the Pages deployment artifact | `.github/workflows/deploy.yml`; https://github.com/actions/upload-pages-artifact |
| actions/deploy-pages | `v4` | Deploys the packaged artifact to GitHub Pages | `.github/workflows/deploy.yml`; https://github.com/actions/deploy-pages |
| ruby/setup-ruby | `v1` | Installs Ruby and runs `bundle install` in the Actions runner | `.github/workflows/deploy.yml`; https://github.com/ruby/setup-ruby |
| Scout Atom feed | Unpinned gist raw URL | External data source providing the live Scout feed. Fetched at runtime by the browser; not a build dependency. Content is untrusted and rendered as text only (REQ-004). | `assets/js/scout.js`; https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml |
| Google Fonts | CDN, no version pin | Serves Newsreader, IBM Plex Sans, and IBM Plex Mono web fonts. Imported in `tokens.css`. Page degrades to fallback font stack if unavailable. | `assets/css/tokens.css`; https://fonts.googleapis.com |
| Vitest | `^3.0` | JavaScript unit test runner for `tests/scout.test.js` | `package.json`; https://vitest.dev |
| jsdom | via Vitest | DOM environment for unit-testing Scout card rendering without a browser | `vitest.config.js`; https://github.com/jsdom/jsdom |
