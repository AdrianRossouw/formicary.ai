## ADDED Requirements

### Requirement: REQ-003 Live feed fetch from unpinned URL

`/scout` SHALL fetch the Scout Atom feed at runtime from the unpinned gist URL `https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml`. The URL in source SHALL NOT include a commit SHA path segment. The fetch SHALL occur in the browser via the `fetch` API; no build-time network call SHALL be made. Items SHALL be rendered newest-first by `updated` date.

#### Scenario: Unpinned URL in source

- **WHEN** `assets/js/scout.js` is inspected
- **THEN** the feed URL contains no SHA path segment (no 40-character hex string between `raw/` and `feed.xml`)

#### Scenario: Feed loads at runtime

- **WHEN** a browser loads `/scout` with network access
- **THEN** feed items appear without a page rebuild being required

### Requirement: REQ-004 Safe text-only rendering

Feed analysis text, rationale, and all other content extracted from the Atom feed SHALL be rendered using `textContent` assignment or equivalent text-node insertion only. The raw HTML from `<summary>` elements SHALL NEVER be assigned to `innerHTML`, `outerHTML`, or any other HTML-injection API. `DOMParser` MAY be used to parse the summary HTML for text extraction, but the resulting DOM SHALL NOT be appended to the document.

#### Scenario: No innerHTML of feed content

- **WHEN** `assets/js/scout.js` is statically inspected
- **THEN** no assignment of feed-derived content to `innerHTML`, `outerHTML`, or `insertAdjacentHTML` exists

#### Scenario: Feed content renders as text

- **WHEN** a feed item's analysis contains an HTML tag such as `<script>alert(1)</script>`
- **THEN** the tag appears as literal text in the rendered card, not as executed HTML

### Requirement: REQ-020 parseFeed isolation

All Atom XML parsing and `<summary>` HTML extraction logic SHALL reside in a single exported function `parseFeed(xmlString)` that returns an array of structured item objects. The renderer and filter logic SHALL only receive the structured objects; they SHALL NOT access the raw XML or summary HTML. This isolates the feed format dependency to one function for when the Scout output format changes post-launch.

#### Scenario: parseFeed returns structured objects

- **WHEN** `parseFeed` is called with a valid Atom XML string
- **THEN** it returns an array of objects each containing `title`, `link`, `updated`, `analysis`, `score`, `label`, `rationale`, `tags`, and `domain` fields

### Requirement: REQ-021 Analysis-forward card rendering

Each feed item card SHALL render the agent's analysis text as the primary, visually prominent element. Title (as a link), source domain, date, score signal pips, score label, rationale, and tags SHALL be rendered as quieter metadata. Score-5 items SHALL receive a 2px accent left border and accent-coloured signal pips and label.

#### Scenario: Analysis is primary element

- **WHEN** a feed item card is rendered
- **THEN** `.feed__analysis` appears in the DOM and contains the item's analysis text as a text node

#### Scenario: Score-5 item has accent styling

- **WHEN** a feed item with score 5 is rendered
- **THEN** the `li.feed__item` has `data-score="5"` and carries the accent left border

### Requirement: REQ-022 Relevance and tag filtering

The Scout page SHALL provide relevance filter chips (All, Direct impact, Highly relevant, Worth tracking) and dynamically generated tag chips. Relevance chips SHALL be single-select. Tag chips SHALL be multi-select (OR logic: item matches if it has any selected tag). An item MUST match both the active relevance filter AND the active tag set to be shown. Tag buttons within cards SHALL toggle the same tag filter and smooth-scroll to the filter bar.

#### Scenario: Relevance filter hides non-matching items

- **WHEN** the "Direct impact" chip is selected
- **THEN** only items with score 5 are shown in the feed list

#### Scenario: Tag filter applies OR logic

- **WHEN** two tags are selected
- **THEN** items matching either tag are shown (not only items matching both)

#### Scenario: Combined filters apply AND logic

- **WHEN** a relevance filter and a tag filter are both active
- **THEN** only items satisfying both filters are shown

### Requirement: REQ-007 Loading, empty, and error states

The Scout page SHALL display an explicit loading state while the fetch is in progress, an empty state when the feed returns no items matching the current filters, and an error state if the fetch fails or the response cannot be parsed. The error message SHALL be clear and non-alarming. The readout bar SHALL display the feed's last-run timestamp once loaded.

#### Scenario: Loading state shown during fetch

- **WHEN** the page has initiated a fetch but not yet received a response
- **THEN** a loading indicator is visible in the feed area

#### Scenario: Error state shown on fetch failure

- **WHEN** the fetch request fails (network error or non-OK response)
- **THEN** an error message is shown in the feed area and no partial content is rendered

#### Scenario: Empty state shown when filters exclude all items

- **WHEN** active filters match zero items
- **THEN** `.feed__empty` is shown and the "Showing N of M" line reflects 0

### Requirement: REQ-008 Accessible feed markup

The feed list SHALL use `<ol class="feed">` with `<li class="feed__item">` children. Each card SHALL use `<h2 class="feed__title">` for the item title. Dates SHALL use `<time>` elements. Feed item links SHALL open in a new tab with `target="_blank" rel="noopener"`. The page SHALL have a skip link pointing to the feed stream. Every page SHALL have a skip link, semantic landmarks, and `aria-current` on the active nav link.

#### Scenario: Semantic list and heading structure

- **WHEN** the Scout page is rendered with feed items
- **THEN** the feed is an `<ol>` containing `<li>` elements each with an `<h2>` title
