import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ExternalLink, ChevronRight, Filter, BookOpen, Scale, Gavel, FileText, Landmark, Clock, ArrowLeft, AlertCircle } from 'lucide-react'
import './SearchResultsPage.css'

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources', icon: Search },
  { id: 'legislation', label: 'Legislation', icon: BookOpen },
  { id: 'caselaw', label: 'Case Law', icon: Scale },
  { id: 'rules', label: 'Court Rules', icon: Gavel },
  { id: 'guidance', label: 'Practice Directions', icon: FileText },
  { id: 'supreme-court', label: 'Supreme Court', icon: Landmark },
]

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeSource, setActiveSource] = useState(searchParams.get('source') || 'all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const performSearch = useCallback(async (searchQuery, source) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&source=${encodeURIComponent(source)}`)
      if (!resp.ok) throw new Error(`Search failed (${resp.status})`)
      const data = await resp.json()
      setResults(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setResults([])
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

  const filteredResults = activeSource === 'all'
    ? results
    : results.filter(r => r.source === activeSource)

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
              <p>{filteredResults.length} results for "<strong>{searchParams.get('q')}</strong>"</p>
              <p className="results-note">
                <Clock size={14} /> Results from official UK government sources only
              </p>
            </div>

            <div className="results-list">
              {filteredResults.map((result) => (
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

                  <p className="result-snippet">{result.snippet}</p>

                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-url">
                    {result.url}
                  </a>
                </article>
              ))}
            </div>
          </>
        ) : searchParams.get('q') ? (
          <div className="results-empty">
            <Scale size={48} />
            <h3>No results found</h3>
            <p>Try different keywords or broaden your search.</p>
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
