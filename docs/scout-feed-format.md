# Scout feed format — interface contract

This document is the exchange format between the Scout project and formicary.ai.
It describes exactly what Scout must produce and what `parseFeed` / `parseSummaryHtml`
in `assets/js/scout.js` expect to consume. Update both sides in lockstep when the
format changes. The parsing logic is isolated to those two functions (REQ-020) so
the blast radius of a format change is one file on each side.

---

## Atom envelope

Standard Atom 1.0. Namespace: `http://www.w3.org/2005/Atom`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Formicary Scout</title>
  <updated>{most-recent-entry-updated}</updated>
  <entry>...</entry>
  <entry>...</entry>
</feed>
```

### Entry fields

| Element | Attribute | Required | Notes |
|---|---|---|---|
| `<title>` | — | Yes | Plain text article headline |
| `<link>` | `href`, `rel="alternate"` | Yes | URL of the original article |
| `<id>` | — | Yes | Stable URI; may equal `<link href>` |
| `<updated>` | — | Yes | ISO 8601 UTC, e.g. `2026-06-06T08:06:43Z`. Used for newest-first sort. |
| `<summary>` | `type="html"` | Yes | HTML-escaped Scout annotation block (see below) |

---

## Summary HTML block

The `<summary type="html">` value is an HTML-escaped string. When decoded it must
parse as the following structure. **Style attributes are ignored by the parser —
they may be present or absent; the parser keys on DOM position only.**

```html
<div>
  <p>Originally published {human-readable date}</p>
  <p>{analysis text}</p>
  <div>
    <p>🐜 Scout — {score-emoji} {N}/5 — {label}</p>
    <p>{rationale text}</p>
    <p><span>{tag}</span><span>{tag}</span></p>   <!-- optional; omit if no tags -->
  </div>
  <p><a href="{article-url}">Read original →</a></p>
</div>
```

### Parsing rules

The parser (`parseSummaryHtml`) uses structural position, not class names or style attributes:

| Field | Source |
|---|---|
| `publishedDate` | Text of first `<p>` globally, matched against `/published\s+(.+)$/i`; captures everything after "published" |
| `analysis` | Text content of second `<p>` globally |
| `scoreLine` | Text content of first `<p>` inside the inner `<div>` (`div div`) |
| `rationale` | Text content of second `<p>` inside the inner `<div>` |
| `tags` | Text content of each `<span>` inside the third `<p>` inside the inner `<div>`; empty array if the `<p>` or spans are absent |

**Critical constraints:**
- The outer wrapper must be a `<div>` containing at least two `<p>` elements before the inner `<div>`.
- The inner `<div>` must be the first nested `div` within the outer `div` (matched by `div div`).
- All text is extracted via `textContent` only — HTML tags inside text nodes are stripped, never rendered.

---

## Score line format

```
🐜 Scout — {emoji} {N}/5 — {label}
```

Regex used by `extractScore`: `/(\d)\/5\s*[—\-–]\s*(.+)/`

| Score | Emoji | Label |
|---|---|---|
| 3 | 🟡 | Worth tracking |
| 4 | 🟠 | Highly relevant |
| 5 | 🔴 | Direct impact |

The separator between score and label may be an em-dash (`—`), en-dash (`–`), or hyphen-minus (`-`).

---

## Derived item object

`parseFeed` returns an array of objects with the following fields:

| Field | Type | Source |
|---|---|---|
| `title` | string | `<title>` text |
| `url` | string | `<link href>` |
| `domain` | string | Hostname derived from `url`, `www.` prefix stripped |
| `updated` | string | `<updated>` ISO 8601 string |
| `published` | string | Parsed from summary first `<p>` |
| `analysis` | string | Summary second `<p>` text |
| `rationale` | string | Score block second `<p>` text |
| `tags` | string[] | Score block third `<p>` span texts |
| `score` | number | Integer parsed from score line (3, 4, or 5); 0 if unparseable |
| `label` | string | Label from score line; falls back to `LABELS[score]` constant |

Items are sorted newest-first by `updated`.

---

## Canonical minimal example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Formicary Scout</title>
  <updated>2026-06-06T08:09:31Z</updated>
  <entry>
    <title>Example Article</title>
    <link href="https://example.com/article" rel="alternate"/>
    <id>https://example.com/article</id>
    <updated>2026-06-06T08:06:43Z</updated>
    <summary type="html">&lt;div&gt;
&lt;p&gt;Originally published 6 June 2026&lt;/p&gt;
&lt;p&gt;Analysis of the article and why it matters.&lt;/p&gt;
&lt;div&gt;
&lt;p&gt;🐜 Scout — 🟡 3/5 — Worth tracking&lt;/p&gt;
&lt;p&gt;Rationale explaining the score.&lt;/p&gt;
&lt;p&gt;&lt;span&gt;tag-one&lt;/span&gt;&lt;span&gt;tag-two&lt;/span&gt;&lt;/p&gt;
&lt;/div&gt;
&lt;p&gt;&lt;a href="https://example.com/article"&gt;Read original →&lt;/a&gt;&lt;/p&gt;
&lt;/div&gt;</summary>
  </entry>
</feed>
```

---

## Weekly entry type

Weekly roundup entries exist alongside regular item entries in the same feed. Detection and parsing differ.

### Detection

A weekly entry is identified by its `<id>` (or `<link href>`) containing the path segment `/scout/weekly/`:

```xml
<id>https://formicary.dev/scout/weekly/2026-06-07</id>
```

**Note:** A `<category term="weekly-roundup" scheme="https://formicary.ai/feed/types"/>` element is recommended as an explicit machine-readable marker and should be added to Scout output in a future release. Until then, URL-based detection is the fallback.

Weekly entries do **not** contain a score block. The `parseSummaryHtml` function is not called for weekly entries.

### Weekly entry Atom fields

Weekly entries share the same envelope as regular entries:

| Element | Notes |
|---|---|
| `<title>` | Formatted as `🐜 Scout Weekly — {date range}` |
| `<link>` | Points to `https://formicary.dev/scout/weekly/{date}` |
| `<id>` | Same as `<link href>` — contains `/scout/weekly/` |
| `<updated>` | ISO 8601 UTC timestamp of digest publication |
| `<summary type="html">` | Weekly digest HTML block (see below) |

### Weekly summary HTML block

The decoded `<summary>` HTML for a weekly entry:

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

**Style attributes are present in actual output but are ignored by the parser — structure is keyed on DOM position (first/second/third child `<div>` of the outer wrapper).**

### Weekly summary parsing rules (`parseWeeklySummaryHtml`)

| Field | Source |
|---|---|
| `date` | `textContent` of second `<p>` inside first child `<div>` |
| `lede` | `textContent` of `<p>` inside second child `<div>` |
| `tags` | `textContent` of each `<span>` inside third child `<div>`; empty array if absent |

### Weekly derived item object

| Field | Type | Source |
|---|---|---|
| `type` | string | `"weekly"` — always set by `parseFeed` for weekly entries |
| `title` | string | `<title>` text |
| `url` | string | `<link href>` |
| `updated` | string | `<updated>` ISO 8601 string |
| `date` | string | Single publication date from header block |
| `lede` | string | Editorial summary from content block |
| `tags` | string[] | Tag span texts from tags block |

Weekly items have **no** `score`, `label`, `rationale`, `analysis`, or `domain` fields.

### Canonical weekly entry example

```xml
<entry>
  <title>🐜 Scout Weekly — June 1–7, 2026</title>
  <link href="https://formicary.dev/scout/weekly/2026-06-07" rel="alternate"/>
  <id>https://formicary.dev/scout/weekly/2026-06-07</id>
  <updated>2026-06-07T08:09:31Z</updated>
  <summary type="html">&lt;div&gt;
&lt;div&gt;&lt;p&gt;🐜 Scout Weekly Digest&lt;/p&gt;&lt;p&gt;7 June 2026&lt;/p&gt;&lt;/div&gt;
&lt;div&gt;&lt;p&gt;Top items: ...lede text...&lt;/p&gt;&lt;/div&gt;
&lt;div&gt;&lt;span&gt;agent-security&lt;/span&gt;&lt;span&gt;multi-agent&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;</summary>
</entry>
```

---

## Change coordination

When the Scout feed format changes:

1. Update this document to reflect the new format.
2. Update `parseSummaryHtml` and/or `parseFeed` in `assets/js/scout.js`.
3. Update the test fixture in `tests/scout.test.js` to match the new format.
4. Run `npm test` — all 36 tests must pass before merging.
5. Reference REQ-020 (parseFeed isolation) in the commit.

When formicary.ai changes what it expects from the feed:

1. Update this document first.
2. Carry the updated spec to the Scout project so it knows what to produce.
