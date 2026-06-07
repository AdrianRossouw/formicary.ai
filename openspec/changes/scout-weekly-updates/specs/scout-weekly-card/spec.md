## ADDED Requirements

### Requirement: Weekly entry detection via URL path

`parseFeed` SHALL identify weekly roundup entries by the presence of `/scout/weekly/` in the entry's `<id>` value. Detected weekly entries SHALL have `type: "weekly"` set on the returned item object. All other entries SHALL have `type: "item"`. If a `<category term="weekly-roundup">` element is also present, it SHALL be treated as an alternative detection signal (forward-compatible).

#### Scenario: Weekly entry sets type field

- **WHEN** `parseFeed` is called with a feed containing an entry whose `<id>` contains `/scout/weekly/`
- **THEN** the corresponding item object has `type` equal to `"weekly"`

#### Scenario: Regular entry sets type field

- **WHEN** `parseFeed` is called with a feed containing an entry whose `<id>` does not contain `/scout/weekly/`
- **THEN** the corresponding item object has `type` equal to `"item"`

### Requirement: Weekly summary parsing via parseWeeklySummaryHtml

A new exported function `parseWeeklySummaryHtml(htmlString)` SHALL parse the summary HTML of a weekly entry and return an object with `date` (string), `lede` (string), and `tags` (string array). The structure keyed on is: first child `<div>` (header) → second `<p>` for `date`; second child `<div>` (content) → `<p>` for `lede`; third child `<div>` (tags) → `<span>` elements for `tags`. All values SHALL be extracted via `textContent` only — no `innerHTML` (REQ-004).

#### Scenario: Weekly summary fields extracted

- **WHEN** `parseWeeklySummaryHtml` is called with a valid weekly summary HTML string
- **THEN** it returns an object with non-empty `date`, `lede`, and `tags` array

#### Scenario: Output contains no HTML tags

- **WHEN** `parseWeeklySummaryHtml` is called with a summary containing HTML tags within text nodes
- **THEN** all returned string fields contain no angle-bracket characters

#### Scenario: Missing tags block returns empty array

- **WHEN** `parseWeeklySummaryHtml` is called with a summary that has no third child `<div>`
- **THEN** `tags` is an empty array and no error is thrown

### Requirement: Weekly card rendered as digest

The card renderer SHALL branch on `item.type`. Weekly entries (`type: "weekly"`) SHALL render a digest card that: carries `data-type="weekly"` on the `<li>`; displays the `lede` as the primary text element; displays `date` and `tags`; does NOT render score pips, a score label, or a single-article external link.

#### Scenario: Weekly card has data-type attribute

- **WHEN** a weekly item is passed to the card renderer
- **THEN** the rendered `<li>` has `data-type="weekly"`

#### Scenario: Weekly card has no score pips

- **WHEN** a weekly item is passed to the card renderer
- **THEN** the rendered card contains no `.signal__pips` element

#### Scenario: Weekly card shows lede as primary text

- **WHEN** a weekly item is passed to the card renderer
- **THEN** the rendered card contains a `.feed__analysis` element with the lede text

#### Scenario: Regular item cards are unaffected

- **WHEN** a regular item (`type: "item"`) is passed to the card renderer
- **THEN** the rendered card contains `.signal__pips` and is unchanged from current behaviour
