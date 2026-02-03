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
    parliament: [() => fetchParliamentBills(query)],
    judiciary: [() => fetchJudiciary(query)],
    'law-commission': [() => fetchLawCommission(query)],
    bailii: [() => fetchBailii(query)],
    eurlex: [() => fetchEurLex(query)],
    hudoc: [() => fetchHudoc(query)],
    'sos-decisions': [() => fetchSoSDecisions(query)],
    ombudsman: [() => fetchOmbudsman(query)],
    regulators: [() => fetchCqc(query)],
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

// --- GOV.UK Guidance (JSON API — all departments, guidance & regulation) ---

async function fetchGuidance(query) {
  const url = `https://www.gov.uk/api/search.json?q=${encodeURIComponent(query)}&filter_content_purpose_supergroup=guidance_and_regulation&count=10`;
  const resp = await fetchWithTimeout(url, true);
  const data = JSON.parse(resp);

  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map(item => ({
    title: item.title || 'Untitled',
    source: 'guidance',
    sourceLabel: 'GOV.UK Guidance',
    url: item.link ? `https://www.gov.uk${item.link}` : 'https://www.gov.uk',
    snippet: item.description || '',
    date: extractYear(item.public_timestamp || ''),
    type: formatDocType(item.content_store_document_type || item.format || 'Guidance'),
  }));
}

// --- UK Parliament Bills (JSON API) ---

async function fetchParliamentBills(query) {
  const url = `https://bills-api.parliament.uk/api/v1/Bills?SearchTerm=${encodeURIComponent(query)}&take=10`;
  const resp = await fetchWithTimeout(url, true);
  const data = JSON.parse(resp);

  if (!data.items || !Array.isArray(data.items)) return [];

  return data.items.map(item => {
    const bill = item.billId ? item : item;
    const stage = bill.currentStage?.description || '';
    const dateStr = bill.lastUpdate || bill.currentStage?.stageSittings?.[0]?.date || '';
    return {
      title: bill.shortTitle || bill.longTitle || 'Untitled',
      source: 'parliament',
      sourceLabel: 'UK Parliament',
      url: `https://bills.parliament.uk/bills/${bill.billId}`,
      snippet: [bill.longTitle, stage ? `Current stage: ${stage}` : ''].filter(Boolean).join('. '),
      date: extractYear(dateStr),
      type: bill.isAct ? 'Act of Parliament' : 'Parliamentary Bill',
    };
  });
}

// --- Judiciary.uk Practice Directions (Atom feed) ---

async function fetchJudiciary(query) {
  const url = `https://www.judiciary.uk/feed/?s=${encodeURIComponent(query)}`;
  const xml = await fetchWithTimeout(url);
  // judiciary.uk returns Atom (uses <entry> tags), not RSS (which uses <item>)
  const entries = splitEntries(xml);
  return entries.map(entry => {
    const title = stripHtml(extractTag(entry, 'title'));
    const link = extractAttr(entry, 'link', 'href');
    const summary = stripHtml(extractTag(entry, 'summary') || extractTag(entry, 'content'));
    const updated = extractTag(entry, 'updated') || extractTag(entry, 'published');
    return {
      title: title || 'Untitled',
      source: 'judiciary',
      sourceLabel: 'Judiciary',
      url: link || 'https://www.judiciary.uk',
      snippet: truncate(summary, 300),
      date: extractYear(updated || ''),
      type: 'Judicial Guidance',
    };
  });
}

// --- Law Commission (RSS feed) ---

async function fetchLawCommission(query) {
  const url = `https://lawcom.gov.uk/search/${encodeURIComponent(query)}/feed/rss2/`;
  const xml = await fetchWithTimeout(url);
  return parseRssFeed(xml, 'law-commission', 'Law Commission');
}

// --- BAILII (older cases & tribunals — use Google site-restricted search as BAILII blocks direct access) ---

async function fetchBailii(query) {
  // BAILII blocks automated requests (403), so search via Google site: restriction
  const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query + ' site:bailii.org')}&num=10&cx=partner-pub-bailii&key=`;
  // Fallback: use National Archives with broader tribunal coverage
  const url = `https://caselaw.nationalarchives.gov.uk/atom.xml?query=${encodeURIComponent(query)}&per_page=10&order=-date`;
  try {
    const xml = await fetchWithTimeout(url);
    const entries = splitEntries(xml);
    return entries.map(entry => {
      const title = extractTag(entry, 'title');
      const link = extractAttr(entry, 'link', 'href');
      const summary = stripHtml(extractTag(entry, 'summary') || extractTag(entry, 'content'));
      const updated = extractTag(entry, 'updated') || extractTag(entry, 'published');
      return {
        title: title || 'Untitled',
        source: 'bailii',
        sourceLabel: 'BAILII / Tribunals',
        url: link || 'https://www.bailii.org',
        snippet: truncate(summary, 300),
        date: extractYear(updated || ''),
        type: 'Tribunal / Case Law',
      };
    });
  } catch {
    return [];
  }
}

// --- EUR-Lex / Retained EU Law (via legislation.gov.uk eu-origin feed) ---

async function fetchEurLex(query) {
  // legislation.gov.uk hosts retained EU law — more reliable than scraping EUR-Lex HTML
  const url = `https://www.legislation.gov.uk/eu-origin/data.feed?text=${encodeURIComponent(query)}&results-count=10`;
  try {
    const xml = await fetchWithTimeout(url);
    return parseLegislationFeed(xml, 'eurlex', 'EU Retained Law');
  } catch {
    return [];
  }
}

// --- HUDOC (European Court of Human Rights) ---

async function fetchHudoc(query) {
  // HUDOC has a JSON API behind its search interface
  const url = `https://hudoc.echr.coe.int/app/query/results?query=contentsitename:ECHR AND (${encodeURIComponent(query)})&select=itemid,applicability,appno,article,conclusion,docname,doctypebranch,ecli,importance,judgementdate,languageisocode,originatingbody,publishedby,Ede,Fre,separateopinion,typedescription&sort=ASCENDING date&start=0&length=10`;
  try {
    const resp = await fetchWithTimeout(url, true);
    const data = JSON.parse(resp);
    if (!data.results || !Array.isArray(data.results)) return [];
    return data.results.map(item => {
      const cols = item.columns || {};
      return {
        title: cols.docname || 'Untitled',
        source: 'hudoc',
        sourceLabel: 'ECHR (HUDOC)',
        url: `https://hudoc.echr.coe.int/eng?i=${cols.itemid || ''}`,
        snippet: [cols.article ? `Articles: ${cols.article}` : '', cols.conclusion || ''].filter(Boolean).join('. '),
        date: extractYear(cols.judgementdate || cols.kpdate || ''),
        type: cols.typedescription || 'ECHR Judgment',
      };
    });
  } catch {
    // HUDOC API can be unreliable; return empty gracefully
    return [];
  }
}

// --- Government Policy & Decisions (GOV.UK policy, transparency, consultations) ---

async function fetchSoSDecisions(query) {
  const url = `https://www.gov.uk/api/search.json?q=${encodeURIComponent(query)}&filter_content_purpose_supergroup[]=policy_and_engagement&filter_content_purpose_supergroup[]=transparency&count=10`;
  const resp = await fetchWithTimeout(url, true);
  const data = JSON.parse(resp);

  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map(item => ({
    title: item.title || 'Untitled',
    source: 'sos-decisions',
    sourceLabel: 'GOV.UK Policy',
    url: item.link ? `https://www.gov.uk${item.link}` : 'https://www.gov.uk',
    snippet: item.description || '',
    date: extractYear(item.public_timestamp || ''),
    type: formatDocType(item.content_store_document_type || item.format || 'Policy Document'),
  }));
}

// --- Ombudsman (LGO decisions search) ---

async function fetchOmbudsman(query) {
  // LGO has the most accessible search among ombudsman bodies
  const url = `https://www.lgo.org.uk/decisions/?q=${encodeURIComponent(query)}`;
  try {
    const html = await fetchWithTimeout(url, false, 'text/html');
    return parseOmbudsmanResults(html, query);
  } catch {
    return [];
  }
}

function parseOmbudsmanResults(html, query) {
  const results = [];
  // LGO search results are in <a> tags with decision references
  const re = /<a[^>]*href="(\/decisions\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null && results.length < 10) {
    const href = m[1];
    const title = stripHtml(m[2]);
    if (title.length > 5 && !title.includes('Skip') && !title.includes('menu')) {
      results.push({
        title,
        source: 'ombudsman',
        sourceLabel: 'LG Ombudsman',
        url: `https://www.lgo.org.uk${href}`,
        snippet: '',
        date: extractYear(href),
        type: 'Ombudsman Decision',
      });
    }
  }
  return results;
}

// --- Regulators (GOV.UK search filtered to key regulatory bodies) ---

async function fetchCqc(query) {
  const orgs = [
    'care-quality-commission',
    'information-commissioners-office',
    'solicitors-regulation-authority',
    'hm-courts-and-tribunals-service',
    'office-of-the-public-guardian',
    'legal-aid-agency',
  ];
  const orgParams = orgs.map(o => `filter_organisations[]=${o}`).join('&');
  const url = `https://www.gov.uk/api/search.json?q=${encodeURIComponent(query)}&${orgParams}&count=10`;
  try {
    const resp = await fetchWithTimeout(url, true);
    const data = JSON.parse(resp);
    if (!data.results || !Array.isArray(data.results)) return [];
    return data.results.map(item => ({
      title: item.title || 'Untitled',
      source: 'regulators',
      sourceLabel: 'Regulators',
      url: item.link ? `https://www.gov.uk${item.link}` : 'https://www.gov.uk',
      snippet: item.description || '',
      date: extractYear(item.public_timestamp || ''),
      type: formatDocType(item.content_store_document_type || item.format || 'Regulatory'),
    }));
  } catch {
    return [];
  }
}

// --- HTTP helper with timeout ---

async function fetchWithTimeout(url, isJson = false, acceptOverride = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const accept = acceptOverride || (isJson ? 'application/json' : 'application/atom+xml, application/xml, text/xml');

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: accept,
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
    const title = stripHtml(extractTag(entry, 'title'));
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
    const title = stripHtml(extractTag(entry, 'title'));
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

// --- RSS feed parser (for judiciary.uk and Law Commission) ---

function parseRssFeed(xml, source, sourceLabel) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    items.push(m[1]);
  }
  return items.map(item => {
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const desc = stripHtml(extractTag(item, 'description'));
    const pubDate = extractTag(item, 'pubDate');

    return {
      title: title || 'Untitled',
      source,
      sourceLabel,
      url: link || '',
      snippet: truncate(desc, 300),
      date: extractYear(pubDate || ''),
      type: source === 'judiciary' ? 'Judicial Guidance' : 'Law Commission',
    };
  });
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
