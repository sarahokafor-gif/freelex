import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ExternalLink, ChevronRight, Filter, BookOpen, Scale, Gavel, FileText, Landmark, Clock, ArrowLeft } from 'lucide-react'
import './SearchResultsPage.css'

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources', icon: Search },
  { id: 'legislation', label: 'Legislation', icon: BookOpen },
  { id: 'caselaw', label: 'Case Law', icon: Scale },
  { id: 'rules', label: 'Court Rules', icon: Gavel },
  { id: 'guidance', label: 'Practice Directions', icon: FileText },
  { id: 'supreme-court', label: 'Supreme Court', icon: Landmark },
]

// Mock results for demo
const MOCK_RESULTS = [
  {
    id: 1,
    title: 'Mental Capacity Act 2005',
    source: 'legislation',
    sourceLabel: 'legislation.gov.uk',
    url: 'https://www.legislation.gov.uk/ukpga/2005/9/contents',
    snippet: 'An Act to make new provision relating to persons who lack capacity; to establish a superior court of record called the Court of Protection in place of the office of the Supreme Court called by that name...',
    date: '2005',
    type: 'Act of Parliament'
  },
  {
    id: 2,
    title: 'Aintree University Hospitals NHS Foundation Trust v James [2013] UKSC 67',
    source: 'supreme-court',
    sourceLabel: 'Supreme Court',
    url: 'https://www.supremecourt.uk/cases/uksc-2013-0134.html',
    snippet: 'The best interests test under the Mental Capacity Act 2005 is not confined to considering the medical best interests of the patient. The court must consider the patient\'s welfare in the widest sense...',
    date: '2013',
    type: 'Supreme Court Judgment'
  },
  {
    id: 3,
    title: 'Court of Protection Rules 2017',
    source: 'rules',
    sourceLabel: 'Court Rules',
    url: 'https://www.legislation.gov.uk/uksi/2017/1035/contents',
    snippet: 'Rules of court governing procedure in the Court of Protection, including applications relating to property and affairs, personal welfare, and deprivation of liberty...',
    date: '2017',
    type: 'Statutory Instrument'
  },
  {
    id: 4,
    title: 'Re X (Deprivation of Liberty) [2014] EWCOP 25',
    source: 'caselaw',
    sourceLabel: 'National Archives',
    url: 'https://caselaw.nationalarchives.gov.uk/',
    snippet: 'Establishing the streamlined procedure for authorisation of deprivation of liberty under the Mental Capacity Act 2005, known as the Re X procedure...',
    date: '2014',
    type: 'Court of Protection'
  },
  {
    id: 5,
    title: 'Mental Capacity Act 2005 Code of Practice',
    source: 'guidance',
    sourceLabel: 'Practice Direction',
    url: 'https://www.gov.uk/government/publications/mental-capacity-act-code-of-practice',
    snippet: 'The Code of Practice provides guidance for decisions made under the Mental Capacity Act 2005. It describes the Act\'s provisions and offers practical guidance on how they should work in practice...',
    date: '2007',
    type: 'Code of Practice'
  },
  {
    id: 6,
    title: 'Cheshire West and Chester Council v P [2014] UKSC 19',
    source: 'supreme-court',
    sourceLabel: 'Supreme Court',
    url: 'https://www.supremecourt.uk/cases/uksc-2012-0068.html',
    snippet: 'The acid test for deprivation of liberty: a person is deprived of liberty if they are under continuous supervision and control and are not free to leave, regardless of the purpose or relative normality of the placement...',
    date: '2014',
    type: 'Supreme Court Judgment'
  },
]

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeSource, setActiveSource] = useState(searchParams.get('source') || 'all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = (searchQuery) => {
    setLoading(true)
    // Simulated search delay — will be replaced with real API calls
    setTimeout(() => {
      setResults(MOCK_RESULTS)
      setLoading(false)
    }, 800)
  }

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
                onClick={() => setActiveSource(id)}
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
