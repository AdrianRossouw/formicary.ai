# Requirements — formicary.ai

## Commit convention

Every commit that implements or modifies a requirement SHALL reference the relevant REQ-ID(s) in the commit message. Pattern: `feat(REQ-NNN): description` for a single requirement, or `feat(REQ-NNN,REQ-NNN): description` for multiple. Example:

```
feat(REQ-003,REQ-004): client-side Scout feed with safe text rendering
```

## Requirements

| ID | Statement |
|---|---|
| REQ-001 | The site SHALL be served over HTTPS at `https://formicary.ai`. The GitHub Pages custom domain setting SHALL have "Enforce HTTPS" enabled once the TLS certificate has provisioned. |
| REQ-002 | The landing page SHALL render the leading blockquote from the source essay as an epistemic-status callout component (`aside.epistemic`), not as a default blockquote. The callout SHALL display Status, Confidence, and Last revised fields. |
| REQ-003 | `/scout` SHALL fetch the Scout Atom feed at runtime from the unpinned gist URL `https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml`. The URL in source SHALL NOT include a commit SHA path segment. Items SHALL be rendered newest-first by `updated` date. |
| REQ-004 | Feed analysis text, rationale, and all other content extracted from the Atom feed SHALL be rendered using `textContent` assignment only. The raw HTML from `<summary>` elements SHALL NEVER be assigned to `innerHTML`, `outerHTML`, or any other HTML-injection API. |
| REQ-005 | No em-dash characters (U+2014) SHALL appear in any site-authored UI copy or microcopy, including masthead, callouts, navigation, footer, and Scout chrome. Em-dashes present in essay body prose (author content) are exempt. |
| REQ-006 | The file `CNAME` containing exactly `formicary.ai` SHALL be present in the repository root and SHALL appear in the `_site/` output on every Jekyll build. |
| REQ-007 | The Scout page SHALL display an explicit loading state while the fetch is in progress, an empty state when no items match current filters, and an error state if the fetch fails or the feed cannot be parsed. The error message SHALL be clear and non-alarming. |
| REQ-008 | Every page SHALL have: a visually-hidden skip link as the first body child; semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`); `aria-current="page"` on the active navigation link. The Scout feed list SHALL use `<ol>` with `<li>` children, `<h2>` for item titles, and `<time>` for dates. Feed links SHALL use `target="_blank" rel="noopener"`. |
| REQ-009 | The theme toggle SHALL persist the user's light/dark preference in `localStorage` under the key `formicary-theme`. `theme.js` SHALL be loaded in `<head>` before the stylesheet so the preference is applied before first paint with no flash. |
| REQ-010 | The repository SHALL contain a GitHub Actions workflow at `.github/workflows/deploy.yml` that triggers on push to `main` and on manual dispatch, builds with `bundle exec jekyll build`, and deploys the `_site/` output to GitHub Pages using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. |
| REQ-011 | The repository SHALL contain a valid Jekyll project structure: `Gemfile` pinning Jekyll and `jekyll-seo-tag`, `_config.yml` with `url: "https://formicary.ai"` and `baseurl: ""`, and excludes covering `docs/`, `Gemfile`, `Gemfile.lock`, `openspec/`, and `vendor/`. |
| REQ-012 | `assets/css/tokens.css` SHALL be copied verbatim from the design brief source. No colour, spacing, type, or layout value SHALL be re-derived or hard-coded elsewhere. All layouts and includes SHALL reference only CSS custom properties defined in `tokens.css`. OKLCH colour values SHALL NOT be converted. |
| REQ-013 | `_layouts/default.html` SHALL provide the full page shell with `theme.js` loaded in `<head>` before the CSS link, a skip link, `_includes/header.html`, `{{ content }}`, and `_includes/footer.html`. It SHALL accept a `layout_shell` front matter variable (`shell` or `wide`) defaulting to `shell`. |
| REQ-014 | `_includes/header.html` SHALL render a sticky header with the wordmark `formicary` linking to `/`, a `<nav aria-label="Site">` with links to Thesis, Scout, and About, and a theme toggle button with `data-theme-toggle`, `aria-pressed`, and `aria-label`. The active page link SHALL carry `aria-current="page"` driven by `page.url`. |
| REQ-015 | `_includes/footer.html` SHALL render a footer containing a CC BY 4.0 licence link and the author name "Adrian Rossouw" as a hyperlink to `https://adrian.rossouw.ie`, followed by ", 2026". No em-dashes. |
| REQ-016 | `_includes/epistemic.html` SHALL accept include variables `label`, `fields` (hash of label/value pairs), and `note`. It SHALL render `<aside class="epistemic">` with `.epistemic__label`, `<dl class="epistemic__fields">`, and `<p class="epistemic__note">`. It SHALL be reusable across pages. |
| REQ-017 | All CSS transitions and animations SHALL be disabled when `prefers-reduced-motion: reduce` is active. The Scout pulse animation and theme transitions SHALL not run under reduced motion. |
| REQ-018 | `index.md` SHALL use the default layout with `layout_shell: shell`. Page content SHALL be sourced from `docs/_brief/build_spec/formicary-thesis-web.md`. The leading blockquote SHALL be replaced with `{% include epistemic.html %}`. |
| REQ-019 | The landing page masthead SHALL render the title "What survives the agent" and the deck/subtitle immediately below it, presented as a visual pair with an accent keyline above the deck. |
| REQ-020 | All Atom XML parsing and `<summary>` HTML extraction logic SHALL reside in a single exported function `parseFeed(xmlString)`. The renderer and filter logic SHALL only receive structured item objects from this function; they SHALL NOT access raw XML or summary HTML directly. |
| REQ-021 | Each Scout feed item card SHALL render the agent's analysis text as the primary visually prominent element. Title (linked), source domain, date, score signal pips, score label, rationale, and tags SHALL be rendered as quieter metadata. Score-5 items SHALL receive a 2px accent left border and accent-coloured signal pips and label. |
| REQ-022 | The Scout page SHALL provide relevance filter chips (All, Direct impact, Highly relevant, Worth tracking) as single-select, and dynamically generated tag chips as multi-select with OR logic. An item MUST match both the active relevance filter AND the active tag set (AND logic across filter dimensions). |
| REQ-023 | `about.md` SHALL use the default layout with `layout_shell: shell`. Content SHALL be sourced from `docs/_brief/build_spec/formicary-about.md`. The AI-use disclosure block SHALL be rendered using `{% include epistemic.html label="AI-use disclosure" %}`. |
| REQ-024 | The about page SHALL render a two-column "What it is / What it isn't" block using `.col2` and `.isnt-list`. At viewport widths below 720px the block SHALL collapse to a single column. |
| REQ-025 | The about page SHALL include a contact section as `dl.bio-grid` with rows for Email (`formicary@localghost.ie`), Personal (linking to `https://adrian.rossouw.ie`), Writing, Feed, and Licence. No em-dashes in contact copy. |
| REQ-026 | `docs/requirements.md` SHALL exist and contain all site requirements as numbered REQ-NNN entries with EARS-style statements using SHALL/MUST. The REQ-ID commit convention SHALL be documented with an example. |
| REQ-027 | `docs/traceability.md` SHALL contain a table mapping every REQ-ID to: implementing file(s) and verification method. It SHALL be updated whenever a requirement is implemented or added. REQ-004 SHALL list `tests/scout.test.js` as its verification method. |
| REQ-028 | `docs/hazards.md` SHALL contain a hazard register with at minimum the four seeded hazards (feed HTML injection, CNAME drop on deploy, SHA-pinned feed URL, feed unavailability/CORS), each with a stated control measure and the REQ-ID of the controlling requirement. |
| REQ-029 | `docs/soup.md` SHALL contain a SOUP register listing all external and third-party components: Jekyll (version), `jekyll-seo-tag`, `actions/checkout`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, and the Scout Atom feed (external data source), each with version/reference and purpose. |
| REQ-030 | Every commit that implements or modifies a site requirement SHALL reference the relevant REQ-ID(s) in the commit message subject or body, following the convention documented in REQ-026. |
| REQ-031 | A Vitest test suite SHALL exist at `tests/scout.test.js` covering `parseFeed`, `parseSummaryHtml`, `extractScore`, and `filterItems` exported from `assets/js/scout.js`. Tests SHALL use a real feed fixture. The suite SHALL be runnable via `npm test`. |
| REQ-032 | The `parseFeed` test group SHALL verify: valid Atom XML returns correctly structured objects; items are sorted newest-first; an empty feed returns `[]`; malformed XML returns `[]` without throwing. |
| REQ-033 | The `parseSummaryHtml` test group SHALL verify: analysis text is extracted from the correct paragraph; all returned fields are plain text strings with no HTML tags. |
| REQ-034 | The `extractScore` test group SHALL verify: score integer and label are correctly extracted for values 3, 4, and 5; an unrecognised string returns a default score of 3. |
| REQ-035 | The `filterItems` test group SHALL verify: `rel="all"` returns all items; rel filter by score value works; tag filter uses OR logic; combined rel + tag filters use AND logic. |
| REQ-036 | The test suite SHALL include an assertion that a feed item whose analysis contains `<script>alert(1)</script>` does not produce a `<script>` element in the rendered card DOM. This test is the primary verification method for REQ-004. |
