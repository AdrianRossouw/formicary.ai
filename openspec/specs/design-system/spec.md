# design-system Specification

## Purpose
TBD - created by archiving change formicary-ai-site. Update Purpose after archive.
## Requirements
### Requirement: REQ-012 Design tokens as single source of truth

`assets/css/tokens.css` SHALL be copied verbatim from `docs/_brief/design_brief/tokens.css`. No colour, spacing, type, or layout value SHALL be re-derived or hard-coded elsewhere in the codebase. All layouts and includes SHALL reference CSS custom properties defined in `tokens.css` exclusively. OKLCH colour values SHALL NOT be converted to hex or any other format.

#### Scenario: Token file is unmodified copy

- **WHEN** `assets/css/tokens.css` is diffed against `docs/_brief/design_brief/tokens.css`
- **THEN** the files are byte-for-byte identical

### Requirement: REQ-009 Theme toggle with no-flash guarantee

`assets/js/theme.js` SHALL be loaded in the `<head>` of every page, before the stylesheet link, so that the saved theme preference is applied before first paint. The script SHALL read `localStorage` key `formicary-theme` and apply `data-theme="dark"` to `<html>` if the stored value is `"dark"`. Light is the default (no attribute). Every `[data-theme-toggle]` button SHALL be wired on `DOMContentLoaded` to flip the theme and persist the new value. The toggle `aria-pressed` and `aria-label` SHALL stay in sync with the current theme.

#### Scenario: Dark preference applied before paint

- **WHEN** a user with `formicary-theme: "dark"` in localStorage loads any page
- **THEN** `<html data-theme="dark">` is set before the browser renders the first frame, with no white flash

#### Scenario: Toggle persists preference

- **WHEN** a user clicks the theme toggle
- **THEN** the theme flips, `localStorage` is updated, and `aria-pressed` on the button reflects the new state

### Requirement: REQ-013 Shared Jekyll shell layout

`_layouts/default.html` SHALL provide the full page shell: `<html>` with `lang="en"`, `<head>` (charset, viewport, title, `theme.js` before CSS, `tokens.css` link, SEO tags), skip link, `_includes/header.html`, `{{ content }}`, `_includes/footer.html`. The layout SHALL accept a `layout_shell` front matter variable (`shell` or `wide`) defaulting to `shell`, applied as a class on the main content wrapper.

#### Scenario: Layout renders valid shell

- **WHEN** any page using the default layout is built
- **THEN** the output contains exactly one `<header>`, one `<main>`, one `<footer>`, and one skip link as the first body child

### Requirement: REQ-014 Header with accessible navigation

`_includes/header.html` SHALL render a sticky header with: the wordmark `formicary` linking to `/`; a `<nav aria-label="Site">` containing links to Thesis, Scout, and About; a theme toggle button with `data-theme-toggle`, `aria-pressed`, and `aria-label`. The active page link SHALL carry `aria-current="page"` driven by `page.url`. Nav links SHALL use `.shell` or `.shell--wide` consistent with the current page.

#### Scenario: Active nav link is marked

- **WHEN** any of the three pages is rendered
- **THEN** exactly one nav link has `aria-current="page"` matching the current page URL

### Requirement: REQ-015 Footer

`_includes/footer.html` SHALL render a footer with a CC BY 4.0 licence link and the text "Adrian Rossouw, 2026". No em-dashes in footer copy.

#### Scenario: Footer content present

- **WHEN** any page is built
- **THEN** the footer contains the CC BY 4.0 link and the copyright string

### Requirement: REQ-016 Epistemic callout include

`_includes/epistemic.html` SHALL accept include variables `label`, `fields` (a hash of label/value pairs), and `note`. It SHALL render an `<aside class="epistemic">` with the label, a `<dl class="epistemic__fields">` of the fields, and a `<p class="epistemic__note">` for the note. It SHALL be reusable on both the thesis page and the about page.

#### Scenario: Callout renders all sections

- **WHEN** `{% include epistemic.html label="X" fields=hash note="Y" %}` is used
- **THEN** the rendered HTML contains `.epistemic__label`, `.epistemic__fields` with the correct dt/dd pairs, and `.epistemic__note`

### Requirement: REQ-017 Reduced-motion respect

All CSS transitions and animations defined in `tokens.css` SHALL be disabled when `prefers-reduced-motion: reduce` is set. The Scout pulse animation SHALL not run. Theme transitions SHALL not run.

#### Scenario: No animation under reduced-motion

- **WHEN** `prefers-reduced-motion: reduce` is active in the browser
- **THEN** the Scout pulse keyframe and all CSS transitions have effective duration of 0

