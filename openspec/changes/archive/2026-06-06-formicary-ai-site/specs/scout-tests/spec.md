## ADDED Requirements

### Requirement: REQ-031 Vitest unit test suite for Scout parsing pipeline

A Vitest test suite SHALL exist at `tests/scout.test.js` covering the four core functions exported from `assets/js/scout.js`: `parseFeed`, `parseSummaryHtml`, `extractScore`, and `filterItems`. Tests SHALL use a real feed fixture (a captured Atom XML fragment from the live feed) rather than synthetic data. The suite SHALL be runnable via `npm test`.

#### Scenario: Test suite runs and passes

- **WHEN** `npm test` is run in the project root
- **THEN** all tests pass with zero failures

### Requirement: REQ-032 parseFeed tests

The `parseFeed` test group SHALL verify: a valid Atom XML string returns an array of item objects; each object has `title`, `link`, `updated`, `analysis`, `score`, `label`, `rationale`, `tags`, and `domain` fields; items are sorted newest-first by `updated`; an empty feed (zero entries) returns an empty array; a malformed XML string does not throw but returns an empty array.

#### Scenario: Valid feed parsed correctly

- **WHEN** `parseFeed` is called with a two-entry Atom XML fixture
- **THEN** it returns an array of two objects in newest-first order with all required fields populated

#### Scenario: Empty feed returns empty array

- **WHEN** `parseFeed` is called with an Atom feed containing no entries
- **THEN** it returns `[]`

#### Scenario: Malformed XML does not throw

- **WHEN** `parseFeed` is called with invalid XML
- **THEN** it returns `[]` without throwing

### Requirement: REQ-033 parseSummaryHtml tests

The `parseSummaryHtml` test group SHALL verify: the analysis text is extracted from the correct paragraph (second `<p>` before the score div); the score line text is extracted from the first `<p>` inside the score div; the rationale text is extracted from the second `<p>` inside the score div; tags are extracted as an array of strings from the `<span>` elements; all extracted values are plain text strings with no HTML tags.

#### Scenario: Analysis extracted as plain text

- **WHEN** `parseSummaryHtml` is called with a summary HTML string containing an analysis paragraph
- **THEN** it returns an object whose `analysis` field is a plain text string matching the paragraph text

#### Scenario: No HTML tags in extracted values

- **WHEN** `parseSummaryHtml` is called with a summary containing HTML tags within text nodes
- **THEN** all returned string fields contain no angle-bracket characters

### Requirement: REQ-034 extractScore tests

The `extractScore` test group SHALL verify: the score integer is correctly extracted from strings of the form "🐜 Scout — 🟡 3/5 — Worth tracking"; the label string is correctly extracted; score values 3, 4, and 5 are all handled; an unrecognised string returns a default score of 3.

#### Scenario: Score and label extracted from score line

- **WHEN** `extractScore` is called with "🐜 Scout — 🟡 3/5 — Worth tracking"
- **THEN** it returns `{ score: 3, label: "Worth tracking" }`

#### Scenario: All score levels handled

- **WHEN** `extractScore` is called with score lines for 3, 4, and 5
- **THEN** each returns the correct numeric score and label string

### Requirement: REQ-035 filterItems tests

The `filterItems` test group SHALL verify: `state.rel = "all"` returns all items; `state.rel = "5"` returns only score-5 items; `state.tags = ["foo"]` returns only items containing "foo" in their tags; two active tags apply OR logic (items with either tag are returned); combined rel + tags filters apply AND logic; an empty tags array with a rel filter applies only the rel filter.

#### Scenario: Relevance filter works

- **WHEN** `filterItems` is called with a mixed-score item array and `state.rel = "5"`
- **THEN** only items with score 5 are returned

#### Scenario: Tag filter uses OR logic

- **WHEN** `filterItems` is called with `state.tags = ["foo", "bar"]`
- **THEN** items with tag "foo" OR tag "bar" are returned, not only items with both

#### Scenario: Combined filters use AND logic

- **WHEN** `filterItems` is called with both a rel filter and a tag filter active
- **THEN** only items satisfying both conditions are returned

### Requirement: REQ-036 REQ-004 safety assertion

The test suite SHALL include a test asserting that the DOM rendered by the Scout card renderer for a feed item containing `<script>alert(1)</script>` in its analysis does not produce a `<script>` child element in the rendered card. This test SHALL be listed in `docs/traceability.md` as the primary verification method for REQ-004.

#### Scenario: Script tag in analysis does not execute

- **WHEN** a feed item with `<script>alert(1)</script>` in its analysis field is rendered by the card renderer
- **THEN** the rendered DOM contains no `<script>` element child and the text appears literally as a string
