## MODIFIED Requirements

### Requirement: REQ-031 Vitest unit test suite for Scout parsing pipeline

A Vitest test suite SHALL exist at `tests/scout.test.js` covering `parseFeed`, `parseSummaryHtml`, `extractScore`, and `filterItems` exported from `assets/js/scout.js`. The suite SHALL be runnable via `npm test`.

#### Scenario: Test suite runs and passes

- **WHEN** `npm test` is run in the project root
- **THEN** all tests pass with zero failures

### Requirement: REQ-032 parseFeed tests

The `parseFeed` test group SHALL include a test verifying that weekly entries are filtered. The test SHALL use an Atom XML fixture containing at least one entry whose `<id>` contains `/scout/weekly/` and verify that entry does not appear in the returned array.

#### Scenario: Weekly entry is filtered from parseFeed output

- **WHEN** `parseFeed` is called with an Atom XML fixture containing a weekly entry (id contains `/scout/weekly/`)
- **THEN** the returned array does not include that entry

#### Scenario: Regular entries alongside a weekly entry are unaffected

- **WHEN** `parseFeed` is called with a fixture containing one weekly entry and two regular entries
- **THEN** the returned array contains exactly the two regular entries
