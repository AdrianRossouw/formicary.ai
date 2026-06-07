## 1. Feed format contract

- [x] 1.1 Confirm weekly entry format from live feed (fetched 2026-06-07): detection via `/scout/weekly/` in `<id>`; filter approach agreed
- [x] 1.2 Update `docs/scout-feed-format.md` to note that the site filters weekly entries

## 2. Implementation — filter in parseFeed

- [ ] 2.1 In `assets/js/scout.js`, inside `parseFeed(xmlString)`: after parsing each entry's `<id>`, add `if (id.includes('/scout/weekly/')) continue;` to drop weekly entries before they are pushed to the result array

## 3. Tests

- [ ] 3.1 In `tests/scout.test.js`, add a weekly entry fixture: an Atom XML `<entry>` with `<id>https://formicary.dev/scout/weekly/2026-06-07</id>` and a minimal `<summary type="html">`
- [ ] 3.2 Add a `parseFeed` test: a feed with one weekly entry and two regular entries returns an array of length 2 containing only the regular entries
- [ ] 3.3 Run `npm test` — all tests pass

## 4. Requirements and traceability

- [ ] 4.1 Add REQ-040 to `docs/requirements.md`: `parseFeed` SHALL silently drop entries whose `<id>` contains `/scout/weekly/`
- [ ] 4.2 Update REQ-020 in `docs/requirements.md` to mention the weekly entry filter
- [ ] 4.3 Update REQ-032 in `docs/requirements.md` to mention the weekly entry filter test
- [ ] 4.4 Add REQ-040 row to `docs/traceability.md` pointing to `assets/js/scout.js` and `tests/scout.test.js`
- [ ] 4.5 Run `npm test` — traceability check passes

## 5. Commit and merge

- [ ] 5.1 Commit implementation: `feat(REQ-020,REQ-040): filter weekly roundup entries in parseFeed`
- [ ] 5.2 Commit tests: `test(REQ-031,REQ-032,REQ-040): add parseFeed filter test for weekly entries`
- [ ] 5.3 Commit requirements and traceability: `docs(REQ-026,REQ-027,REQ-040): add REQ-040 and update REQ-020, REQ-032`
- [ ] 5.4 Merge branch to main with `--no-ff`

## Context for implementer

**The entire logic change is one line in `assets/js/scout.js` inside `parseFeed`.**

Read `design.md` for full rationale. Read `docs/scout-feed-format.md` for the feed format contract and the weekly entry structure. Read `docs/requirements.md` for REQ-020 and REQ-032 before adding REQ-040 to understand the existing numbering.

Key files:
- Implementation: `assets/js/scout.js` — look for `parseFeed` function
- Tests: `tests/scout.test.js` — look for existing `parseFeed` test group
- Requirements: `docs/requirements.md`
- Traceability: `docs/traceability.md`
- Format contract: `docs/scout-feed-format.md`
