# Handoff: formicary.ai — editorial site (Thesis · Scout · About)

## Overview
`formicary.ai` is a small, three-page editorial/research website for Adrian Rossouw's applied-research project. The voice is restrained and literary; the layout is typography-first with a single green accent. The three pages are:

1. **Thesis** (`index.html`) — a long-form essay ("What survives the agent") with a masthead, an "epistemic status" callout, and a single reading column.
2. **Scout** (`scout.html`) — a machine-voiced, filterable feed of items an autonomous agent has scored and analysed. This is the only interactive page.
3. **About** (`about.html`) — a short bio page with an AI-use disclosure, a two-column "what it is / what it isn't" block, and contact details.

All three share one design-token stylesheet, one theme script (light default + opt-in dark, persisted), a sticky header/nav, and a footer.

---

## About the design files
**The files in this bundle are design references created in HTML.** They are working prototypes that show the intended look, typography, color, spacing, and interactive behavior — they are **not meant to be shipped as-is**.

The task is to **recreate these designs in the target codebase's environment**, using its established patterns and libraries. The site owner has stated the intended target is **Jekyll** (a static-site generator — the HTML/CSS here is plain and portable, so it ports with very light changes). If you are integrating into a different framework instead, use that framework's idioms.

Concretely:
- `tokens.css` is the source of truth for the design system. Include it once site-wide (in Jekyll, link it from the default layout's `<head>`, or drop it in `assets/css/` and reference it). **Do not re-derive values** — they are intentional.
- The HTML files show final structure and class usage. Port the markup into Jekyll layouts + includes (e.g. `_layouts/default.html` for the shell, `_includes/header.html` / `footer.html` / `epistemic.html`, and a `feed-item` include for Scout).
- `theme.js` and the inline script in `scout.html` show the exact runtime behavior to reproduce. Ship `theme.js` as-is from `assets/js/`; the Scout filter script can stay inline or move to its own asset file.

---

## Fidelity
**High-fidelity (hifi).** Final colors, type scale, spacing, and interactions are all specified in `tokens.css` and the markup. Recreate the UI pixel-perfectly using the codebase's libraries. Every value below (color, size, spacing) is defined as a CSS custom property — prefer referencing the token over hard-coding.

---

## Design tokens
All tokens live in `tokens.css` under `:root` (light, the default) and `:root[data-theme="dark"]`. **Colors are authored in OKLCH.** Reproduce them exactly; do not convert to hex (the OKLCH values are deliberate and the two themes are tuned to share one accent).

### Fonts (Google Fonts)
Imported at the top of `tokens.css`:
- **Serif — `Newsreader`** (`--font-serif`): body prose, essay, feed titles. Optical sizing on (`opsz 6..72`), weights 400–600, italics. Fallbacks: Georgia, Times New Roman.
- **Sans — `IBM Plex Sans`** (`--font-sans`): Scout's machine analysis text only (technical, reads cleaner than serif). Weights 400/450/500/600.
- **Mono — `IBM Plex Mono`** (`--font-mono`): all metadata, kickers, nav, chips, dates, the readout bar. Weights 400/500/600 + italic.

### Type scale (modular ~1.22)
| Token | Size | Use |
|---|---|---|
| `--fs-micro` | 11px (0.6875rem) | fine print, chip labels, nav |
| `--fs-mono` | 12px (0.75rem) | metadata, kickers, machine chrome |
| `--fs-meta` | 13px (0.8125rem) | dates, source lines |
| `--fs-sm` | 15px (0.9375rem) | captions, secondary prose |
| `--fs-base` | 19px (1.1875rem) | body copy (the reading size) |
| `--fs-lead` | 22px (1.375rem) | lede / standfirst |
| `--fs-h3` | 24px (1.5rem) | h3, feed titles |
| `--fs-h2` | 31px (1.9375rem) | h2 |
| `--fs-h1` | 44px (2.75rem) | essay title |
| `--fs-display` | 56px (3.5rem) | page mastheads |

Line-heights: `--lh-tight 1.18`, `--lh-snug 1.35`, `--lh-body 1.72` (long-form), `--lh-meta 1.5`.

### Color (OKLCH) — light (default) / dark
| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `oklch(0.985 0.004 165)` | `oklch(0.185 0.013 168)` | page background |
| `--paper-sunk` | `oklch(0.963 0.006 165)` | `oklch(0.225 0.015 168)` | recessed panels / callout fill |
| `--paper-raise` | `oklch(0.997 0.002 165)` | `oklch(0.215 0.014 168)` | lifted cards |
| `--ink` | `oklch(0.250 0.012 175)` | `oklch(0.928 0.010 165)` | primary text |
| `--ink-soft` | `oklch(0.400 0.012 175)` | `oklch(0.775 0.012 165)` | secondary text |
| `--ink-mute` | `oklch(0.540 0.010 175)` | `oklch(0.620 0.014 165)` | metadata |
| `--ink-faint` | `oklch(0.660 0.008 175)` | `oklch(0.500 0.014 168)` | de-emphasised / placeholder |
| `--rule` | `oklch(0.890 0.006 165)` | `oklch(0.320 0.016 170)` | hairlines |
| `--rule-soft` | `oklch(0.930 0.004 165)` | `oklch(0.270 0.014 170)` | faintest dividers |
| `--accent` | `oklch(0.450 0.095 160)` | `oklch(0.760 0.130 158)` | pine green — links, signal |
| `--accent-deep` | `oklch(0.375 0.090 160)` | `oklch(0.840 0.110 158)` | hover |
| `--accent-tint` | `oklch(0.940 0.025 160)` | `oklch(0.300 0.052 160)` | faint accent wash / selection |
| `--accent-rule` | `oklch(0.720 0.070 160)` | `oklch(0.520 0.095 158)` | accent keylines |

`color-scheme` is set per theme. `::selection` uses `--accent-tint`.

### Spacing scale (8px base)
`--space-1 .25rem` · `-2 .5rem` · `-3 .75rem` · `-4 1rem` · `-5 1.5rem` · `-6 2rem` · `-7 3rem` · `-8 4.5rem` · `-9 7rem`.

### Layout / measure
- `--measure: 62ch` — long-form reading column.
- `--measure-wide: 74ch` — feed / wider content (Scout uses `.shell--wide`).
- `--page-pad: clamp(1.25rem, 5vw, 3rem)`.
- `--radius: 3px` — corners are nearly square throughout.
- Shell max width = `measure + page-pad*2`; wide shell = `measure-wide + page-pad*2`; both `margin-inline: auto`.

### Motion
- `--ease: cubic-bezier(0.22, 0.61, 0.36, 1)`, `--dur: 180ms`.
- Theme transition on `body`: 240ms.
- Reduced-motion media query kills all animation/transition (`prefers-reduced-motion: reduce`).
- **No shadows** anywhere — the system relies on hairline rules and spacing, not elevation.

---

## Shared chrome (all pages)

### Header (`.site-head`)
- Sticky, `top: 0`, `z-index: 20`. Bottom hairline `--rule`. Background is `color-mix(in oklch, var(--paper) 88%, transparent)` with `backdrop-filter: saturate(1.1) blur(6px)`.
- Row is flex, space-between, `padding-block: --space-4`. On Thesis/About it uses `.shell`; on Scout it uses `.shell--wide`.
- **Wordmark** (`.wordmark`): the word `formicary` linking to `index.html`, weight 500, 1.35rem, letter-spacing -0.01em, color `--ink`. (Note: `.wordmark__dot` / `.wordmark__tld` styles exist in CSS for an optional `.ai` tld treatment but the current markup renders just "formicary".)
- **Nav** (`.nav`): mono, `--fs-micro`, uppercase, letter-spacing 0.16em, gap `--space-5`. Three links: Thesis / Scout / About. Default color `--ink-faint`; hover → `--ink` with a `--rule` bottom border; the current page has `aria-current="page"` → `--ink` text with an `--accent` bottom border.
- **Theme toggle** (`.theme-toggle`): 30×30px circle, 1px `--rule` border, hover border → `--ink-mute`, focus-visible outline 2px `--accent`. Inner `.theme-toggle__disc` is a 14px circle with a half-fill linear gradient (the classic light/dark glyph). Drives the theme behavior below.

### Footer (`.site-foot`)
- `margin-top: --space-9`, top hairline, `padding-block: --space-6 --space-8`.
- Flex row, space-between, mono `--fs-mono`, color `--ink-mute`. Left: a CC BY 4.0 license link. Right: "Adrian Rossouw, 2026–". Links carry a `--rule` bottom border, hover → `--ink` + `--accent` border.

### Theme behavior (`theme.js`)
- **Light is the default** (no attribute). Dark is opt-in via `data-theme="dark"` on `<html>`.
- Persisted in `localStorage` under key `formicary-theme` (`"light"` | `"dark"`).
- The script is loaded in `<head>` and applies the saved preference **before paint** to avoid a flash.
- On `DOMContentLoaded` it wires every `[data-theme-toggle]` button to flip the theme, and `sync()` keeps each toggle's `aria-pressed` / `title` / `aria-label` in step with the current theme.
- Reproduce the no-flash early-apply when porting (in Jekyll, the `theme.js` `<script>` tag in the layout `<head>` already does this — keep it before the stylesheet/body).

### Accessibility patterns to preserve
- A `.visually-hidden` skip link is the first body child on every page ("Skip to essay" / "Skip to stream").
- `aria-label` on nav, `aria-current="page"` on the active link, `aria-pressed` on the theme toggle and all filter chips, `aria-hidden` on decorative glyphs.

---

## Screens / Views

### 1. Thesis — `index.html`
**Purpose:** read the project's central essay.
**Layout:** single `.shell` (62ch column), `<article id="essay">`.
- **Masthead** (`.masthead`, `padding-top: --space-8`):
  - Eyebrow kicker "The thesis · pre-experiment" (`.kicker.masthead__eyebrow`, mono, uppercase, letter-spacing 0.13em, `--ink-mute`).
  - `h1.masthead__title`: `clamp(2.65rem, 6.4vw, 3.7rem)`, line-height 1.02, weight 560, letter-spacing -0.022em, `max-width: 16ch`, `text-wrap: balance`.
  - `.masthead__deck` (standfirst): `clamp(1.3rem, 2.5vw, 1.6rem)`, `--ink-soft`, `max-width: 40ch`, with a 3.5ch × 2px `--accent` keyline above it (`::before`).
  - `.masthead__byline`: mono `--fs-meta`, `--ink-mute` ("Adrian Rossouw · June 2026 · working notes").
- **Epistemic-status callout** (`aside.epistemic`) — the signature element:
  - Fill `--paper-sunk`, 1px `--rule` border, **2px `--accent-rule` left border**, radius 3px, padding `clamp(1.1rem,3vw,1.75rem)`.
  - `.epistemic__label`: mono uppercase `--accent-deep` weight 600, preceded by a 6px `--accent` dot (`::before`).
  - `.epistemic__fields` (`dl`): two-column grid (`max-content 1fr`), mono `--fs-meta`, with a bottom hairline. `dt` is faint uppercase micro; `dd` is `--ink`. Fields: Status / Confidence / Last revised.
  - `.epistemic__note`: `--fs-sm`, `--ink-soft`, with italic `em` in `--ink-mute`.
- **`hr.rule-mark`**: a 4ch-wide top-border hairline, `margin-block: --space-7` — used as a quiet section break.
- **`.prose`**: vertical rhythm via `> * + * { margin-top: --space-5 }`. `p` is `--fs-base`/`--lh-body`. The first paragraph is `.lede` (`--fs-lead`, line-height 1.5, `--ink-soft`). Links are underlined with `--accent-rule`, hover → `--accent-deep` + `--accent` underline. `em` italic, `strong` weight 600.
- Closes with a trailing mono byline.

### 2. Scout — `scout.html`  *(the only interactive page)*
**Purpose:** browse, filter, and read an agent's scored analyses of AI-landscape items.
**Layout:** `.shell--wide` (74ch). Header/footer also use the wide shell here.
Order: masthead → readout bar → filters → "Showing N of M" line → feed list.

- **Masthead:** kicker "The instrument", `h1` "Scout" (`--fs-h1`), then a `.lede` (`max-width: 64ch`, `margin-top: --space-5`) describing the agent.
- **Readout bar** (`.readout`, `#readout`): a mono status strip with top+bottom hairlines. Items separated by `/` (`.readout__sep` in `--rule`):
  - `Running` with a pulsing accent dot (`.readout__pulse`, 7px, `scout-pulse` keyframe — an expanding box-shadow ring, 2.6s loop; honor reduced-motion).
  - `last run <b>…</b>` (filled by JS, formatted UTC `YYYY-MM-DD HH:MM UTC`).
  - `cadence twice daily`.
  - `<b>N items</b> in stream`.
- **Filters** (`.filters`, `#filters`): two `.filters__group`s, each with a mono `.filters__legend`.
  - **Relevance group** (`#rel-group`): four `.chip` buttons — `All` (default pressed), `Direct impact` (`.chip--accent`, `data-rel="5"`), `Highly relevant` (`data-rel="4"`), `Worth tracking` (`data-rel="3"`). Chips are mono pills (`border-radius: 100px`, 1px `--rule`). Pressed state (`aria-pressed="true"`): text `--paper` on `--ink` fill; the accent chip fills with `--accent` instead.
  - **Topic group** (`#tag-group`): tag chips are **generated at runtime** from the union of all item `tags`, sorted by frequency descending. Each chip shows the tag plus a `.chip__count` (opacity 0.55). These toggle (multi-select).
- **"Showing N of M"** line (`.kicker`, `#showing`): updated on every render.
- **Feed** (`ol.feed`, `#stream`): rendered from data; rule-and-spacing rhythm, no boxes. Each `li.feed__item`:
  - `padding-block: --space-6`, top hairline (first item has none).
  - **Score-5 emphasis:** items with `data-score="5"` get a 2px `--accent` left border (with negative margin so the rule sits in the gutter), and their signal pips + label turn accent.
  - **Title** (`h2.feed__title`): serif weight 500, `--fs-h3`, `max-width: 40ch`; links open in a new tab (`target="_blank" rel="noopener"`), hover → `--accent-deep`.
  - **Meta row** (`.feed__meta`, space-between):
    - `.signal`: five `.signal__pip`s (14×4px bars; "on" pips `--ink-soft`, or `--accent` at score 5) + a mono `.signal__label` like `DIRECT IMPACT · 5/5`.
    - `.feed__date`: mono, faint, `scouted DD Mon YYYY`.
  - **Analysis** (`p.feed__analysis`): **sans (IBM Plex Sans)**, 1rem/1.62, `--ink-soft`, `max-width: 70ch` — this is the agent's voice.
  - **Rationale** (`p.feed__rationale`, optional): mono `--fs-meta`, `--ink-mute`, left hairline + left padding; leads with a bold `Scored N/5.`
  - **Foot** (`.feed__foot`): a `.feed__source` (mono; an `→` accent arrow + a link showing `domain · published <date>`) and right-aligned `.feed__tags` — mono `.tag` buttons prefixed with `#` (via `::before`), which also act as filters.
  - **Empty state** (`.feed__empty`): centered mono message when no items match.

**Data source:** `scout-feed.js` sets `window.SCOUT` (auto-generated from Scout's Atom feed). `scout-feed.json` is the same data as JSON. Shape:
```
window.SCOUT = {
  updated: ISO8601 string,      // feed last-run time
  subtitle: string,
  count: number,
  items: [{
    title:     string,
    link:      string,          // article URL
    updated:   ISO8601 string,  // when Scout scouted it → "scouted" date
    published: string,          // human date e.g. "18 May 2026" (optional)
    analysis:  string,          // agent's prose (sans)
    score:     3 | 4 | 5,       // relevance; drives pips, label, emphasis
    label:     string,          // e.g. "Worth tracking" (fallback for LABELS map)
    rationale: string,          // optional scoring justification
    tags:      string[],        // topic tags → generated chips + per-card tags
    domain:    string           // e.g. "github.com"
  }, …]
}
```
Score→label map in the page: `5 → "Direct impact"`, `4 → "Highly relevant"`, `3 → "Worth tracking"`.

**Scout interactions (re-implement these):**
- Relevance chips are single-select (clicking sets `state.rel`). Topic chips are multi-select (toggle in/out of `state.tags`); an item matches if it has **any** selected tag (OR), AND matches the relevance filter.
- Tag buttons **inside a card** also toggle the same tag filter, then smooth-scroll back up to the filter bar (offset −80px). *(Note: the source uses `window.scrollTo`, not `scrollIntoView` — keep it that way.)*
- All user-supplied strings are HTML-escaped before injection (`esc()`); preserve that when porting to a framework (most frameworks escape by default).
- `render()` recomputes the filtered list, updates the "Showing N of M" line, and re-renders the list (or the empty state).

### 3. About — `about.html`
**Purpose:** what the project is/isn't, AI-use disclosure, contact.
**Layout:** single `.shell` `<article>`.
- Masthead: kicker "About", `h1` "Formicary is the work." (`max-width: 16ch`).
- **AI-use disclosure**: reuses the `.epistemic` callout (label "AI-use disclosure" + a single `.epistemic__note`).
- `.prose` intro (first para is `.lede`).
- `hr.rule-mark` separators.
- **Two-column block** (`.col2`): CSS grid, single column under 720px, `1fr 1fr` at ≥720px. Two `<section>`s ("What it is" / "What it isn't"), each a `.isnt-list`:
  - List items have a top `--rule-soft` hairline (first none), a flex row with a mono `.mark` glyph + text. `.is .mark` is `--accent` (`+`); `.isnt .mark` is `--ink-faint` (`−`).
- **Contact** (`dl.bio-grid`): two-column mono grid (`max-content 1fr`), `dt` faint uppercase micro, `dd` `--ink`; rows for Email / Writing / Feed / Licence. Links use `--accent` + `--accent-rule` underline.

---

## State management (Scout only)
- `state = { rel: "all", tags: [] }` held in a closure (the IIFE in `scout.html`). No persistence — filters reset on reload. Theme is the only persisted state (localStorage, see `theme.js`).
- Derived at load: `tagFreq` (counts per tag) and `tagNames` (sorted desc) → drive the generated topic chips.
- When porting: Scout is the one page with client-side state. In Jekyll, render the feed items at build time from `scout-feed.json` (via a `_data/scout.json` file + Liquid loop, or a small generator), then attach a vanilla-JS filter script (the same logic as the inline script in `scout.html`) that reads `state = { rel, tags }`, recomputes the filtered list, and toggles item visibility. No framework runtime is needed.

---

## Assets
- **Favicon / app icon.** The wordmark's lowercase *f* (Newsreader, weight 560, paper-on-pine tile, 13/64 corner radius) rendered from the live font. Files: `favicon.svg` (scalable; serif-stack fallback for systems without Newsreader), `favicon-16.png` / `favicon-32.png` / `favicon-48.png`, and `apple-touch-icon.png` (180px). Wired into every page's `<head>`. To regenerate at other sizes, rasterize the *f* on a pine `#2c7a58` tile with paper `#f7f9f7` text. A 512px PWA icon was not generated — add `icon-512.png` if a web-app manifest is needed.
- **No other images, icons, or SVG files.** All visual marks (signal pips, theme disc, accent dots/keylines, list glyphs, the `#` on tags, the `→` arrow) are pure CSS or text characters.
- **Fonts:** Google Fonts — Newsreader, IBM Plex Sans, IBM Plex Mono (imported in `tokens.css`). Self-host if the target environment prefers it.
- **Feed data:** `scout-feed.js` / `scout-feed.json` (auto-generated from an Atom feed upstream — treat as a build input, not hand-edited).

## Files in this bundle
- `index.html` — Thesis page.
- `scout.html` — Scout feed page (includes the inline render/filter script).
- `about.html` — About page.
- `tokens.css` — **the design system.** Single source of truth for fonts, type scale, color (OKLCH, light + dark), spacing, layout, motion, and every component's styles.
- `theme.js` — light/dark theme toggle + persistence (loaded in `<head>`).
- `scout-feed.js` — `window.SCOUT` feed data (render-ready).
- `scout-feed.json` — same feed data as JSON.
- `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` — site icons (the wordmark *f*).

## Notes for the implementer
- Keep the **single-accent, no-shadow, hairline-and-spacing** discipline — it's the whole aesthetic. Resist adding cards, gradients, or elevation.
- Reproduce the **no-flash theme apply** (run the stored-theme check before first paint).
- Honor **reduced-motion** (the pulse and all transitions must drop).
- The three font roles are intentional: **serif = human prose, sans = the agent's analysis, mono = all machine/metadata chrome.** Don't collapse them.
- **Jekyll structure suggestion:** put `tokens.css` + `theme.js` in `assets/`, build the shell as `_layouts/default.html` (header/footer as `_includes`), make each page a Markdown/HTML file using that layout, and drive Scout from `_data/scout.json` (copy `scout-feed.json`) with a Liquid loop emitting `.feed__item`s, plus the vanilla filter script.
