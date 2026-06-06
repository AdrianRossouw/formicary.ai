// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { extractReqIds, findUntraced } from '../scripts/check-traceability.js';

// ─── extractReqIds ────────────────────────────────────────────────────────────

describe('extractReqIds', () => {
  it('returns a set of REQ-NNN ids found in text', () => {
    const result = extractReqIds('| REQ-001 | foo |\n| REQ-002 | bar |');
    expect(result).toEqual(new Set(['REQ-001', 'REQ-002']));
  });

  it('deduplicates ids that appear more than once', () => {
    const result = extractReqIds('REQ-003 and REQ-003 again');
    expect(result.size).toBe(1);
    expect(result.has('REQ-003')).toBe(true);
  });

  it('returns empty set when no ids are present', () => {
    expect(extractReqIds('no requirements here').size).toBe(0);
  });

  it('does not match partial tokens like XREQ-001 or REQ-', () => {
    const result = extractReqIds('XREQ-001 and REQ- are not valid');
    expect(result.size).toBe(0);
  });
});

// ─── findUntraced ─────────────────────────────────────────────────────────────

describe('findUntraced', () => {
  it('returns empty array when all ids appear in traceability text', () => {
    const ids = new Set(['REQ-001', 'REQ-002']);
    expect(findUntraced(ids, 'REQ-001 ... REQ-002')).toEqual([]);
  });

  it('returns untraced ids when some are missing', () => {
    const ids = new Set(['REQ-001', 'REQ-002', 'REQ-003']);
    expect(findUntraced(ids, 'REQ-001')).toEqual(['REQ-002', 'REQ-003']);
  });

  it('returns results in sorted order', () => {
    const ids = new Set(['REQ-010', 'REQ-002', 'REQ-005']);
    const result = findUntraced(ids, '');
    expect(result).toEqual(['REQ-002', 'REQ-005', 'REQ-010']);
  });

  it('returns empty array when reqIds is empty', () => {
    expect(findUntraced(new Set(), 'REQ-001 REQ-002')).toEqual([]);
  });

  it('returns all ids when traceability text is empty', () => {
    const ids = new Set(['REQ-001', 'REQ-002']);
    expect(findUntraced(ids, '')).toEqual(['REQ-001', 'REQ-002']);
  });
});

// ─── Integration: actual docs ─────────────────────────────────────────────────

describe('traceability completeness (REQ-027)', () => {
  it('every REQ-ID in requirements.md appears in traceability.md', () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const reqText = readFileSync(resolve(root, 'docs/requirements.md'), 'utf8');
    const traceText = readFileSync(resolve(root, 'docs/traceability.md'), 'utf8');
    const untraced = findUntraced(extractReqIds(reqText), traceText);
    expect(untraced, `Untraced: ${untraced.join(', ')}`).toEqual([]);
  });
});
