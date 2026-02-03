const USER_AGENT = 'FreeLex/1.0 (UK Legal Research; https://freelex.pages.dev)';
const TIMEOUT_MS = 10000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const LEGAL_ABBREVIATIONS = {
  // Acts of Parliament
  'mha': 'Mental Health Act 1983',
  'mha 1983': 'Mental Health Act 1983',
  'mca': 'Mental Capacity Act 2005',
  'mca 2005': 'Mental Capacity Act 2005',
  'mca 1973': 'Matrimonial Causes Act 1973',
  'ca 1989': 'Children Act 1989',
  'ca 2004': 'Children Act 2004',
  'ca 2014': 'Care Act 2014',
  'care act': 'Care Act 2014',
  'hra': 'Human Rights Act 1998',
  'hra 1998': 'Human Rights Act 1998',
  'ea': 'Equality Act 2010',
  'ea 2010': 'Equality Act 2010',
  'pace': 'Police and Criminal Evidence Act 1984',
  'pace 1984': 'Police and Criminal Evidence Act 1984',
  'cja 2003': 'Criminal Justice Act 2003',
  'sa 2020': 'Sentencing Act 2020',
  'tolata': 'Trusts of Land and Appointment of Trustees Act 1996',
  'tolata 1996': 'Trusts of Land and Appointment of Trustees Act 1996',
  'lra': 'Land Registration Act 2002',
  'lra 2002': 'Land Registration Act 2002',
  'era': 'Employment Rights Act 1996',
  'era 1996': 'Employment Rights Act 1996',
  'fla': 'Family Law Act 1996',
  'fla 1996': 'Family Law Act 1996',
  'sca': 'Senior Courts Act 1981',
  'sca 1981': 'Senior Courts Act 1981',
  'ia 1971': 'Immigration Act 1971',
  'ia 2014': 'Immigration Act 2014',
  'tcea': 'Tribunals Courts and Enforcement Act 2007',
  'tcea 2007': 'Tribunals Courts and Enforcement Act 2007',
  'dpa': 'Data Protection Act 2018',
  'dpa 2018': 'Data Protection Act 2018',
  'ha 1985': 'Housing Act 1985',
  'ha 1988': 'Housing Act 1988',
  'ha 1996': 'Housing Act 1996',
  'aca 2002': 'Adoption and Children Act 2002',
  'aca': 'Adoption and Children Act 2002',
  'csa 1991': 'Child Support Act 1991',
  'csa': 'Child Support Act 1991',
  'lca 2009': 'Land Charges Act 2009',
  'rta': 'Road Traffic Act 1988',
  'rta 1988': 'Road Traffic Act 1988',
  'ta 1968': 'Theft Act 1968',
  'oapa': 'Offences Against the Person Act 1861',
  'oapa 1861': 'Offences Against the Person Act 1861',
  'cda 1998': 'Crime and Disorder Act 1998',
  'poa 1986': 'Public Order Act 1986',
  'poa': 'Public Order Act 1986',
  'mfpa': 'Matrimonial and Family Proceedings Act 1984',
  'mfpa 1984': 'Matrimonial and Family Proceedings Act 1984',

  // Safeguards and frameworks
  'dols': 'Deprivation of Liberty Safeguards',
  'lps': 'Liberty Protection Safeguards',
  'echr': 'European Convention on Human Rights',
  'gdpr': 'General Data Protection Regulation',

  // Court rules
  'cpr': 'Civil Procedure Rules',
  'fpr': 'Family Procedure Rules',
  'copr': 'Court of Protection Rules',
  'crpr': 'Criminal Procedure Rules',
};

// Related searches for common legal topics — provides "smart" suggestions
const RELATED_SEARCHES = {
  'mca': ['deprivation of liberty', 'best interests', 'mental capacity assessment', 'lasting power of attorney', 'Court of Protection', 'DoLS'],
  'mca 2005': ['deprivation of liberty', 'best interests', 'mental capacity assessment', 'lasting power of attorney', 'Court of Protection', 'DoLS'],
  'mental capacity act 2005': ['deprivation of liberty', 'best interests', 'mental capacity assessment', 'lasting power of attorney', 'Court of Protection'],
  'mha': ['section 2 assessment', 'section 3 detention', 'nearest relative', 'AMHP', 'mental health tribunal', 'section 117 aftercare'],
  'mha 1983': ['section 2 assessment', 'section 3 detention', 'nearest relative', 'AMHP', 'mental health tribunal', 'section 117 aftercare'],
  'mental health act 1983': ['section 2 assessment', 'section 3 detention', 'nearest relative', 'AMHP', 'mental health tribunal'],
  'ca 2014': ['needs assessment', 'eligibility criteria', 'safeguarding adults', 'carers assessment', 'care planning', 'ordinary residence'],
  'care act': ['needs assessment', 'eligibility criteria', 'safeguarding adults', 'carers assessment', 'care planning', 'ordinary residence'],
  'care act 2014': ['needs assessment', 'eligibility criteria', 'safeguarding adults', 'carers assessment', 'care planning'],
  'ca 1989': ['child protection', 'section 47 enquiry', 'care order', 'supervision order', 'parental responsibility', 'looked after children'],
  'children act 1989': ['child protection', 'section 47 enquiry', 'care order', 'supervision order', 'parental responsibility'],
  'hra': ['Article 2 right to life', 'Article 3 torture', 'Article 5 liberty', 'Article 6 fair trial', 'Article 8 private life', 'proportionality'],
  'hra 1998': ['Article 2 right to life', 'Article 3 torture', 'Article 5 liberty', 'Article 6 fair trial', 'Article 8 private life'],
  'human rights act 1998': ['Article 2 right to life', 'Article 3 torture', 'Article 5 liberty', 'Article 6 fair trial', 'Article 8 private life'],
  'dols': ['deprivation of liberty', 'best interests assessor', 'mental health assessor', 'standard authorisation', 'urgent authorisation', 'MCA'],
  'lps': ['liberty protection safeguards', 'responsible body', 'authorisation conditions', 'mental capacity', 'deprivation of liberty'],
  'ea': ['discrimination', 'protected characteristics', 'reasonable adjustments', 'harassment', 'victimisation', 'public sector equality duty'],
  'ea 2010': ['discrimination', 'protected characteristics', 'reasonable adjustments', 'harassment', 'victimisation'],
  'equality act 2010': ['discrimination', 'protected characteristics', 'reasonable adjustments', 'harassment', 'victimisation'],
  'cpr': ['pre-action protocol', 'disclosure', 'summary judgment', 'default judgment', 'costs', 'witness statements', 'Part 36 offer'],
  'civil procedure rules': ['pre-action protocol', 'disclosure', 'summary judgment', 'default judgment', 'costs', 'Part 36 offer'],
  'fpr': ['financial remedies', 'child arrangements', 'Form A', 'Form E', 'FDR', 'consent order'],
  'family procedure rules': ['financial remedies', 'child arrangements', 'Form A', 'Form E', 'FDR', 'consent order'],
  'copr': ['Court of Protection', 'P application', 'deputyship', 'statutory will', 'serious medical treatment', 'Rule 3A representative'],
  'court of protection rules': ['P application', 'deputyship', 'statutory will', 'serious medical treatment'],
  'era': ['unfair dismissal', 'redundancy', 'whistleblowing', 'flexible working', 'written statement', 'notice period'],
  'era 1996': ['unfair dismissal', 'redundancy', 'whistleblowing', 'flexible working', 'written statement'],
  'employment rights act 1996': ['unfair dismissal', 'redundancy', 'whistleblowing', 'flexible working'],
  'ha 1985': ['secure tenancy', 'right to buy', 'succession', 'housing conditions', 'disrepair'],
  'ha 1988': ['assured tenancy', 'assured shorthold tenancy', 'section 21 notice', 'section 8 notice', 'possession'],
  'ha 1996': ['homelessness', 'housing register', 'allocations', 'intentional homelessness', 'priority need'],
  'housing act 1996': ['homelessness', 'housing register', 'allocations', 'intentional homelessness', 'priority need'],
  'pace': ['stop and search', 'arrest', 'detention', 'interview', 'identification', 'Code C', 'Code D'],
  'police and criminal evidence act 1984': ['stop and search', 'arrest', 'detention', 'interview', 'identification'],
  'gdpr': ['data protection', 'consent', 'data subject rights', 'breach notification', 'data controller', 'data processor'],
  'dpa': ['data protection', 'subject access request', 'lawful basis', 'special category data', 'exemptions'],
  'dpa 2018': ['data protection', 'subject access request', 'lawful basis', 'special category data'],
  'echr': ['human rights', 'Strasbourg', 'margin of appreciation', 'proportionality', 'Article 6', 'Article 8'],
};

// Get related searches for a query
function getRelatedSearches(query) {
  const lower = query.toLowerCase().trim();
  // Try exact match first
  if (RELATED_SEARCHES[lower]) {
    return RELATED_SEARCHES[lower];
  }
  // Try matching the act title if we expanded it
  for (const key of Object.keys(RELATED_SEARCHES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return RELATED_SEARCHES[key];
    }
  }
  return [];
}

// Categorize results for frontend grouping
function categorizeResult(result) {
  const source = result.source;
  const type = (result.type || '').toLowerCase();
  const title = (result.title || '').toLowerCase();
  const url = (result.url || '').toLowerCase();

  // Secondary legislation (SIs, regulations, orders) — check this FIRST
  if (source === 'legislation' || source === 'eurlex') {
    if (url.includes('/uksi/') || url.includes('/ukdsi/') || url.includes('/wsi/') || url.includes('/ssi/') || url.includes('/eur/')) {
      return 'secondary-legislation';
    }
    // Check title for SI indicators
    if (title.includes('order ') || title.includes('regulations ') || title.includes('rules ') ||
        title.startsWith('the ') && (title.includes(' order') || title.includes(' regulations'))) {
      return 'secondary-legislation';
    }
  }

  // Primary legislation — check URL patterns for UK Acts
  if (source === 'legislation') {
    // UK Public General Acts, Local Acts, Scottish Acts, Welsh Acts
    if (url.includes('/ukpga/') || url.includes('/ukla/') || url.includes('/asp/') || url.includes('/anaw/') || url.includes('/asc/')) {
      return 'primary-legislation';
    }
    // Title is exactly "Something Act YYYY" (not "The Something Act YYYY (Amendment) Order")
    if (/^[a-z\s]+act\s+\d{4}$/.test(title)) {
      return 'primary-legislation';
    }
  }

  // Case law
  if (source === 'caselaw' || source === 'supreme-court' || source === 'bailii' || source === 'hudoc') {
    return 'case-law';
  }

  // Guidance
  if (source === 'guidance' || source === 'judiciary' || source === 'regulators') {
    if (type.includes('guidance') || type.includes('code') || title.includes('guidance') || title.includes('code of practice')) {
      return 'guidance';
    }
    return 'guidance'; // Default guidance sources to guidance category
  }

  // Forms and procedures (court rules)
  if (source === 'rules') {
    return 'forms-procedures';
  }
  if (title.includes('form') || title.includes('procedure') || type.includes('procedure')) {
    return 'forms-procedures';
  }

  // Policy and decisions
  if (source === 'sos-decisions' || source === 'ombudsman' || source === 'parliament') {
    return 'policy-decisions';
  }

  // Default to secondary for everything else
  return 'secondary-legislation';
}

function expandQuery(rawQuery) {
  const original = rawQuery;
  const lower = rawQuery.toLowerCase().trim();

  // Detect section/schedule/article/rule/regulation/part references
  let section = null;
  let remaining = lower;

  const sectionPatterns = [
    { re: /\bs\.?\s*(\d+(?:\(\d+\))*)/, prefix: 'section' },
    { re: /\bsection\s+(\d+(?:\(\d+\))*)/, prefix: 'section' },
    { re: /\bsch\.?\s*(\d+)/, prefix: 'Schedule' },
    { re: /\bschedule\s+(\d+)/, prefix: 'Schedule' },
    { re: /\bart\.?\s*(\d+)/, prefix: 'Article' },
    { re: /\barticle\s+(\d+)/, prefix: 'Article' },
    { re: /\br\.?\s*(\d+)/, prefix: 'rule' },
    { re: /\brule\s+(\d+)/, prefix: 'rule' },
    { re: /\breg\.?\s*(\d+)/, prefix: 'regulation' },
    { re: /\bregulation\s+(\d+)/, prefix: 'regulation' },
    { re: /\bpt\.?\s*(\d+)/, prefix: 'Part' },
    { re: /\bpart\s+(\d+)/i, prefix: 'Part' },
  ];

  for (const { re, prefix } of sectionPatterns) {
    const m = remaining.match(re);
    if (m) {
      section = `${prefix} ${m[1]}`;
      remaining = remaining.replace(m[0], ' ').trim();
      break;
    }
  }

  // Clean up extra whitespace from removal
  remaining = remaining.replace(/\s+/g, ' ').trim();

  // Look up abbreviation — try full remaining text first (includes year), then without trailing year
  let actTitle = null;
  if (LEGAL_ABBREVIATIONS[remaining]) {
    actTitle = LEGAL_ABBREVIATIONS[remaining];
  } else {
    // Try stripping a trailing year
    const withoutYear = remaining.replace(/\s+\d{4}$/, '').trim();
    if (withoutYear !== remaining && LEGAL_ABBREVIATIONS[withoutYear]) {
      actTitle = LEGAL_ABBREVIATIONS[withoutYear];
    }
  }

  // Build the primary expanded query
  // Quote the act title for exact phrase matching in external APIs
  let primary;
  if (actTitle) {
    const quotedAct = `"${actTitle}"`;
    primary = section ? `${section} ${quotedAct}` : quotedAct;
  } else {
    // No abbreviation found — reconstruct from original with expanded section prefix
    primary = section ? `${section} ${remaining}` : remaining || original;
    // If remaining is empty but we have section + original, use original
    if (!remaining && section) {
      primary = `${section} ${original.replace(/\bs\.?\s*\d+(?:\(\d+\))*/, '').trim()}`;
    }
  }

  // Capitalize the first letter for cleaner API queries, but only if we expanded something
  if (actTitle || section) {
    primary = primary.charAt(0).toUpperCase() + primary.slice(1);
  }

  return { primary, section, actTitle, original };
}

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

  const expanded = expandQuery(query.trim());
  const fetchers = getFetchers(source, expanded);
  const settled = await Promise.allSettled(fetchers.map(fn => fn()));

  let results = [];
  let idCounter = 1;
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled' && Array.isArray(outcome.value)) {
      for (const item of outcome.value) {
        const category = categorizeResult(item);
        results.push({ ...item, id: idCounter++, category });
      }
    }
  }

  // Get related searches based on the original query
  const relatedSearches = getRelatedSearches(expanded.original) || getRelatedSearches(expanded.actTitle || '');

  // Return structured response with results and metadata
  return jsonResponse({
    results,
    relatedSearches,
    query: {
      original: expanded.original,
      expanded: expanded.primary,
      actTitle: expanded.actTitle,
      section: expanded.section,
    },
  });
}

function getFetchers(source, expanded) {
  const q = expanded.primary;
  const map = {
    legislation: [() => fetchLegislation(q)],
    caselaw: [() => fetchCaseLaw(q)],
    'supreme-court': [() => fetchSupremeCourt(q)],
    rules: [() => fetchRules(q)],
    guidance: [() => fetchGuidance(q)],
    parliament: [() => fetchParliamentBills(q)],
    judiciary: [() => fetchJudiciary(q)],
    'law-commission': [() => fetchLawCommission(q)],
    bailii: [() => fetchBailii(q)],
    eurlex: [() => fetchEurLex(q)],
    hudoc: [() => fetchHudoc(q)],
    'sos-decisions': [() => fetchSoSDecisions(q)],
    ombudsman: [() => fetchOmbudsman(q)],
    regulators: [() => fetchCqc(q)],
  };

  // For legislation, also search by act title alone to get the parent Act
  if (expanded.actTitle && expanded.section) {
    map.legislation.push(() => fetchLegislation(`"${expanded.actTitle}"`));
  }

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
      snippet: truncate(summary, 800),
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
        snippet: truncate(summary, 800),
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
      snippet: truncate(summary, 800),
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
      snippet: truncate(summary, 800),
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

function truncate(str, max = 800) {
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
      snippet: truncate(desc, 800),
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
