## Context

Scout now emits weekly roundup entries alongside regular item entries in the Atom feed (confirmed 2026-06-07 by fetching the live Gist). The site's `parseFeed` function has no detection for these entries; without handling they render as broken item cards with empty score and analysis fields.

The simplest correct fix is to filter them out inside `parseFeed` — they never reach the renderer and the existing rendering path is untouched.

## Decision

**Filter weekly entries in `parseFeed`, before the item array is returned.**

Weekly entries are identified by `/scout/weekly/` appearing in the entry's `<id>` value (e.g. `https://formicary.dev/scout/weekly/2026-06-07`). Any entry matching this pattern is dropped silently.

**Rationale:** The weekly digest is already readable at its canonical URL. Adding a rendering path for it in the feed would require a new card design, new parsing logic, and new tests across all three layers. Filtering is the smallest change that prevents broken output and costs one guard condition plus one test.

**Alternative considered:** Detect and render weekly entries as a distinct card type. Rejected as disproportionate work for the current phase — revisit if the weekly digest needs to surface on the Scout page.

## Implementation notes

In `assets/js/scout.js`, inside `parseFeed(xmlString)`, after extracting each entry's `<id>` text:

```js
if (id.includes('/scout/weekly/')) continue;
```

This is the entire logic change. No new functions, no new item fields, no renderer changes.

## Risks / Trade-offs

- **Silent drop** — Weekly entries disappear from the Scout page without explanation. This is acceptable; the digest is not a single article and has its own URL.
- **URL scheme change** — If Scout changes the `/scout/weekly/` URL pattern, filter stops working and weekly entries render broken again. Mitigation: `docs/scout-feed-format.md` documents the contract; any URL change requires a coordinated update here.
- **Forward compatibility** — If weekly entries should appear on the Scout page in a future phase, the filter is a one-line removal. The detection URL pattern is already documented.

## Open Questions

None. Detection mechanism confirmed from live feed. Filter approach agreed.
