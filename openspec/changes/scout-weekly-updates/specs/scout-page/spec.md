## MODIFIED Requirements

### Requirement: REQ-020 parseFeed isolation

All Atom XML parsing and `<summary>` HTML extraction logic SHALL reside in `parseFeed(xmlString)` and the functions it delegates to: `parseSummaryHtml` for regular item entries and `parseWeeklySummaryHtml` for weekly entries. The renderer and filter logic SHALL only receive structured item objects from these functions; they SHALL NOT access raw XML or summary HTML directly. Entry type detection (regular vs weekly) SHALL occur inside `parseFeed` by inspecting the Atom `<category>` element.

#### Scenario: parseFeed returns structured objects for regular entries

- **WHEN** `parseFeed` is called with a valid Atom XML string containing regular entries
- **THEN** it returns an array of objects each containing `type`, `title`, `url`, `updated`, `analysis`, `score`, `label`, `rationale`, `tags`, and `domain` fields

#### Scenario: parseFeed returns structured objects for weekly entries

- **WHEN** `parseFeed` is called with a valid Atom XML string containing a weekly entry (id contains `/scout/weekly/`)
- **THEN** the weekly item object contains `type`, `title`, `updated`, `lede`, `date`, and `tags` fields

#### Scenario: Renderer does not access raw XML

- **WHEN** `assets/js/scout.js` is statically inspected
- **THEN** no DOM manipulation code outside of `parseFeed`, `parseSummaryHtml`, and `parseWeeklySummaryHtml` accesses the raw XML string or summary HTML
