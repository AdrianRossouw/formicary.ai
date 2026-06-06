## Why

formicary.ai needs a public presence to support a pre-interview push and establish the research project in public. The site is the thesis essay, a live Scout feed, and an about page — the minimum surface to make the work findable and credible. It is also a proportionate worked example of the artifact-shaped regulated-software discipline the thesis describes: dogfooding the methodology on the build itself.

## What Changes

- New Jekyll static site at `formicary.ai`, deployed via GitHub Actions to GitHub Pages
- Three pages: thesis landing (`/`), live Scout feed (`/scout`), about/contact (`/about`)
- Client-side Scout feed: fetches unpinned Atom feed from a GitHub Gist, parses it safely (textContent only, never innerHTML), renders analysis-forward cards with relevance and tag filtering
- Design system from a completed Claude Design pass: `tokens.css` (OKLCH colour tokens, type scale, spacing, components), `theme.js` (light/dark toggle, no-flash)
- Regulated-software methodology docs: `docs/requirements.md` (EARS REQ-IDs), `docs/traceability.md`, `docs/hazards.md`, `docs/soup.md`
- REQ-ID commit convention throughout: every commit touching source references its REQ-ID(s)
- Vitest unit tests for Scout parsing pipeline and filter logic
- OpenSpec managing the spec workflow for this and future site changes

## Capabilities

### New Capabilities

- `jekyll-site-scaffold`: Jekyll project structure, Gemfile, `_config.yml`, CNAME, `.gitignore`, GitHub Actions deploy workflow
- `design-system`: Design tokens CSS and theme JS as site-wide assets; Jekyll layouts and includes built from the design brief reference HTML
- `thesis-page`: Landing page rendering the thesis essay with masthead, epistemic-status callout, and long-form prose layout
- `scout-page`: `/scout` page with client-side Atom feed fetch, safe HTML-summary parsing, analysis-forward card rendering, relevance and tag filtering, loading/empty/error states
- `about-page`: About page with AI-use disclosure callout, two-column is/isn't block, contact section
- `methodology-docs`: Regulated-software artifact docs (`docs/requirements.md`, `docs/traceability.md`, `docs/hazards.md`, `docs/soup.md`) with seeded content
- `scout-tests`: Vitest unit test suite covering Atom parsing, summary HTML extraction, score parsing, and filter logic

### Modified Capabilities

(none — greenfield project)

## Impact

- New repository content throughout: `_layouts/`, `_includes/`, `assets/`, `_data/`, `docs/`, `openspec/`, `.github/workflows/`
- External dependency: unpinned GitHub Gist Atom feed (Scout's live output) fetched at runtime by the browser — not a build dependency
- Design tokens CSS (`assets/css/tokens.css`) is the single source of truth for all visual values; nothing derives from it independently
- The CNAME file must survive every deploy or the custom domain drops — controlled by keeping it in the source tree
- No server-side logic; no database; no authentication surface
