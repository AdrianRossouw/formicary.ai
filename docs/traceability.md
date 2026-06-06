# Traceability — formicary.ai

Maps each REQ-ID to its implementing file(s) and verification method. Updated as each phase completes.

| REQ-ID | Statement summary | Implementing file(s) | Verification method |
|---|---|---|---|
| REQ-001 | HTTPS on apex domain | `CNAME`, `.github/workflows/deploy.yml`, GitHub Pages settings | Manual: browser confirms HTTPS redirect and valid cert |
| REQ-002 | Epistemic-status callout on landing | `index.md`, `_includes/epistemic.html` | Manual: build and inspect `_site/index.html` for `aside.epistemic` before first prose paragraph |
| REQ-003 | Live feed, unpinned URL, newest-first | `assets/js/scout.js` (`parseFeed`) | Manual: inspect URL literal in source; browser load confirms newest-first order |
| REQ-004 | Text-only rendering, no innerHTML | `assets/js/scout.js` (`parseSummaryHtml`, card renderer) | Automated: `tests/scout.test.js` REQ-036 safety assertion |
| REQ-005 | No em-dashes in site-authored copy | `index.md`, `_includes/header.html`, `_includes/footer.html`, `_includes/epistemic.html`, `scout.html`, `about.md` | Manual: grep `_site/` for U+2014 after build |
| REQ-006 | CNAME in deployed output | `CNAME`, `_config.yml` | Manual: `ls _site/CNAME` after `bundle exec jekyll build` |
| REQ-007 | Loading, empty, and error states | `assets/js/scout.js` (`init`) | Manual: browser — throttle network for loading; clear filter for empty; block URL for error |
| REQ-008 | Accessible markup and landmarks | `_layouts/default.html`, `_includes/header.html`, `scout.html` | Manual: inspect rendered HTML for skip link, landmarks, `aria-current`, `<ol>/<li>/<h2>/<time>` |
| REQ-009 | Theme toggle, no-flash, localStorage | `assets/js/theme.js`, `_layouts/default.html` | Manual: set dark in DevTools Storage, reload — no white flash; toggle persists |
| REQ-010 | GitHub Actions deploy workflow | `.github/workflows/deploy.yml` | CI: push to main runs tests, traceability check, Jekyll build, and Pages deploy |
| REQ-011 | Jekyll project structure | `Gemfile`, `_config.yml` | Manual: `bundle exec jekyll build` succeeds |
| REQ-012 | Design tokens as single source of truth | `assets/css/tokens.css` | Manual: diff against `docs/_brief/design_brief/tokens.css` — files identical |
| REQ-013 | Jekyll shell layout | `_layouts/default.html` | Manual: inspect built HTML for single header/main/footer/skip-link |
| REQ-014 | Accessible header/nav | `_includes/header.html` | Manual: build each page, confirm `aria-current="page"` on correct link |
| REQ-015 | Footer | `_includes/footer.html` | Manual: inspect footer for CC BY 4.0 link and author name linked to adrian.rossouw.ie |
| REQ-016 | Epistemic callout include | `_includes/epistemic.html` | Manual: inspect thesis and about pages for correct callout structure |
| REQ-017 | Reduced-motion respect | `assets/css/tokens.css` | Manual: enable `prefers-reduced-motion` in DevTools, confirm no animation |
| REQ-018 | Thesis page essay content | `index.md` | Manual: inspect `_site/index.html` for essay text |
| REQ-019 | Masthead title and deck as pair | `index.md`, `_layouts/default.html` | Manual: inspect rendered masthead for `.masthead__title` and adjacent `.masthead__deck` |
| REQ-020 | parseFeed isolation | `assets/js/scout.js` | Automated: `tests/scout.test.js` REQ-032 parseFeed tests; manual: renderer/filter code review |
| REQ-021 | Analysis-forward card rendering | `assets/js/scout.js` (card renderer), `scout.html` | Manual: browser — analysis text is visually primary; score-5 items have accent border |
| REQ-022 | Relevance and tag filtering | `assets/js/scout.js` (`filterItems`, `init`) | Automated: `tests/scout.test.js` REQ-035 filterItems tests; manual: browser filter interaction |
| REQ-023 | About page copy and disclosure | `about.md`, `_includes/epistemic.html` | Manual: inspect `_site/about/index.html` for disclosure callout before prose |
| REQ-024 | Two-column is/isn't block | `about.md` | Manual: inspect at 720px+ (two columns) and below (single column) |
| REQ-025 | Contact section | `about.md` | Manual: inspect `dl.bio-grid` for email, personal link to adrian.rossouw.ie, writing, feed, licence rows |
| REQ-026 | Requirements document | `docs/requirements.md` | Manual: file exists and contains REQ-001 through REQ-036 |
| REQ-027 | Traceability table | `docs/traceability.md`, `scripts/check-traceability.js` | Automated: CI runs `node scripts/check-traceability.js` on every push; exits 1 if any REQ-ID is untraced |
| REQ-028 | Hazard register | `docs/hazards.md` | Manual: four seeded hazards with controls and REQ-ID references present |
| REQ-029 | SOUP register | `docs/soup.md` | Manual: all external components listed with version and purpose |
| REQ-030 | REQ-ID commit convention | `docs/requirements.md` (documented), git log | Manual: `git log --oneline` confirms REQ-ID pattern in commit messages |
| REQ-031 | Vitest test suite | `tests/scout.test.js`, `package.json`, `vitest.config.js` | Automated: `npm test` exits 0 |
| REQ-032 | parseFeed tests | `tests/scout.test.js` | Automated: `npm test` — parseFeed group passes |
| REQ-033 | parseSummaryHtml tests | `tests/scout.test.js` | Automated: `npm test` — parseSummaryHtml group passes |
| REQ-034 | extractScore tests | `tests/scout.test.js` | Automated: `npm test` — extractScore group passes |
| REQ-035 | filterItems tests | `tests/scout.test.js` | Automated: `npm test` — filterItems group passes |
| REQ-036 | REQ-004 safety assertion | `tests/scout.test.js` | Automated: `npm test` — XSS safety test passes |
| REQ-037 | Favicon declarations | `_layouts/default.html`, `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` | Manual: inspect `<head>` for all five link tags; confirm files present in `_site/` after build |
| REQ-038 | Sitemap generation | `Gemfile`, `_config.yml` | Manual: `bundle exec jekyll build` then confirm `_site/sitemap.xml` exists and lists all pages |
| REQ-039 | Scout feed format contract | `docs/scout-feed-format.md`, `assets/js/scout.js` | Manual: confirm document exists and matches parsing logic in `parseFeed` and `parseSummaryHtml` |
