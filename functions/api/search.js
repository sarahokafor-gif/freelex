const USER_AGENT = 'FreeLex/1.0 (UK Legal Research; https://freelex.pages.dev)';
const TIMEOUT_MS = 10000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('q');
  const source = url.searchParams.get('source') || 'all';

  if (!query || !query.trim()) {
    return jsonResponse([], 400);
  }

  const fetchers = getFetchers(source, query.trim());
  const settled = await Promise.allSettled(fetchers.map(fn => fn()));

  let results = [];
  let idCounter = 1;
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled' && Array.isArray(outcome.value)) {
      for (const item of outcome.value) {
        results.push({ ...item, id: idCounter++ });
      }
    }
  }

  return jsonResponse(results);
}

function getFetchers(source, query) {
  const map = {
    legislation: [() => fetchLegislation(query)],
    caselaw: [() => fetchCaseLaw(query)],
    'supreme-court': [() => fetchSupremeCourt(query)],
    rules: [() => fetchRules(query)],
    guidance: [() => fetchGuidance(query)],
  };

  if (source === 'all') {
    return Object.values(map).flat();
  }
  return map[source] || [];
}

// --- legislation.gov.uk (Atom feed) ---

async function fetchLegislation(query) {
  const url = `https://www.legislation.gov.uk/all/data.feed?text=${encodeURIComponent(query)}&results-count=10`;
  const xml = await fetchWithTimeout(url);
  return parseLegislationFeed(xml, 'legislation', 'legislation.gov.uk');
}

// --- National Archives Case Law (Atom feed) ---

async function fetchCaseLaw(query) {
  const url = `https://caselaw.nationalarchives.gov.uk/atom.xml?query=${encodeURIComponent(query)}&per_page=10`;
  const xml = await fetchWithTimeout(url);
  return parseCaseLawFeed(xml, 'caselaw', 'National Archives');
}

// --- Supreme Court (National Archives filtered) ---

async function fetchSupremeCourt(query) {
  const url = `https://caselaw.nationalarchives.gov.uk/atom.xml?query=${encodeURIComponent(query)}&court=uksc&per_page=10`;
  const xml = await fetchWithTimeout(url);
  return parseCaseLawFeed(xml, 'supreme-court', 'Supreme Court');
}

// --- Statutory Instruments / Court Rules ---

async function fetchRules(query) {
  const url = `https://www.legislation.gov.uk/uksi/data.feed?text=${encodeURIComponent(query)}&results-count=10`;
  const xml = await fetchWithTimeout(url);
  return parseLegislationFeed(xml, 'rules', 'Court Rules');
}

// --- GOV.UK Guidance (JSON API) ---

async function fetchGuidance(query) {
  const url = `https://www.gov.uk/api/search.json?q=${encodeURIComponent(query)}&filter_organisations=ministry-of-justice&count=10`;
  const resp = await fetchWithTimeout(url, true);
  const data = JSON.parse(resp);

  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map(item => ({
    title: item.title || 'Untitled',
    source: 'guidance',
    sourceLabel: 'Practice Direction',
    url: item.link ? `https://www.gov.uk${item.link}` : 'https://www.gov.uk',
    snippet: item.description || '',
    date: extractYear(item.public_timestamp || ''),
    type: formatDocType(item.content_store_document_type || item.format || 'Guidance'),
  }));
}

// --- HTTP helper with timeout ---

async function fetchWithTimeout(url, isJson = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: isJson ? 'application/json' : 'application/atom+xml, application/xml, text/xml',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Legislation.gov.uk Atom feed parser ---

function parseLegislationFeed(xml, source, sourceLabel) {
  const entries = splitEntries(xml);
  return entries.map(entry => {
    const title = extractTag(entry, 'title');
    const link = extractAttr(entry, 'link', 'href');
    const summary = stripHtml(extractTag(entry, 'summary') || extractTag(entry, 'content'));
    const updated = extractTag(entry, 'updated') || extractTag(entry, 'published');
    const category = extractAttr(entry, 'category', 'term');

    return {
      title: title || 'Untitled',
      source,
      sourceLabel,
      url: link || 'https://www.legislation.gov.uk',
      snippet: truncate(summary, 300),
      date: extractYear(updated || ''),
      type: category || (source === 'rules' ? 'Statutory Instrument' : 'Legislation'),
    };
  });
}

// --- Case Law Atom feed parser ---

function parseCaseLawFeed(xml, source, sourceLabel) {
  const entries = splitEntries(xml);
  return entries.map(entry => {
    const title = extractTag(entry, 'title');
    const link = extractAttr(entry, 'link', 'href');
    const summary = stripHtml(extractTag(entry, 'summary') || extractTag(entry, 'content'));
    const updated = extractTag(entry, 'updated') || extractTag(entry, 'published');
    const category = extractAttr(entry, 'category', 'term');

    return {
      title: title || 'Untitled',
      source,
      sourceLabel,
      url: link || 'https://caselaw.nationalarchives.gov.uk',
      snippet: truncate(summary, 300),
      date: extractYear(updated || ''),
      type: category || (source === 'supreme-court' ? 'Supreme Court Judgment' : 'Case Law'),
    };
  });
}

// --- XML regex helpers ---

function splitEntries(xml) {
  const matches = [];
  const re = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

function extractTag(xml, tag) {
  // Match both <tag>content</tag> and <tag ...>content</tag>
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = re.exec(xml);
  return m ? m[1].trim() : '';
}

function extractAttr(xml, tag, attr) {
  // Match <tag ... attr="value" ... /> or <tag ... attr="value" ...>
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["'][^>]*/?>`, 'i');
  const m = re.exec(xml);
  return m ? m[1] : '';
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

function truncate(str, max) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s+\S*$/, '') + '...';
}

function extractYear(dateStr) {
  const m = dateStr.match(/(\d{4})/);
  return m ? m[1] : '';
}

function formatDocType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// --- Response helper ---

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
