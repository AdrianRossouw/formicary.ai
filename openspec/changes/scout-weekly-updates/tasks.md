## 1. Feed format contract

- [x] 1.1 Confirm weekly entry format from live feed (fetched 2026-06-07): URL-based detection (`/scout/weekly/` in `<id>`), no `<category>` tag; single `date` + `lede` + `tags` shape; no highlights list
- [x] 1.2 Update `docs/scout-feed-format.md` to document weekly entry type: URL detection, actual summary HTML structure, and derived item fields

## 2. Parsing — detection and weekly summary

- [ ] 2.1 Add `parseWeeklySummaryHtml(htmlString)` to `assets/js/scout.js` — extracts `date`, `lede`, `tags` via `textContent` only (first child div second p → date; second child div p → lede; third child div spans → tags)
- [ ] 2.2 Update `parseFeed` to detect `/scout/weekly/` in `entry.id` and set `type: "item"` or `type: "weekly"` on each item
- [ ] 2.3 Update `parseFeed` to call `parseWeeklySummaryHtml` for weekly entries and compose the weekly item shape (`type`, `title`, `url`, `updated`, `date`, `lede`, `tags`)

## 3. Rendering

- [ ] 3.1 Update `makeCard` in `assets/js/scout.js` to branch on `item.type`
- [ ] 3.2 Implement weekly digest card: `data-type="weekly"` on `<li>`, lede as `.feed__analysis`, `date` display, tags — no score pips, no single-article link
- [ ] 3.3 Verify regular item cards are visually unchanged

## 4. Tests

- [ ] 4.1 Add a weekly entry fixture to `tests/scout.test.js` (Atom XML with `/scout/weekly/` id + summary HTML matching actual format)
- [ ] 4.2 Add `parseFeed` tests for weekly entry detection (URL pattern) and item shape (`date`, `lede`, `tags`)
- [ ] 4.3 Add `parseWeeklySummaryHtml` test group: field extraction (`date`, `lede`, `tags`), no HTML tags, missing tags block
- [ ] 4.4 Add card renderer tests for weekly card (data-type, no pips, lede present, regular cards unaffected)
- [ ] 4.5 Run `npm test` — all tests pass

## 5. Requirements and traceability

- [ ] 5.1 Add new REQ-IDs to `docs/requirements.md` for weekly entry detection (REQ-040), `parseWeeklySummaryHtml` (REQ-041), and weekly card rendering (REQ-042)
- [ ] 5.2 Update REQ-020, REQ-031, REQ-032 in `docs/requirements.md` to reflect modified behaviour (or confirm delta specs cover it)
- [ ] 5.3 Update `docs/traceability.md` with new and modified requirements
- [ ] 5.4 Run `npm test` — traceability check passes

## 6. Commit and merge

- [ ] 6.1 Commit feed format contract update: `docs(REQ-039,...): update scout feed format contract for weekly entry type`
- [ ] 6.2 Commit parsing changes: `feat(REQ-020,REQ-040,REQ-041,...): add weekly entry detection and parseWeeklySummaryHtml`
- [ ] 6.3 Commit rendering changes: `feat(REQ-042,...): add weekly digest card renderer`
- [ ] 6.4 Commit test additions: `test(REQ-031,REQ-032,REQ-040,REQ-041,REQ-042,...): extend suite for weekly entries`
- [ ] 6.5 Commit requirements and traceability: `docs(REQ-026,REQ-027,...): add REQ-040 through REQ-042 and update modified requirements`
- [ ] 6.6 Merge branch to main with `--no-ff`
