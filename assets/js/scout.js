// Scout feed URL — unpinned gist raw endpoint (REQ-003)
const FEED_URL =
  'https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml';

// REL options for the single-select relevance filter
const REL_LEVELS = [
  { value: 'all', label: 'All' },
  { value: '3', label: '3/5 Worth tracking' },
  { value: '4', label: '4/5 Highly relevant' },
  { value: '5', label: '5/5 Direct impact' },
];

/**
 * Parse the inner <div> block from the summary HTML and extract
 * analysis, scoreLine, rationale, and tags as plain text (no innerHTML).
 * REQ-004: all field values come from textContent only.
 */
export function parseSummaryHtml(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const paras = Array.from(doc.querySelectorAll('p'));

  // The second <p> (index 1) is the article brief / analysis
  const analysis = paras[1] ? paras[1].textContent.trim() : '';

  // The inner div block contains the Scout annotation
  const block = doc.querySelector('div div');
  const blockParas = block ? Array.from(block.querySelectorAll('p')) : [];

  const scoreLine = blockParas[0] ? blockParas[0].textContent.trim() : '';
  const rationale = blockParas[1] ? blockParas[1].textContent.trim() : '';

  // Tags are inline spans in the third <p> of the block
  const tagPara = blockParas[2];
  const tags = tagPara
    ? Array.from(tagPara.querySelectorAll('span')).map(s => s.textContent.trim())
    : [];

  return { analysis, scoreLine, rationale, tags };
}

/**
 * Parse a score integer (3, 4, or 5) and label from a Scout score line.
 * Input example: "🐜 Scout — 🟡 3/5 — Worth tracking"
 */
export function extractScore(scoreLine) {
  const match = scoreLine.match(/(\d)\/5\s*[—\-–]\s*(.+)/);
  if (!match) return { score: 0, label: '' };
  return { score: parseInt(match[1], 10), label: match[2].trim() };
}

/**
 * Parse an Atom XML string into an array of item objects, sorted newest-first.
 * All text values come from textContent only (REQ-004).
 */
export function parseFeed(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) throw new Error('Feed XML could not be parsed');

  const ns = 'http://www.w3.org/2005/Atom';
  const entries = Array.from(doc.getElementsByTagNameNS(ns, 'entry'));

  const items = entries.map(entry => {
    const title = (entry.getElementsByTagNameNS(ns, 'title')[0] || {}).textContent || '';
    const link = entry.getElementsByTagNameNS(ns, 'link')[0];
    const url = link ? link.getAttribute('href') : '';
    const updatedEl = entry.getElementsByTagNameNS(ns, 'updated')[0];
    const updated = updatedEl ? updatedEl.textContent.trim() : '';
    const summaryEl = entry.getElementsByTagNameNS(ns, 'summary')[0];
    const summaryHtml = summaryEl ? summaryEl.textContent : '';

    const parsed = parseSummaryHtml(summaryHtml);
    const { score, label } = extractScore(parsed.scoreLine);

    return {
      title: title.trim(),
      url,
      updated,
      analysis: parsed.analysis,
      rationale: parsed.rationale,
      tags: parsed.tags,
      score,
      scoreLabel: label,
    };
  });

  // Newest-first (REQ-003)
  return items.sort((a, b) => (a.updated < b.updated ? 1 : -1));
}

/**
 * Filter items by relevance score and/or tags.
 * relFilter: '3', '4', '5', or 'all' (single-select)
 * tagFilters: array of tag strings — OR logic (item matches if it has ANY selected tag)
 * Combined rel + tag: AND logic (REQ-022)
 */
export function filterItems(items, relFilter, tagFilters) {
  return items.filter(item => {
    const relMatch = relFilter === 'all' || String(item.score) === relFilter;
    const tagMatch =
      !tagFilters || tagFilters.length === 0 ||
      tagFilters.some(t => item.tags.includes(t));
    return relMatch && tagMatch;
  });
}

// ─── DOM renderer ─────────────────────────────────────────────────────────────

function scoreEmoji(score) {
  if (score === 5) return '🔴';
  if (score === 4) return '🟠';
  return '🟡';
}

function makeCard(item) {
  const li = document.createElement('li');
  li.className = 'feed__item';
  if (item.score === 5) li.dataset.impact = 'direct';

  const header = document.createElement('div');
  header.className = 'feed__item-head';

  const meta = document.createElement('p');
  meta.className = 'feed__meta mono';
  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'feed__score';
  scoreSpan.textContent = scoreEmoji(item.score) + ' ' + item.score + '/5';
  const labelSpan = document.createElement('span');
  labelSpan.className = 'feed__label';
  labelSpan.textContent = item.scoreLabel;
  meta.append(scoreSpan, ' ', labelSpan);

  const h2 = document.createElement('h2');
  h2.className = 'feed__title';
  const a = document.createElement('a');
  a.href = item.url;
  a.rel = 'noopener noreferrer';
  a.target = '_blank';
  a.textContent = item.title;
  h2.appendChild(a);

  header.append(meta, h2);

  const analysis = document.createElement('p');
  analysis.className = 'feed__analysis';
  analysis.textContent = item.analysis;

  const rationale = document.createElement('p');
  rationale.className = 'feed__rationale';
  rationale.textContent = item.rationale;

  const footer = document.createElement('div');
  footer.className = 'feed__item-foot';

  const time = document.createElement('time');
  time.className = 'feed__time mono';
  time.dateTime = item.updated;
  time.textContent = item.updated.slice(0, 10);

  const tagList = document.createElement('ul');
  tagList.className = 'feed__tags';
  item.tags.forEach(tag => {
    const tagLi = document.createElement('li');
    tagLi.className = 'feed__tag';
    tagLi.textContent = tag;
    tagList.appendChild(tagLi);
  });

  footer.append(time, tagList);
  li.append(header, analysis, rationale, footer);
  return li;
}

function setState(feedEl, readoutEl, state, message) {
  feedEl.innerHTML = '';
  if (state === 'loading') {
    const p = document.createElement('p');
    p.className = 'feed__status';
    p.setAttribute('aria-live', 'polite');
    p.textContent = 'Loading feed...';
    feedEl.appendChild(p);
    if (readoutEl) readoutEl.textContent = '';
  } else if (state === 'error') {
    const p = document.createElement('p');
    p.className = 'feed__status feed__status--error';
    p.setAttribute('role', 'alert');
    p.textContent = message || 'Feed unavailable. Please try again later.';
    feedEl.appendChild(p);
    if (readoutEl) readoutEl.textContent = '';
  } else if (state === 'empty') {
    const p = document.createElement('p');
    p.className = 'feed__status';
    p.textContent = 'No items match current filters.';
    feedEl.appendChild(p);
    if (readoutEl) readoutEl.textContent = '0 items';
  }
}

function renderItems(feedEl, readoutEl, items) {
  feedEl.innerHTML = '';
  if (items.length === 0) {
    setState(feedEl, readoutEl, 'empty');
    return;
  }
  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(makeCard(item)));
  feedEl.appendChild(frag);
  if (readoutEl) readoutEl.textContent = items.length + ' item' + (items.length === 1 ? '' : 's');
}

function collectTagFilters(container) {
  return Array.from(container.querySelectorAll('[data-tag-filter].active'))
    .map(el => el.dataset.tagFilter);
}

function buildTagButtons(items, tagContainer, onFilter) {
  const allTags = [...new Set(items.flatMap(i => i.tags))].sort();
  tagContainer.innerHTML = '';
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter__tag';
    btn.dataset.tagFilter = tag;
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      onFilter();
    });
    tagContainer.appendChild(btn);
  });
}

export function init() {
  const feedEl = document.getElementById('scout-feed');
  const readoutEl = document.getElementById('scout-readout');
  const relSelect = document.getElementById('scout-rel-filter');
  const tagContainer = document.getElementById('scout-tag-filters');

  if (!feedEl) return;

  setState(feedEl, readoutEl, 'loading');

  let allItems = [];

  function applyFilters() {
    const relFilter = relSelect ? relSelect.value : 'all';
    const tagFilters = tagContainer ? collectTagFilters(tagContainer) : [];
    renderItems(feedEl, readoutEl, filterItems(allItems, relFilter, tagFilters));
  }

  if (relSelect) relSelect.addEventListener('change', applyFilters);

  fetch(FEED_URL)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(xml => {
      allItems = parseFeed(xml);
      if (tagContainer) buildTagButtons(allItems, tagContainer, applyFilters);
      applyFilters();
    })
    .catch(err => {
      setState(feedEl, readoutEl, 'error');
      console.error('Scout feed error:', err);
    });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
