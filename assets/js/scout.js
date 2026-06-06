// Scout feed URL — unpinned gist raw endpoint (REQ-003)
const FEED_URL =
  'https://gist.githubusercontent.com/AdrianRossouw/8cd844ca87b6526ba6d74bf171c5a788/raw/feed.xml';

const LABELS = { 5: 'Direct impact', 4: 'Highly relevant', 3: 'Worth tracking' };

/**
 * Parse the inner Scout annotation block from summary HTML.
 * All field values come from textContent only — no innerHTML (REQ-004).
 */
export function parseSummaryHtml(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const paras = Array.from(doc.querySelectorAll('p'));

  // First <p>: "Originally published D Month YYYY"
  const pubRaw = paras[0] ? paras[0].textContent.trim() : '';
  const pubMatch = pubRaw.match(/published\s+(.+)$/i);
  const publishedDate = pubMatch ? pubMatch[1].trim() : '';

  // Second <p>: article brief / analysis
  const analysis = paras[1] ? paras[1].textContent.trim() : '';

  // Inner div: Scout annotation block
  const block = doc.querySelector('div div');
  const blockParas = block ? Array.from(block.querySelectorAll('p')) : [];

  const scoreLine = blockParas[0] ? blockParas[0].textContent.trim() : '';
  const rationale = blockParas[1] ? blockParas[1].textContent.trim() : '';

  const tagPara = blockParas[2];
  const tags = tagPara
    ? Array.from(tagPara.querySelectorAll('span')).map(s => s.textContent.trim())
    : [];

  return { publishedDate, analysis, scoreLine, rationale, tags };
}

/**
 * Parse score integer (3, 4, 5) and label from a Scout score line.
 * e.g. "🐜 Scout — 🟡 3/5 — Worth tracking"
 */
export function extractScore(scoreLine) {
  const match = scoreLine.match(/(\d)\/5\s*[—\-–]\s*(.+)/);
  if (!match) return { score: 0, label: '' };
  return { score: parseInt(match[1], 10), label: match[2].trim() };
}

/**
 * Parse Atom XML into items sorted newest-first.
 * All text from textContent only (REQ-004).
 */
export function parseFeed(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Feed XML could not be parsed');

  const ns = 'http://www.w3.org/2005/Atom';
  const entries = Array.from(doc.getElementsByTagNameNS(ns, 'entry'));

  const items = entries.map(entry => {
    const title = (entry.getElementsByTagNameNS(ns, 'title')[0] || {}).textContent || '';
    const linkEl = entry.getElementsByTagNameNS(ns, 'link')[0];
    const url = linkEl ? linkEl.getAttribute('href') : '';
    const updated = (entry.getElementsByTagNameNS(ns, 'updated')[0] || {}).textContent || '';
    const summaryEl = entry.getElementsByTagNameNS(ns, 'summary')[0];
    const summaryHtml = summaryEl ? summaryEl.textContent : '';

    let domain = '';
    try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch (_) {}

    const parsed = parseSummaryHtml(summaryHtml);
    const { score, label } = extractScore(parsed.scoreLine);

    return {
      title: title.trim(),
      url,
      domain,
      updated,
      published: parsed.publishedDate,
      analysis: parsed.analysis,
      rationale: parsed.rationale,
      tags: parsed.tags,
      score,
      label: label || LABELS[score] || '',
    };
  });

  return items.sort((a, b) => (a.updated < b.updated ? 1 : -1));
}

/**
 * Filter by relevance (single-select) AND tags (OR logic). REQ-022.
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

function pips(score) {
  const span = document.createElement('span');
  span.className = 'signal__pips';
  span.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 5; i++) {
    const pip = document.createElement('span');
    pip.className = 'signal__pip';
    pip.dataset.on = i <= score ? '1' : '0';
    span.appendChild(pip);
  }
  return span;
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch (_) { return iso || ''; }
}

function makeCard(item, onTagClick) {
  const li = document.createElement('li');
  li.className = 'feed__item';
  li.dataset.score = item.score;

  // Title
  const h2 = document.createElement('h2');
  h2.className = 'feed__title';
  const a = document.createElement('a');
  a.href = item.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = item.title;
  h2.appendChild(a);

  // Meta: signal + date
  const meta = document.createElement('div');
  meta.className = 'feed__meta';

  const signal = document.createElement('span');
  signal.className = 'signal';
  const labelSpan = document.createElement('span');
  labelSpan.className = 'signal__label';
  labelSpan.textContent = (item.label || LABELS[item.score] || '').toUpperCase() + ' · ' + item.score + '/5';
  signal.append(pips(item.score), labelSpan);

  const dateSpan = document.createElement('span');
  dateSpan.className = 'feed__date';
  dateSpan.textContent = 'scouted ' + fmtDate(item.updated);

  meta.append(signal, dateSpan);

  // Analysis
  const analysis = document.createElement('p');
  analysis.className = 'feed__analysis';
  analysis.textContent = item.analysis;

  // Rationale (optional)
  let rationaleEl = null;
  if (item.rationale) {
    rationaleEl = document.createElement('p');
    rationaleEl.className = 'feed__rationale';
    const b = document.createElement('b');
    b.textContent = 'Scored ' + item.score + '/5.';
    rationaleEl.append(b, ' ' + item.rationale);
  }

  // Footer: source + tags
  const foot = document.createElement('div');
  foot.className = 'feed__foot';

  const source = document.createElement('span');
  source.className = 'feed__source';
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  const srcLink = document.createElement('a');
  srcLink.href = item.url;
  srcLink.target = '_blank';
  srcLink.rel = 'noopener';
  const srcText = item.published
    ? item.domain + ' · published ' + item.published
    : item.domain;
  srcLink.textContent = srcText;
  source.append(arrow, srcLink);

  const tagsSpan = document.createElement('span');
  tagsSpan.className = 'feed__tags';
  item.tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag';
    btn.dataset.tag = tag;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = tag;
    btn.addEventListener('click', () => onTagClick(tag));
    tagsSpan.appendChild(btn);
  });

  foot.append(source, tagsSpan);

  li.append(h2, meta, analysis);
  if (rationaleEl) li.appendChild(rationaleEl);
  li.appendChild(foot);
  return li;
}

export function init() {
  const streamEl = document.getElementById('stream');
  const readoutEl = document.getElementById('readout');
  const relGroup = document.getElementById('rel-group');
  const tagGroup = document.getElementById('tag-group');
  const showingEl = document.getElementById('showing');
  const roLast = document.getElementById('ro-last');
  const roCount = document.getElementById('ro-count');

  if (!streamEl) return;

  let allItems = [];
  const state = { rel: 'all', tags: [] };

  function getTagFilters() {
    return Array.from(tagGroup.querySelectorAll('[data-tag][aria-pressed="true"]'))
      .map(b => b.dataset.tag);
  }

  function render() {
    const shown = filterItems(allItems, state.rel, getTagFilters());

    if (showingEl) {
      showingEl.textContent = 'Showing ' + shown.length + ' of ' + allItems.length;
    }

    streamEl.innerHTML = '';
    if (!shown.length) {
      const empty = document.createElement('li');
      empty.className = 'feed__empty';
      empty.textContent = 'No items match this filter. Loosen it.';
      streamEl.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    shown.forEach(item => frag.appendChild(makeCard(item, toggleTag)));
    streamEl.appendChild(frag);
  }

  function toggleTag(tag) {
    const i = state.tags.indexOf(tag);
    if (i >= 0) state.tags.splice(i, 1); else state.tags.push(tag);
    tagGroup.querySelectorAll('[data-tag]').forEach(b => {
      const pressed = state.tags.includes(b.dataset.tag);
      b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
    render();
    const filtersTop = document.getElementById('filters');
    if (filtersTop) window.scrollTo({ top: filtersTop.offsetTop - 80, behavior: 'smooth' });
  }

  // Relevance chip group
  if (relGroup) {
    relGroup.addEventListener('click', e => {
      const btn = e.target.closest('[data-rel]');
      if (!btn) return;
      state.rel = btn.dataset.rel;
      relGroup.querySelectorAll('[data-rel]').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render();
    });
  }

  // Loading state
  streamEl.innerHTML = '';
  const loadingLi = document.createElement('li');
  loadingLi.className = 'feed__empty';
  loadingLi.textContent = 'Loading…';
  streamEl.appendChild(loadingLi);

  fetch(FEED_URL)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(xml => {
      allItems = parseFeed(xml);

      // Populate readout chrome
      if (roLast && allItems[0]) {
        const d = new Date(allItems[0].updated);
        if (!isNaN(d)) {
          const p = n => (n < 10 ? '0' : '') + n;
          roLast.textContent = d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' +
            p(d.getUTCDate()) + ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ' UTC';
        }
      }
      if (roCount) roCount.textContent = allItems.length + ' items';

      // Build tag chips sorted by frequency
      const tagFreq = {};
      allItems.forEach(it => it.tags.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; }));
      const tagNames = Object.keys(tagFreq).sort((a, b) => tagFreq[b] - tagFreq[a]);
      tagGroup.querySelectorAll('[data-tag]').forEach(el => el.remove());
      tagNames.forEach(tag => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.dataset.tag = tag;
        btn.setAttribute('aria-pressed', 'false');
        const count = document.createElement('span');
        count.className = 'chip__count';
        count.textContent = tagFreq[tag];
        btn.textContent = tag;
        btn.appendChild(count);
        btn.addEventListener('click', () => toggleTag(tag));
        tagGroup.appendChild(btn);
      });

      render();
    })
    .catch(err => {
      streamEl.innerHTML = '';
      const errLi = document.createElement('li');
      errLi.className = 'feed__empty';
      errLi.setAttribute('role', 'alert');
      errLi.textContent = 'Feed unavailable. Please try again later.';
      streamEl.appendChild(errLi);
      console.error('Scout feed error:', err);
    });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
