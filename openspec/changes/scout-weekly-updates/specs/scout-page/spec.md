## MODIFIED Requirements

### Requirement: REQ-020 parseFeed isolation

All Atom XML parsing and `<summary>` HTML extraction logic SHALL reside in `parseFeed(xmlString)` and the functions it delegates to (`parseSummaryHtml`). The renderer and filter logic SHALL only receive structured item objects from `parseFeed`; they SHALL NOT access raw XML or summary HTML directly.

`parseFeed` SHALL silently drop any entry whose `<id>` value contains the path segment `/scout/weekly/`. Such entries SHALL NOT appear in the returned item array.

#### Scenario: parseFeed returns structured objects for regular entries

- **WHEN** `parseFeed` is called with a valid Atom XML string containing regular entries
- **THEN** it returns an array of objects each containing `title`, `url`, `updated`, `analysis`, `score`, `label`, `rationale`, `tags`, and `domain` fields

#### Scenario: parseFeed filters weekly entries

- **WHEN** `parseFeed` is called with a feed containing an entry whose `<id>` contains `/scout/weekly/`
- **THEN** that entry does NOT appear in the returned array

#### Scenario: Renderer does not access raw XML

- **WHEN** `assets/js/scout.js` is statically inspected
- **THEN** no DOM manipulation code outside of `parseFeed` and `parseSummaryHtml` accesses the raw XML string or summary HTML
