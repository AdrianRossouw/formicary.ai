# formicary.ai design brief (for Claude Design)

**Read this as a constraint brief, not an open exploration. Refine within the box below.** The site's whole posture is restraint; the failure mode to avoid is over-designing it. Timebox: this is a ~45-minute convergence, not an afternoon. If you have something shippable, stop.

## Purpose and audience
A personal research-notes site for Formicary: small, public experiments on AI coding techniques. Audience is technical peers and senior or principal engineers (some of them hiring managers) who value substance over polish. The site must read as considered and credible, never flashy. The author under-labels and over-delivers; the design should feel like that.

## Aesthetic posture
Editorial, typography-first, restraint over flourish. No hero or signature flourish for v1. This is a long-form reading experience, not a marketing landing page.

Calibration sites, match this register: aphyr.com, maggieappleton.com, lethain.com (Will Larson). Maggie Appleton's epistemic-status markers are the explicit model for the callout component below.

## Hard constraints
- No em-dashes anywhere in UI copy or microcopy. The author treats them as an AI tell.
- No generic AI-slop type or colour. Avoid Inter, Roboto, Arial, system-default sans, and purple gradients. Prefer a distinctive but readable editorial pairing: a characterful serif for body, a quiet mono or grotesque for metadata.
- One accent colour, used sparingly. Dominant neutral plus a single accent, not an even spread.
- Everything as design tokens (CSS custom properties): font families, type scale, colours, spacing, measure. The output must be a reproducible token set, not a one-off canvas (see deliverable).
- Long-form readability is the priority: generous measure (~60 to 66ch), comfortable line-height, clear hierarchy.

## Pages / IA (three, minimal)
1. **Landing = the thesis essay** (long-form prose, ~1,400 words). Lead element is an epistemic-status callout at the very top. This is the main reading experience; design for it.
2. **/scout** = a short explainer plus a live, repeating feed of items. See the Scout context section below; the design has to serve what Scout actually is, not a generic feed.
3. **About / contact** = short bio, what Formicary is and isn't, an AI-use disclosure near the top, contact email. Simple.

## What Scout is (context for the /scout design)
Scout is an autonomous agent the author built. It runs on a schedule (twice daily), reads across the AI landscape, decides which items are relevant to the work on this site, and writes a short analysis of each: why it matters and how it connects to the research. Its output is the feed this page renders. It serves two purposes at once: finding evidence relevant to the experiments, and surfacing new ideas the author should know about. Two things follow for the design:

- **The analysis is the point, not the link.** Every item carries the agent's own commentary. A conventional RSS-reader layout (title, blurb, link) undersells it. The card should privilege the agent's analysis paragraph as the primary text, with the source title and link secondary. The reader should come away thinking "a system reasoned about this," not "here are some bookmarks."
- **It is a machine readout, not an editorial column.** The thesis essay is the human voice; /scout is the instrument's voice. The page can feel subtly different from the essay, more like a live readout from a running system, while sharing the same type and palette. A quiet sense that this updates on its own is the impression to create: a visible last-updated, a cadence note ("twice daily"), an ordered stream.

What each item contains (map the card to these fields): a source title that links out, a date, the agent's analysis as the focal text, an optional source name or domain, and optional category tags.

## Components to define
- **Title and subtitle (top of page).** Title: "What survives the agent". Subtitle (provisional, may be upgraded later): "borrowing regulated-software discipline to make AI code last". Design the two as a pair: the subtitle needs real visual presence directly under the title, not buried, or the title reads as a tech-thriller. Top-of-page stack, in order: title, subtitle, epistemic-status callout, then the essay.
- **Epistemic-status callout** (most important custom element): a small, labelled block that reads as deliberate signalling, not apology. Quiet, structured, slightly set apart. Fields like Status / Confidence / Last revised. This is the Appleton pattern.
- **Feed item card (/scout):** analysis-forward, per the Scout context above. The agent's analysis is the primary text; title (linked), source, date, and tags are quiet metadata around it. Favour a subtle rule-and-spacing rhythm over heavy boxes.
- **Footer:** "CC BY 4.0" and "Adrian Rossouw, 2026–".

## Deliverable I need back
A token set I can hand to the build: font families (with web-font source or @font-face), type scale, colour variables, spacing scale, measure, plus the callout and feed-item treatments, in a form that translates cleanly to Astro/CSS.
