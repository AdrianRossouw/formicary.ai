## Context

formicary.ai is a new greenfield static site. All design tokens, reference HTML, and page content are already provided in `docs/_brief/`. The build spec and design brief are the source of truth for visual and content decisions; this document covers the technical architecture decisions made on top of them.

The site has one genuinely interactive surface: the `/scout` page, which fetches a live Atom feed, parses it, and renders filterable cards. Everything else is static markup. The Scout feed's current format embeds structured data (analysis, score, rationale, tags) as inline-styled HTML inside `<summary type="html">` elements — this is a known temporary state; the feed format will be revised after launch.

## Goals / Non-Goals

**Goals:**
- Ship a public three-page site at `formicary.ai` deployable from `main` via GitHub Actions
- Safe, always-live Scout feed render with explicit loading/empty/error states
- Full design-system fidelity from the provided tokens and reference HTML
- Proportionate regulated-software artifact discipline (REQ-IDs, traceability, hazards, SOUP)
- Clean, traceable git history with REQ-ID commit convention
- Unit-tested Scout parsing pipeline

**Non-Goals:**
- Server-side rendering, databases, or any backend
- Full E2E or visual regression testing
- Updating Scout's feed format (deferred post-launch)
- Implementing the CI traceability check (stretch goal, never a blocker)
- Supporting browsers without `fetch`, `DOMParser`, or CSS custom properties

## Decisions

### Jekyll over Astro or other SSGs

The build spec mandates Jekyll with GitHub Actions. The built-in Pages workflow runs Jekyll in safe mode (whitelisted gems only); a custom Actions workflow removes that constraint and is what we use. Jekyll is the correct choice given the author's stated comfort with CI and the simplicity of the content model (three markdown/HTML pages, one data file).

**Alternatives considered:** Astro was an open decision in earlier vault notes. Deferred until after launch at minimum; the design tokens and reference HTML are framework-agnostic and will port cleanly.

### Client-side fetch for Scout feed

The Scout feed is fetched at runtime by the browser from the unpinned gist URL. The build spec recommends this as the default: always-live, decoupled from the build, CORS confirmed permissive on the gist raw endpoint.

**Alternative:** Build-time fetch in Actions with a scheduled rebuild cron. This gives a fully static page with no CORS dependency but trades live-freshness for robustness. Deferred as an upgrade path; the error state on the client-side version handles feed unavailability gracefully.

**Consequence:** `_data/scout.json` (copied from the design brief's `scout-feed.json`) serves as a local development reference and data-shape contract only — it is never loaded in production.

### parseFeed isolation

All Atom-parsing and summary-HTML-extraction logic lives in a single exported `parseFeed(xmlString)` function in `assets/js/scout.js`. The renderer and filter state only ever receive the structured objects this function returns. When the Scout feed format changes post-launch, `parseFeed` is the only function that needs to change.

**Rationale:** The current feed format (HTML-embedded summaries) is explicitly temporary. Coupling the renderer to the parsing logic would make the format upgrade a larger refactor.

### textContent-only rendering (REQ-004)

All Scout card content is rendered via `document.createElement` + `.textContent` assignment. No `innerHTML`, `insertAdjacentHTML`, or `dangerouslySetInnerHTML` anywhere in the Scout rendering path. The summary HTML is parsed with `DOMParser` solely to extract text nodes — the parsed DOM is never attached to the document.

**Rationale:** The feed is external, untrusted content. This is REQ-004 and is non-negotiable.

### Vitest for Scout unit tests

Vitest with jsdom environment. Zero-config for vanilla JS, fast, handles DOM APIs via jsdom. Tests cover the four pure/near-pure functions in `scout.js`: `parseFeed`, `parseSummaryHtml`, `extractScore`, `filterItems`.

**Alternatives considered:** Jest (heavier config for ESM), Playwright (wrong level — E2E overkill for unit-testing parsing logic).

### tokens.css as single source of truth

`assets/css/tokens.css` is copied verbatim from `docs/_brief/design_brief/tokens.css`. No values are re-derived or overridden elsewhere. All Jekyll layouts and includes reference only the custom properties defined there.

**Rationale:** The design brief is explicit: "Do not re-derive values — they are intentional." OKLCH colour values in particular must not be converted.

### OpenSpec for spec workflow

`openspec init` installs the `/opsx:propose` → `/opsx:apply` → `/opsx:archive` workflow. Future site changes (new pages, Scout format upgrade, CI traceability check) go through `/opsx:propose` to produce a traceable proposal + spec + design + tasks before any implementation.

## Risks / Trade-offs

- **Feed unavailability** → Explicit error state with non-alarming message. The readout bar shows the last-run timestamp from the feed, so a stale render is distinguishable from a fetch failure.
- **CNAME dropped on deploy** → CNAME file kept in source root; Jekyll copies it to `_site/` on every build. Controlled and noted in `docs/hazards.md`.
- **SHA-pinned feed URL** → Source uses the unpinned gist URL. Noted in `docs/hazards.md`. REQ-003 traceability entry points to the URL literal in `scout.js`.
- **Summary HTML parsing brittleness** → If Scout changes its output HTML structure, `parseSummaryHtml` may silently return empty strings. The Scout format change is planned post-launch; Vitest tests use a real feed fixture so regressions will surface immediately.
- **Google Fonts dependency** → `tokens.css` imports from `fonts.googleapis.com`. In environments where this is blocked the page degrades to the fallback font stack (Georgia / IBM Plex fallbacks). Acceptable for a personal research site; self-hosting is an upgrade path.

## Open Questions

- **Subtitle finalisation:** The masthead deck is currently "borrowing regulated-software discipline to make AI code last" (provisional). Author may revise; no code dependency.
- **CI traceability check:** Whether to add a build-step that fails if any REQ-ID in `docs/requirements.md` has no entry in `docs/traceability.md`. Treat as stretch; design the Action job slot now, implement only if ship is safe.
- **Repo visibility:** Pages on a private repo requires a paid GitHub plan. Must be confirmed public before enabling GitHub Pages.
