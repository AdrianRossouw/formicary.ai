## MODIFIED Requirements

### Requirement: REQ-031 Vitest unit test suite for Scout parsing pipeline

A Vitest test suite SHALL exist at `tests/scout.test.js` covering `parseFeed`, `parseSummaryHtml`, `parseWeeklySummaryHtml`, `extractScore`, and `filterItems` exported from `assets/js/scout.js`. Tests SHALL use real feed fixtures including at least one weekly entry. The suite SHALL be runnable via `npm test`.

#### Scenario: Test suite runs and passes

- **WHEN** `npm test` is run in the project root
- **THEN** all tests pass with zero failures

### Requirement: REQ-032 parseFeed tests

The `parseFeed` test group SHALL verify: a valid Atom XML string returns an array of item objects; regular entry objects have `type: "item"`; weekly entry objects have `type: "weekly"`; each regular item has `title`, `url`, `updated`, `analysis`, `score`, `label`, `rationale`, `tags`, and `domain` fields; weekly items have `title`, `updated`, `lede`, `date`, and `tags` fields; items are sorted newest-first by `updated`; an empty feed returns an empty array; a malformed XML string does not throw but returns an empty array.

#### Scenario: Valid feed with mixed entry types parsed correctly

- **WHEN** `parseFeed` is called with an Atom XML fixture containing both regular and weekly entries
- **THEN** it returns items with correct `type` fields and all required fields populated per type

#### Scenario: Weekly entry has correct shape

- **WHEN** `parseFeed` is called with a feed containing a weekly entry whose `<id>` contains `/scout/weekly/`
- **THEN** the weekly item has `type: "weekly"`, a non-empty `lede`, a non-empty `date`, and a `tags` array

## ADDED Requirements

### Requirement: parseWeeklySummaryHtml tests

The `parseWeeklySummaryHtml` test group SHALL verify: `date` is extracted from the second `<p>` of the first child `<div>` (header block); `lede` is extracted from the `<p>` of the second child `<div>` (content block); `tags` is extracted from `<span>` elements of the third child `<div>` (tags block); all returned values are plain text strings with no HTML tags; a missing third child div returns `tags: []` without throwing.

#### Scenario: Weekly summary fields extracted correctly

- **WHEN** `parseWeeklySummaryHtml` is called with a valid weekly summary HTML fixture
- **THEN** it returns an object with non-empty `date`, `lede`, and a `tags` array

#### Scenario: No HTML tags in output

- **WHEN** `parseWeeklySummaryHtml` is called with a summary containing HTML tags in text nodes
- **THEN** all string fields contain no angle-bracket characters
