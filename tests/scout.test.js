import { describe, it, expect } from 'vitest';
import { parseFeed, parseSummaryHtml, extractScore, filterItems } from '../assets/js/scout.js';

// ─── Fixture Atom XML (captured from live feed) ───────────────────────────────

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const FIXTURE_SUMMARY_1 = `<div style="font-family:-apple-system,sans-serif;line-height:1.6;max-width:680px;">
<p style="font-size:0.75em;font-weight:600;opacity:0.45;text-transform:uppercase;">Originally published 6 June 2026</p>
<p style="font-size:0.95em;opacity:0.85;margin:0 0 4px;">Saturn CI's Jason Swett published a concrete TDD skill for AI agents using a &quot;specify-encode-fulfill&quot; loop.</p>
<div style="margin-top:16px;padding:12px 16px;border-left:3px solid rgba(128,128,128,0.4);">
<p style="font-size:0.7em;font-weight:700;">🐜 Scout — 🟡 3/5 — Worth tracking</p>
<p style="font-size:0.92em;margin:0 0 10px;">Formicary needs QA agents that write meaningful tests. The specify-encode-fulfill skill is a lightweight adoptable primitive.</p>
<p style="margin:0;"><span style="background:rgba(128,128,128,0.15);border-radius:4px;padding:1px 7px;font-size:0.8em;margin:2px;">spec-driven</span><span style="background:rgba(128,128,128,0.15);border-radius:4px;padding:1px 7px;font-size:0.8em;margin:2px;">ai-coding</span></p>
</div>
<p style="margin:0 0 12px;"><a href="https://example.com" style="color:#1a73e8;">Read original &#x2192;</a></p>
</div>`;

const FIXTURE_SUMMARY_4 = `<div>
<p>Originally published 6 June 2026</p>
<p>An autonomous AI agent found 21 zero-day vulnerabilities in FFmpeg.</p>
<div>
<p>🐜 Scout — 🟠 4/5 — Highly relevant</p>
<p>Validates that autonomous agents are genuinely effective at security research at scale.</p>
<p><span>agent-security</span><span>ai-coding</span></p>
</div>
<p><a href="https://example.com">Read original</a></p>
</div>`;

const FIXTURE_SUMMARY_5 = `<div>
<p>Originally published 6 June 2026</p>
<p>New Miasma attack waves use Phantom Gyp — 157-byte binding.gyp files that trigger code execution during npm install.</p>
<div>
<p>🐜 Scout — 🔴 5/5 — Direct impact</p>
<p>The Claude Code config injection vector is a direct threat to Formicary.</p>
<p><span>agent-security</span></p>
</div>
<p><a href="https://example.com">Read original</a></p>
</div>`;

const FIXTURE_ATOM = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Formicary Scout</title>
  <updated>2026-06-06T08:09:31Z</updated>
  <entry>
    <title>Agent TDD Skill</title>
    <link href="https://example.com/tdd" rel="alternate"/>
    <id>https://example.com/tdd</id>
    <updated>2026-06-06T08:06:43Z</updated>
    <summary type="html">${escXml(FIXTURE_SUMMARY_1)}</summary>
  </entry>
  <entry>
    <title>AI Agent Uncovers Zero-Days</title>
    <link href="https://example.com/zeroday" rel="alternate"/>
    <id>https://example.com/zeroday</id>
    <updated>2026-06-06T08:06:38Z</updated>
    <summary type="html">${escXml(FIXTURE_SUMMARY_4)}</summary>
  </entry>
  <entry>
    <title>Miasma Wave 5</title>
    <link href="https://example.com/miasma" rel="alternate"/>
    <id>https://example.com/miasma</id>
    <updated>2026-06-06T08:06:27Z</updated>
    <summary type="html">${escXml(FIXTURE_SUMMARY_5)}</summary>
  </entry>
</feed>`;

// ─── parseSummaryHtml ─────────────────────────────────────────────────────────

describe('parseSummaryHtml', () => {
  it('extracts analysis text from second paragraph', () => {
    const result = parseSummaryHtml(FIXTURE_SUMMARY_1);
    expect(result.analysis).toContain('Saturn CI');
    expect(result.analysis).toContain('specify-encode-fulfill');
  });

  it('extracts scoreLine from inner block first paragraph', () => {
    const result = parseSummaryHtml(FIXTURE_SUMMARY_1);
    expect(result.scoreLine).toContain('3/5');
    expect(result.scoreLine).toContain('Worth tracking');
  });

  it('extracts rationale from inner block second paragraph', () => {
    const result = parseSummaryHtml(FIXTURE_SUMMARY_1);
    expect(result.rationale).toContain('Formicary needs QA agents');
  });

  it('extracts tags as array of strings', () => {
    const result = parseSummaryHtml(FIXTURE_SUMMARY_1);
    expect(result.tags).toEqual(['spec-driven', 'ai-coding']);
  });

  it('returns empty tags array when no tags present', () => {
    const noTags = `<div><p>Date</p><p>Analysis text.</p><div><p>🐜 Scout — 🟡 3/5 — Worth tracking</p><p>Rationale.</p></div></div>`;
    const result = parseSummaryHtml(noTags);
    expect(result.tags).toEqual([]);
  });

  it('output contains no HTML tags — textContent only (REQ-033)', () => {
    const result = parseSummaryHtml(FIXTURE_SUMMARY_1);
    const htmlTagPattern = /<[a-z]/i;
    expect(result.analysis).not.toMatch(htmlTagPattern);
    expect(result.scoreLine).not.toMatch(htmlTagPattern);
    expect(result.rationale).not.toMatch(htmlTagPattern);
    result.tags.forEach(tag => expect(tag).not.toMatch(htmlTagPattern));
  });
});

// ─── extractScore ─────────────────────────────────────────────────────────────

describe('extractScore', () => {
  it('parses score 3 and label', () => {
    const result = extractScore('🐜 Scout — 🟡 3/5 — Worth tracking');
    expect(result.score).toBe(3);
    expect(result.label).toBe('Worth tracking');
  });

  it('parses score 4 and label', () => {
    const result = extractScore('🐜 Scout — 🟠 4/5 — Highly relevant');
    expect(result.score).toBe(4);
    expect(result.label).toBe('Highly relevant');
  });

  it('parses score 5 and label', () => {
    const result = extractScore('🐜 Scout — 🔴 5/5 — Direct impact');
    expect(result.score).toBe(5);
    expect(result.label).toBe('Direct impact');
  });

  it('returns score 0 and empty label for unrecognised input', () => {
    const result = extractScore('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('');
  });

  it('returns score 0 for arbitrary non-matching string', () => {
    const result = extractScore('No score here');
    expect(result.score).toBe(0);
  });
});

// ─── parseFeed ────────────────────────────────────────────────────────────────

describe('parseFeed', () => {
  it('parses entries from valid Atom feed', () => {
    const items = parseFeed(FIXTURE_ATOM);
    expect(items).toHaveLength(3);
  });

  it('extracts title, url, updated for each entry', () => {
    const items = parseFeed(FIXTURE_ATOM);
    expect(items[0].title).toBe('Agent TDD Skill');
    expect(items[0].url).toBe('https://example.com/tdd');
    expect(items[0].updated).toBe('2026-06-06T08:06:43Z');
  });

  it('delegates to parseSummaryHtml and extracts analysis', () => {
    const items = parseFeed(FIXTURE_ATOM);
    expect(items[0].analysis).toContain('Saturn CI');
  });

  it('returns items sorted newest-first (REQ-003)', () => {
    const items = parseFeed(FIXTURE_ATOM);
    const dates = items.map(i => i.updated);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('returns empty array for feed with no entries', () => {
    const emptyFeed = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Empty</title></feed>`;
    const items = parseFeed(emptyFeed);
    expect(items).toHaveLength(0);
  });

  it('throws for malformed XML', () => {
    expect(() => parseFeed('<not valid xml <<')).toThrow();
  });
});

// ─── filterItems ─────────────────────────────────────────────────────────────

const SAMPLE_ITEMS = [
  { title: 'A', score: 3, tags: ['spec-driven', 'ai-coding'] },
  { title: 'B', score: 4, tags: ['agent-security', 'ai-coding'] },
  { title: 'C', score: 5, tags: ['agent-security'] },
];

describe('filterItems', () => {
  it('returns all items when relFilter is "all" and no tag filters', () => {
    expect(filterItems(SAMPLE_ITEMS, 'all', [])).toHaveLength(3);
  });

  it('single-select rel filter: keeps only matching score', () => {
    const result = filterItems(SAMPLE_ITEMS, '4', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('B');
  });

  it('rel filter "5" keeps only score-5 items', () => {
    const result = filterItems(SAMPLE_ITEMS, '5', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('C');
  });

  it('tag filter uses OR logic — item matches if it has ANY selected tag', () => {
    const result = filterItems(SAMPLE_ITEMS, 'all', ['spec-driven']);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('A');
  });

  it('multiple tag filters: OR logic returns items with any matching tag', () => {
    const result = filterItems(SAMPLE_ITEMS, 'all', ['spec-driven', 'agent-security']);
    expect(result).toHaveLength(3);
  });

  it('rel + tag filters combined with AND logic (REQ-022)', () => {
    const result = filterItems(SAMPLE_ITEMS, '4', ['agent-security']);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('B');
  });

  it('returns empty array when no items match combined filters', () => {
    const result = filterItems(SAMPLE_ITEMS, '5', ['spec-driven']);
    expect(result).toHaveLength(0);
  });

  it('empty tag filters array does not restrict by tag', () => {
    const result = filterItems(SAMPLE_ITEMS, '3', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('A');
  });
});

// ─── REQ-004 safety assertion (REQ-036) ──────────────────────────────────────

describe('REQ-004 safety: no script execution from feed content', () => {
  it('actual <script> tags in feed HTML do not produce script elements via textContent path', () => {
    // Simulate what arrives from Atom XML: summary textContent already decoded,
    // so the HTML string contains real <script> tags as an attacker would inject.
    const maliciousSummary = `<div>
<p>Date</p>
<p><script>window.__xss = true<\/script> Normal analysis text.</p>
<div>
<p>🐜 Scout — 🟡 3/5 — Worth tracking</p>
<p><script>window.__xss2 = true<\/script> Rationale text.</p>
<p><span>tag-one</span></p>
</div>
</div>`;

    const parsed = parseSummaryHtml(maliciousSummary);

    // DOMParser with text/html does not execute scripts; textContent strips tags,
    // returning only the script body text without the <script> wrapper.
    expect(parsed.analysis).not.toMatch(/<script/i);
    expect(parsed.rationale).not.toMatch(/<script/i);

    // Simulate the card renderer path: textContent assignment, no innerHTML of feed data
    const container = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = parsed.analysis;
    container.appendChild(p);

    // The container must not contain any script elements
    expect(container.querySelectorAll('script')).toHaveLength(0);

    // The global must not have been set by DOMParser or textContent rendering
    expect(typeof window.__xss).toBe('undefined');
    expect(typeof window.__xss2).toBe('undefined');
  });
});
