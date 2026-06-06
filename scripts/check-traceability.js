#!/usr/bin/env node
// Verify every REQ-ID defined in docs/requirements.md appears in docs/traceability.md.
// Exits 1 with a list of untraced IDs if any are missing (REQ-027).
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Extract the unique set of REQ-NNN identifiers from a text string.
 */
export function extractReqIds(text) {
  return new Set(text.match(/\bREQ-\d+\b/g) ?? []);
}

/**
 * Return a sorted array of IDs from reqIds that do not appear in traceText.
 */
export function findUntraced(reqIds, traceText) {
  return [...reqIds].filter(id => !traceText.includes(id)).sort();
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const reqText = readFileSync(resolve(root, 'docs/requirements.md'), 'utf8');
  const traceText = readFileSync(resolve(root, 'docs/traceability.md'), 'utf8');
  const reqIds = extractReqIds(reqText);
  const untraced = findUntraced(reqIds, traceText);
  if (untraced.length) {
    console.error(`Traceability check failed — ${untraced.length} untraced requirement(s): ${untraced.join(', ')}`);
    process.exit(1);
  }
  console.log(`Traceability check passed — all ${reqIds.size} requirements traced.`);
}
