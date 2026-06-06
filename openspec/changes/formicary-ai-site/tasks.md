## 1. OpenSpec and repository setup

- [x] 1.1 Commit OpenSpec init files and `openspec/` directory on `feat/openspec-init` branch
- [x] 1.2 Merge `feat/openspec-init` to `main`

## 2. Jekyll scaffold (feat/jekyll-scaffold)

- [x] 2.1 Create `Gemfile` pinning Jekyll and `jekyll-seo-tag`; run `bundle install` [REQ-011]
- [x] 2.2 Create `_config.yml` with `url`, `baseurl`, `title`, and `exclude` list [REQ-011]
- [x] 2.3 Create `CNAME` containing `formicary.ai` [REQ-006]
- [x] 2.4 Create `.gitignore` excluding `_site/`, `.jekyll-cache/`, `Gemfile.lock`
- [x] 2.5 Create `.github/workflows/deploy.yml` with build and Pages deploy jobs [REQ-010]
- [x] 2.6 Verify `bundle exec jekyll build` succeeds and `_site/CNAME` is present [REQ-006, REQ-011]
- [x] 2.7 Commit (`feat(REQ-001,REQ-006,REQ-010,REQ-011): jekyll scaffold and deploy workflow`) and merge to `main`

## 3. Methodology docs (feat/methodology-docs)

- [x] 3.1 Create `docs/requirements.md` with REQ-001 through REQ-036, commit convention documented [REQ-026, REQ-030]
- [x] 3.2 Create `docs/hazards.md` with four seeded hazards, controls, and REQ-ID references [REQ-028]
- [x] 3.3 Create `docs/soup.md` with all external component entries [REQ-029]
- [x] 3.4 Create `docs/traceability.md` with table skeleton; populate implementing files and verification methods as each phase completes [REQ-027]
- [x] 3.5 Commit (`docs(REQ-026,REQ-027,REQ-028,REQ-029,REQ-030): seed methodology docs`) and merge to `main`

## 4. Design system assets (feat/design-assets)

- [x] 4.1 Copy `docs/_brief/design_brief/tokens.css` verbatim to `assets/css/tokens.css` [REQ-012]
- [x] 4.2 Copy `docs/_brief/design_brief/theme.js` verbatim to `assets/js/theme.js` [REQ-009]
- [x] 4.3 Copy `docs/_brief/design_brief/scout-feed.json` to `_data/scout.json`
- [x] 4.4 Commit (`feat(REQ-009,REQ-012): design tokens, theme script, and dev data`) and merge to `main`

## 5. Layouts and includes (feat/layouts)

- [x] 5.1 Create `_layouts/default.html`: full shell with `theme.js` in `<head>` before CSS, skip link, header include, `{{ content }}`, footer include; `layout_shell` front matter variable [REQ-013]
- [x] 5.2 Create `_includes/header.html`: sticky nav, wordmark, three nav links with `aria-current`, theme toggle button [REQ-014]
- [x] 5.3 Create `_includes/footer.html`: CC BY 4.0 link and "Adrian Rossouw, 2026" [REQ-015]
- [x] 5.4 Create `_includes/epistemic.html`: parameterised callout accepting `label`, `fields`, `note` [REQ-016]
- [x] 5.5 Verify layout renders valid shell (one header, one main, one footer, skip link first) [REQ-013]
- [x] 5.6 Verify active nav link has `aria-current="page"` on a test build [REQ-014]
- [x] 5.7 Commit (`feat(REQ-013,REQ-014,REQ-015,REQ-016,REQ-017): layouts and includes`) and merge to `main`

## 6. Thesis page (feat/thesis-page)

- [x] 6.1 Create `index.md` with front matter (`title`, `layout: default`, masthead fields) [REQ-018]
- [x] 6.2 Port essay content from `docs/_brief/build_spec/formicary-thesis-web.md`; replace leading blockquote with `{% include epistemic.html %}` callout [REQ-018]
- [x] 6.3 Populate epistemic callout fields (Status, Confidence, Last revised) [REQ-002]
- [x] 6.4 Verify masthead renders title and deck as a pair with accent keyline [REQ-019]
- [x] 6.5 Verify no em-dashes in masthead, callout, or nav [REQ-005]
- [x] 6.6 Update `docs/traceability.md` for REQ-002, REQ-005, REQ-018, REQ-019
- [ ] 6.7 Commit (`feat(REQ-002,REQ-005,REQ-018,REQ-019): thesis landing page with epistemic callout`) and merge to `main`

## 7. Scout page (feat/scout-page)

- [ ] 7.1 Create `assets/js/scout.js` with exported `parseFeed`, `parseSummaryHtml`, `extractScore`, `filterItems` functions, and the `init` render/filter wiring [REQ-020]
- [ ] 7.2 Implement `parseFeed`: fetch unpinned gist URL, parse Atom XML with DOMParser, call `parseSummaryHtml` per entry, sort newest-first [REQ-003, REQ-020]
- [ ] 7.3 Implement `parseSummaryHtml`: parse summary HTML with DOMParser, extract analysis/score-line/rationale/tags as text nodes only [REQ-004, REQ-020]
- [ ] 7.4 Implement `extractScore`: regex parse score integer and label from score-line string [REQ-020]
- [ ] 7.5 Implement `filterItems`: single-select rel filter, multi-select OR tag filter, combined AND logic [REQ-022]
- [ ] 7.6 Implement card renderer: all content via `createElement`/`textContent`, no `innerHTML` of feed data [REQ-004, REQ-021]
- [ ] 7.7 Implement loading, empty, and error states [REQ-007]
- [ ] 7.8 Create `scout.html` with Liquid masthead, readout bar skeleton, filter chrome, and `<ol class="feed">` target; wire `scout.js` [REQ-008, REQ-021, REQ-022]
- [ ] 7.9 Verify live feed loads and renders cards in a browser [REQ-003]
- [ ] 7.10 Verify unpinned URL (no SHA) in `scout.js` source [REQ-003]
- [ ] 7.11 Update `docs/traceability.md` for REQ-003, REQ-004, REQ-007, REQ-008, REQ-020, REQ-021, REQ-022
- [ ] 7.12 Commit (`feat(REQ-003,REQ-004,REQ-007,REQ-008,REQ-020,REQ-021,REQ-022): scout page with safe client-side feed render`) and merge to `main`

## 8. Scout tests (feat/scout-page, same branch)

- [ ] 8.1 Create `package.json` with Vitest dependency and `"test": "vitest run"` script [REQ-031]
- [ ] 8.2 Create `vitest.config.js` with jsdom environment [REQ-031]
- [ ] 8.3 Create `tests/scout.test.js` with fixture Atom XML captured from live feed [REQ-031]
- [ ] 8.4 Write `parseFeed` tests: valid feed, empty feed, malformed XML [REQ-032]
- [ ] 8.5 Write `parseSummaryHtml` tests: analysis extraction, no HTML tags in output [REQ-033]
- [ ] 8.6 Write `extractScore` tests: all score levels (3, 4, 5), unrecognised input fallback [REQ-034]
- [ ] 8.7 Write `filterItems` tests: rel filter, OR tag filter, combined AND filter, empty tags [REQ-035]
- [ ] 8.8 Write REQ-004 safety assertion: `<script>` tag in analysis does not produce a script element [REQ-036]
- [ ] 8.9 Run `npm test`; all tests pass [REQ-031]
- [ ] 8.10 Update `docs/traceability.md` for REQ-031 through REQ-036; mark REQ-004 verified by test [REQ-027]
- [ ] 8.11 Commit (`test(REQ-031,REQ-032,REQ-033,REQ-034,REQ-035,REQ-036): vitest suite for scout parsing and filter logic`) and merge to `main`

## 9. About page (feat/about-page)

- [ ] 9.1 Create `about.md` with front matter and content from `docs/_brief/build_spec/formicary-about.md` [REQ-023]
- [ ] 9.2 Render AI-use disclosure using `{% include epistemic.html label="AI-use disclosure" %}` [REQ-023]
- [ ] 9.3 Implement two-column is/isn't block with `.col2` and `.isnt-list` [REQ-024]
- [ ] 9.4 Implement contact section as `dl.bio-grid` with correct email and links [REQ-025]
- [ ] 9.5 Verify single-column collapse below 720px [REQ-024]
- [ ] 9.6 Update `docs/traceability.md` for REQ-023, REQ-024, REQ-025
- [ ] 9.7 Commit (`feat(REQ-023,REQ-024,REQ-025): about page with disclosure and contact`) and merge to `main`

## 10. Stretch: CI traceability check

- [ ] 10.1 Add a bash step to `.github/workflows/deploy.yml` that extracts REQ-IDs from `docs/requirements.md` and verifies each appears in `docs/traceability.md`; fails the build if any are untraced
- [ ] 10.2 Commit (`feat: ci traceability enforcement step`) only if all other tasks are complete and ship is not at risk
