import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ExternalLink, ChevronDown, ChevronRight, BookOpen, Scale, Gavel, FileText, Landmark, Clock, ArrowLeft, AlertCircle, Building2, ScrollText, Library, Globe, Shield, Briefcase, Users, Lightbulb, Download, Copy, Check } from 'lucide-react'
import './SearchResultsPage.css'

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources', icon: Search },
  { id: 'legislation', label: 'Legislation', icon: BookOpen },
  { id: 'caselaw', label: 'Case Law', icon: Scale },
  { id: 'supreme-court', label: 'Supreme Court', icon: Landmark },
  { id: 'bailii', label: 'BAILII', icon: Scale },
  { id: 'rules', label: 'Court Rules', icon: Gavel },
  { id: 'guidance', label: 'Guidance', icon: FileText },
  { id: 'parliament', label: 'Parliament', icon: Building2 },
  { id: 'judiciary', label: 'Judiciary', icon: ScrollText },
  { id: 'law-commission', label: 'Law Commission', icon: Library },
  { id: 'eurlex', label: 'EU Law', icon: Globe },
  { id: 'hudoc', label: 'ECHR', icon: Globe },
  { id: 'sos-decisions', label: 'Gov Decisions', icon: Briefcase },
  { id: 'ombudsman', label: 'Ombudsman', icon: Users },
  { id: 'regulators', label: 'Regulators', icon: Shield },
]

const RESULT_CATEGORIES = [
  { id: 'primary-legislation', label: 'Start Here', sublabel: 'Primary Legislation', icon: BookOpen, color: 'green' },
  { id: 'case-law', label: 'Key Cases', sublabel: 'Court Judgments', icon: Scale, color: 'blue' },
  { id: 'guidance', label: 'Official Guidance', sublabel: 'Codes & Guidance', icon: FileText, color: 'purple' },
  { id: 'forms-procedures', label: 'Forms & Procedures', sublabel: 'Court Rules', icon: Gavel, color: 'orange' },
  { id: 'secondary-legislation', label: 'Secondary Legislation', sublabel: 'SIs & Regulations', icon: ScrollText, color: 'gray' },
  { id: 'policy-decisions', label: 'Policy & Decisions', sublabel: 'Government', icon: Building2, color: 'slate' },
]

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeSource, setActiveSource] = useState(searchParams.get('source') || 'all')
  const [results, setResults] = useState([])
  const [relatedSearches, setRelatedSearches] = useState([])
  const [expandedQuery, setExpandedQuery] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [copied, setCopied] = useState(false)

  const performSearch = useCallback(async (searchQuery, source) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&source=${encodeURIComponent(source)}`)
      if (!resp.ok) throw new Error(`Search failed (${resp.status})`)
      const data = await resp.json()
      // Handle new structured response
      if (data.results) {
        setResults(data.results)
        setRelatedSearches(data.relatedSearches || [])
        setExpandedQuery(data.query || null)
      } else if (Array.isArray(data)) {
        // Fallback for old API format
        setResults(data)
        setRelatedSearches([])
        setExpandedQuery(null)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setResults([])
      setRelatedSearches([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    const s = searchParams.get('source') || 'all'
    if (q) {
      setQuery(q)
      setActiveSource(s)
      performSearch(q, s)
    }
  }, [searchParams, performSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query, source: activeSource })
    }
  }

  const handleRelatedSearch = (term) => {
    setQuery(term)
    setSearchParams({ q: term, source: activeSource })
  }

  const toggleCategory = (categoryId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const filteredResults = activeSource === 'all'
    ? results
    : results.filter(r => r.source === activeSource)

  // Group results by category
  const groupedResults = RESULT_CATEGORIES.map(category => ({
    ...category,
    results: filteredResults.filter(r => r.category === category.id)
  })).filter(group => group.results.length > 0)

  // Export functions
  const exportCSV = () => {
    const headers = ['Title', 'Source', 'Type', 'Date', 'URL']
    const rows = filteredResults.map(r => [
      `"${(r.title || '').replace(/"/g, '""')}"`,
      r.sourceLabel,
      r.type,
      r.date,
      r.url
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `freelex-search-${searchParams.get('q')?.replace(/\s+/g, '-') || 'results'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyAllLinks = async () => {
    const links = filteredResults.map(r => r.url).join('\n')
    await navigator.clipboard.writeText(links)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="search-results-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-header-container container">
          <form className="results-search-form" onSubmit={handleSearch}>
            <div className="results-search-input-wrapper">
              <Search className="results-search-icon" size={18} />
              <input
                type="text"
                className="results-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search UK law..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Related Searches */}
          {relatedSearches.length > 0 && (
            <div className="related-searches">
              <Lightbulb size={14} />
              <span className="related-label">Related:</span>
              {relatedSearches.slice(0, 6).map((term, i) => (
                <button
                  key={i}
                  className="related-search-chip"
                  onClick={() => handleRelatedSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          <div className="results-source-filters">
            {SOURCE_FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`results-source-filter ${activeSource === id ? 'results-source-filter--active' : ''}`}
                onClick={() => {
                  setActiveSource(id)
                  if (searchParams.get('q')) {
                    setSearchParams({ q: searchParams.get('q'), source: id })
                  }
                }}
              >
                <Icon size={14} />
                {label}
                {id !== 'all' && (
                  <span className="filter-count">
                    {results.filter(r => r.source === id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-body container">
        {loading ? (
          <div className="results-loading">
            <div className="loading-spinner" />
            <p>Searching official UK sources...</p>
          </div>
        ) : error ? (
          <div className="results-empty">
            <AlertCircle size={48} />
            <h3>Search error</h3>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={() => performSearch(query, activeSource)}>
              Try again
            </button>
          </div>
        ) : filteredResults.length > 0 ? (
          <>
            <div className="results-meta">
              <div className="results-meta-left">
                <p>{filteredResults.length} results for "<strong>{searchParams.get('q')}</strong>"</p>
                {expandedQuery?.expanded && expandedQuery.expanded !== expandedQuery.original && (
                  <p className="results-expanded-query">
                    Searching: {expandedQuery.expanded}
                  </p>
                )}
              </div>
              <div className="results-actions">
                <button className="btn btn-sm btn-ghost" onClick={copyAllLinks} title="Copy all links">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Links'}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={exportCSV} title="Download as CSV">
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Grouped Results */}
            <div className="results-grouped">
              {groupedResults.map((group) => (
                <section key={group.id} className={`result-group result-group--${group.color}`}>
                  <button
                    className="result-group-header"
                    onClick={() => toggleCategory(group.id)}
                    aria-expanded={!collapsedCategories[group.id]}
                  >
                    <div className="result-group-title">
                      <group.icon size={18} />
                      <div>
                        <h2>{group.label}</h2>
                        <span className="result-group-sublabel">{group.sublabel}</span>
                      </div>
                    </div>
                    <div className="result-group-meta">
                      <span className="result-group-count">{group.results.length}</span>
                      {collapsedCategories[group.id] ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {!collapsedCategories[group.id] && (
                    <div className="result-group-items">
                      {group.results.map((result) => (
                        <article key={result.id} className="result-card">
                          <div className="result-card-header">
                            <span className={`source-badge ${result.source}`}>
                              {result.sourceLabel}
                            </span>
                            <span className="result-type">{result.type}</span>
                            {result.date && <span className="result-date">{result.date}</span>}
                          </div>

                          <h3 className="result-title">
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              {result.title}
                              <ExternalLink size={14} />
                            </a>
                          </h3>

                          {result.snippet && <p className="result-snippet">{result.snippet}</p>}

                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-url">
                            {result.url}
                          </a>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <p className="results-note">
              <Clock size={14} /> Results from official UK government sources only
            </p>
          </>
        ) : searchParams.get('q') ? (
          <div className="results-empty">
            <Scale size={48} />
            <h3>No results found</h3>
            <p>Try different keywords or broaden your search.</p>
            {relatedSearches.length > 0 && (
              <div className="empty-related">
                <p>Try searching for:</p>
                <div className="related-chips">
                  {relatedSearches.slice(0, 4).map((term, i) => (
                    <button key={i} className="related-search-chip" onClick={() => handleRelatedSearch(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Link to="/" className="btn btn-outline">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        ) : (
          <div className="results-empty">
            <Search size={48} />
            <h3>Enter a search query</h3>
            <p>Search for legislation, case law, court rules, or practice directions.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default SearchResultsPage
