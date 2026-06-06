# formicary.ai build spec (for Claude Code)

## Stack and hosting
- **Jekyll, built and deployed via GitHub Actions.** Author is comfortable with CI (Azure Pipelines background), so a standard Actions workflow is fine. The built-in Jekyll Pages workflow is the simplest start; a custom workflow is fine if any non-whitelisted gems or plugins are wanted (the built-in branch build runs Jekyll in safe mode with whitelisted gems only).
- DNS already configured and valid: apex A records to GitHub Pages plus `www` CNAME to `adrianrossouw.github.io`. Enable Enforce HTTPS once the cert issues.
- Keep the `CNAME` file (`formicary.ai`) in the source so the workflow copies it into the published output. If it is missing from the deployed output, the custom domain drops.
- **Confirm first:** repo visibility. Pages on a private repo needs a paid plan (and Actions minutes are metered on private repos); if on Free, the repo must be public.

## Design tokens
Come from a separate Claude Design pass (font families, type scale, colours, spacing, measure as CSS custom properties). Wire them into the layout CSS. Do not invent a design.

## Content
- **Landing page body** = `formicary-thesis-web.md` (provided). Standard Jekyll markdown page. The leading blockquote is the epistemic-status callout: style it with the callout component, not as a default blockquote.
- **About page:** short CV-grounded bio, what Formicary is and isn't, an AI-use disclosure near the top, contact email at the `rossouw.ie` domain. (Copy to be supplied by author.)
- **Footer:** "CC BY 4.0"; "Adrian Rossouw, 2026".

## /scout page (live feed render)
**Source feed (unpinned, always-latest):**
`https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml`
Do NOT use a SHA-pinned gist URL; that freezes the page to one revision.

**Approach.** Client-side `fetch` plus `DOMParser` is the recommended default: always-live, decoupled from the build, and confirmed working (gist raw returns permissive CORS headers). Now that Actions is in use, a build-time fetch with a scheduled rebuild (cron workflow) is also viable if a fully static, CORS-independent /scout is preferred; it trades live-freshness for robustness. Client-side unless there is a reason to prefer static.

**Parse (Atom).** Per `<entry>`: title; link (`rel="alternate"` href, else first link href); date (`updated`, else `published`); author name; categories (`term`, may be multiple); body = prefer `<content>`, fall back to `<summary>`.

**Render.** Analysis-forward cards: the content/summary text is the focal element; title (linked), source domain, and date are quiet metadata; categories as small tags. Sort newest-first.

**Safety.** Render the analysis as TEXT (`textContent` plus `white-space: pre-wrap`) by default. Do NOT `innerHTML` untrusted feed content. If the analysis turns out to be markdown or HTML you want formatted, add a sanitizer (e.g. DOMPurify) and a renderer first; never inject unsanitized.

**States.** Explicit loading, empty, and error states. The error state matters given feed/URL fragility; keep the message clear and non-alarming.

**Accessibility.** Semantic HTML (`article`, `h2`, `time`), discernible link text.

**Explainer copy (author may revise):**
> Scout is an autonomous agent I built. Twice a day it reads the AI landscape, decides what is relevant to the work on this site, and writes up why. This page is its live output. Nothing here was selected by hand.

## Build under the methodology (dogfooding), proportionate, not a quality system
This site is a small, honest worked example of the artifact-shaped techniques the thesis describes. Apply them at a weight **proportionate to a three-page static site**: lightweight markdown artifacts in the repo (e.g. a `docs/` folder), not a full quality management system, and nothing that risks the ship date. The fuller worked example will live on the Scout project later; keep this one light. The public page must never claim more methodology than the repo actually shows.

Set up the structure and apply the discipline; the author will fill in the substantive content.

- **Requirements spec with REQ-IDs** (`docs/requirements.md`), EARS-style where it helps. Author to supply/confirm the real requirements. Seed examples: REQ-001 site serves over HTTPS on the apex domain; REQ-002 landing renders the epistemic-status callout from the leading blockquote; REQ-003 /scout fetches the unpinned feed and renders newest-first; REQ-004 feed analysis is rendered as text, never injected as HTML; REQ-005 no em-dashes in UI copy.
- **Traceability table** (`docs/traceability.md`): each REQ-ID to its implementing file(s) to how it is verified. A simple table, not a matrix tool.
- **Commit convention:** every commit that implements or changes a requirement references its REQ-ID in the message. (This is the exact technique Gen 001 measures, so the site dogfoods the experiment.)
- **Lightweight hazard/risk note** (`docs/hazards.md`): what can go wrong and the control for it. Seed with hazards already identified: feed content injecting HTML (control: text-only render); CNAME dropping on deploy (control: CNAME in published output); SHA-pinned feed URL freezing the page (control: unpinned URL); CORS or feed unavailability (control: explicit error state).
- **SOUP register** (`docs/soup.md`): external and third-party components and their provenance: Jekyll and its gems, the Actions used, and the external Scout feed as an external data source. A handful of entries.
- **Optional stretch (only if the ship is safe):** a CI step in the Actions workflow that enforces the traceability discipline, e.g. fail the build if a REQ-ID in the spec has no implementing reference, or if a commit touching source omits a REQ-ID. This is the "build-time validation" idea. Treat it as a nice-to-have, never a blocker.

## Known caveat to surface, not fix
The feed is currently targeted on agent-orchestration and coding-agent topics (pre-retarget), so items will look off-thesis until Scout's steering (`scout.md`) is re-aimed. That is a separate Scout task, not part of this site build.

## Copy constraints across the whole build
No em-dashes, no "load-bearing", no emoji in any UI copy.
