## Why

Scout will emit a new entry type — weekly roundup entries — alongside regular item entries in the existing Atom feed. The site currently has no way to detect or render these; without handling them they will either render broken as item cards or be silently ignored.

## What Changes

- The Atom feed gains a new entry type distinguishable from regular item entries (e.g. via a `<category>` term or a distinct summary structure).
- `parseFeed` and `parseSummaryHtml` in `assets/js/scout.js` are updated to detect and parse weekly entries into a new item shape.
- The Scout page renders weekly entries as a distinct card style — digest format, not a single-article card.
- `docs/scout-feed-format.md` (REQ-039) is updated to document the weekly entry format as part of the feed interface contract.
- The test fixture and test suite are extended to cover the new entry type.

## Capabilities

### New Capabilities

- `scout-weekly-card`: Detect weekly roundup entries in the feed and render them as a distinct digest card on the Scout page.

### Modified Capabilities

- `scout-page`: Feed parsing logic (`parseFeed`, `parseSummaryHtml`) gains a new entry type; the Scout page renderer handles the new card variant.
- `scout-tests`: Test fixture and coverage extended to include weekly entry parsing and rendering.

## Impact

- `assets/js/scout.js` — `parseFeed`, `parseSummaryHtml`, card renderer
- `tests/scout.test.js` — fixture and test cases
- `docs/scout-feed-format.md` — feed interface contract (REQ-039)
- `scout.html` — may need CSS class additions if weekly card requires distinct styling
- `assets/css/tokens.css` — no changes expected; weekly card reuses existing design tokens
- No dependency or build changes required
