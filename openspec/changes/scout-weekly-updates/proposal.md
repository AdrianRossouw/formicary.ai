## Why

Scout now emits weekly roundup entries alongside regular item entries in the existing Atom feed (confirmed in live feed 2026-06-07). The site currently has no detection for these; without handling, they render broken as item cards with empty score fields.

## What Changes

- `parseFeed` in `assets/js/scout.js` is updated to detect and silently drop weekly entries before they reach the renderer.
- The test suite is extended to verify that weekly entries are filtered out.
- `docs/scout-feed-format.md` (REQ-039) is updated to document the filtering decision.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scout-page`: `parseFeed` gains weekly entry filtering — entries whose `<id>` contains `/scout/weekly/` are dropped before the item array is returned.
- `scout-tests`: Test coverage extended to verify weekly entries are filtered.

## Impact

- `assets/js/scout.js` — `parseFeed` only (one guard condition)
- `tests/scout.test.js` — one new fixture + one new test case
- `docs/scout-feed-format.md` — feed interface contract (REQ-039)
- No CSS, HTML, build, or dependency changes required
