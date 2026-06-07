## Context

Scout currently emits only regular item entries into the Atom feed. The site's `parseFeed` function assumes every entry is a scored single-article item. Scout has already shipped a weekly roundup entry in the live feed (confirmed 2026-06-07 by fetching the live Gist). Without detection logic these entries either render broken as item cards or silently produce cards with empty fields.

The parsing pipeline is already isolated behind `parseFeed` / `parseSummaryHtml` (REQ-020, REQ-039), so the blast radius of this change is intentionally narrow. The feed format contract in `docs/scout-feed-format.md` has been updated to document the actual weekly entry format as observed in the live feed.

## Goals / Non-Goals

**Goals:**
- Detect weekly roundup entries in the feed by a machine-readable marker in the Atom entry (not by parsing summary HTML)
- Parse weekly entries into a distinct item shape (`type: "weekly"`) alongside regular items (`type: "item"`)
- Render weekly entries as digest cards that are visually distinct from scored item cards
- Update `docs/scout-feed-format.md` with the weekly entry format

**Non-Goals:**
- No separate `/weekly/` page or distinct feed URL
- No changes to the relevance filter chips (weekly entries appear in the "All" stream but are not scored, so score filters will naturally exclude them)
- No Scout-side implementation (out of scope for this project)
- No tag filter changes — weekly entries may carry tags and will participate in tag filtering normally

## Decisions

### Detection: entry `<id>` / `<link>` URL path, with future `<category>` upgrade

**Decision:** Weekly entries are identified by the presence of `/scout/weekly/` in the entry's `<id>` value (which equals `<link href>`). This is the detection mechanism used in the current implementation.

**Rationale:** The live feed (inspected 2026-06-07) does not include a `<category>` element on weekly entries. URL-based detection is the only reliable machine-readable signal currently present. Adding a `<category term="weekly-roundup" scheme="https://formicary.ai/feed/types"/>` element to Scout output is recommended for a future release — `parseFeed` should be updated to prefer it when present, with the URL pattern as a fallback.

**Alternative considered:** Detecting by title prefix (`🐜 Scout Weekly —`). Rejected — title text is fragile and may change with internationalisation or rebranding.

### Item shape: add `type` field; weekly items skip score fields

**Decision:** `parseFeed` sets `type: "item"` on regular entries and `type: "weekly"` on weekly entries. Weekly items do not go through `parseSummaryHtml`; their summary is parsed by a new `parseWeeklySummaryHtml` function that extracts a `lede` and `highlights` array instead of `analysis`/`score`/`rationale`.

**Rationale:** Extending the existing shape with optional fields risks the renderer silently displaying empty score pips or broken analysis text for weekly entries. A distinct `type` field makes the branching explicit and testable.

### Rendering: branch on `item.type` in `makeCard`

**Decision:** `makeCard` branches on `item.type`. Regular items render as before. Weekly items render a digest card: no score pips, no single-article link, a lede paragraph, and a list of highlight lines.

**Rationale:** Minimal change to existing rendering path; regular item behaviour is untouched.

### Actual weekly summary HTML structure (observed 2026-06-07)

The summary HTML for a weekly entry as observed in the live feed:

```html
<div>
  <div>                           <!-- header block (amber/branded) -->
    <p>🐜 Scout Weekly Digest</p> <!-- label; ignored by parser -->
    <p>{date}</p>                 <!-- single publication date, e.g. "7 June 2026" -->
  </div>
  <div>                           <!-- content block -->
    <p>{lede}</p>                 <!-- one editorial summary paragraph -->
  </div>
  <div>                           <!-- tags block -->
    <span>{tag}</span>
    <span>{tag}</span>
  </div>
</div>
```

Style attributes are present in the raw HTML but are ignored by the parser — position within child `<div>` elements is the only structural signal used.

Parsed fields: `date` (second `<p>` of first child `<div>`), `lede` (`<p>` of second child `<div>`), `tags` (`<span>` elements of third child `<div>`).

**Note:** There is no highlights list in the actual format. The earlier provisional design assumed multiple highlight paragraphs; the live feed uses a single editorial lede instead.

## Risks / Trade-offs

- **URL-based detection is implicit** → If Scout changes the `/scout/weekly/` URL scheme, detection breaks silently. Mitigation: add `<category term="weekly-roundup">` to Scout output in a future release; `parseFeed` can then prefer it when present.
- **Score filters silently exclude weekly entries** → This is the intended behaviour (weekly entries are unscored), but it means a user on the "Direct impact" filter will never see the weekly digest. Mitigation: document in spec; revisit if user feedback indicates this is confusing.
- **Graceful degradation** → If URL-based detection misses a weekly entry, it will be treated as a regular item with empty score fields. `parseFeed` should return `score: 0` for these rather than crashing.
- **Weekly card visual design** — the design token system supports `data-type` attribute styling; exact visual treatment (border, background, label) is deferred to implementation.

## Open Questions

1. **Should weekly entries appear when a score filter is active?** — Current decision: no (consistent with "unscored items don't match score filters"). Confirm this is the desired UX.
2. **Add `<category>` to Scout output?** — Recommended for a future Scout release as a cleaner detection signal. No blocking dependency on this change.
