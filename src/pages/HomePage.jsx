import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ChevronRight, BookOpen, Scale, Gavel, FileText, Shield, Landmark, Lightbulb, Brain, Home, Briefcase, Heart, Users, Download, Star, UserPlus } from 'lucide-react'
import './HomePage.css'

const SEARCH_TEMPLATES = [
  {
    id: 'mental-health',
    icon: Brain,
    title: 'Mental Health Detention',
    description: 'MHA sections, tribunal, nearest relative',
    query: 'Mental Health Act 1983',
    source: 'all',
    color: 'purple',
  },
  {
    id: 'mental-capacity',
    icon: Lightbulb,
    title: 'Mental Capacity',
    description: 'Best interests, DoLS, Court of Protection',
    query: 'Mental Capacity Act 2005',
    source: 'all',
    color: 'blue',
  },
  {
    id: 'child-protection',
    icon: Users,
    title: 'Child Protection',
    description: 'Care orders, s47, parental responsibility',
    query: 'Children Act 1989',
    source: 'all',
    color: 'green',
  },
  {
    id: 'care-planning',
    icon: Heart,
    title: 'Adult Social Care',
    description: 'Needs assessment, eligibility, safeguarding',
    query: 'Care Act 2014',
    source: 'all',
    color: 'pink',
  },
  {
    id: 'housing',
    icon: Home,
    title: 'Housing & Homelessness',
    description: 'Disrepair, possession, allocations',
    query: 'Housing Act 1996',
    source: 'all',
    color: 'orange',
  },
  {
    id: 'employment',
    icon: Briefcase,
    title: 'Employment Rights',
    description: 'Unfair dismissal, redundancy, whistleblowing',
    query: 'Employment Rights Act 1996',
    source: 'all',
    color: 'slate',
  },
]

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources', icon: Search },
  { id: 'legislation', label: 'Legislation', icon: BookOpen },
  { id: 'caselaw', label: 'Case Law', icon: Scale },
  { id: 'rules', label: 'Court Rules', icon: Gavel },
  { id: 'guidance', label: 'Practice Directions', icon: FileText },
  { id: 'supreme-court', label: 'Supreme Court', icon: Landmark },
]

function HomePage() {
  const [query, setQuery] = useState('')
  const [activeSource, setActiveSource] = useState('all')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&source=${activeSource}`)
    }
  }

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-container container">
          <div className="hero-badge">
            <Shield size={14} />
            Official UK Government Sources Only
          </div>

          <h1 className="hero-title">
            UK Law.<br />
            <span className="hero-title-accent">Free. Forever.</span>
          </h1>

          <p className="hero-subtitle">
            Search legislation, case law, court rules, and practice directions — all from official sources, all in one place. No subscription required.
          </p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder='Try "Mental Capacity Act 2005" or "best interests" or "section 21A"...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit">
                Search
                <ChevronRight size={16} />
              </button>
            </div>
          </form>

          {/* Source Filters */}
          <div className="source-filters">
            {SOURCE_FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`source-filter ${activeSource === id ? 'source-filter--active' : ''}`}
                onClick={() => setActiveSource(id)}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Search Templates */}
          <div className="search-templates">
            <p className="templates-label">
              <Lightbulb size={14} />
              Quick searches:
            </p>
            <div className="templates-grid">
              {SEARCH_TEMPLATES.map(({ id, icon: Icon, title, description, query, source, color }) => (
                <button
                  key={id}
                  className={`template-card template-card--${color}`}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&source=${source}`)}
                >
                  <Icon size={20} />
                  <div className="template-content">
                    <span className="template-title">{title}</span>
                    <span className="template-description">{description}</span>
                  </div>
                  <ChevronRight size={16} className="template-arrow" />
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button className="btn btn-white" onClick={handleSearch}>
              Get Started Free
              <ChevronRight size={18} />
            </button>
            <a href="#sources" className="btn btn-secondary">
              View Sources
            </a>
          </div>

          {/* Comparison */}
          <div className="cta-comparison">
            <span className="comparison-item comparison-them">
              <span className="comparison-price">£500+/month</span> on LexisNexis
            </span>
            <span className="comparison-vs">vs</span>
            <span className="comparison-item comparison-us">
              <span className="comparison-price">£0</span> on FreeLex
            </span>
          </div>

          {/* Feature Pills */}
          <div className="hero-features">
            <div className="hero-feature">
              <UserPlus size={16} />
              <span>Free Account</span>
            </div>
            <div className="hero-feature">
              <Star size={16} />
              <span>Save Searches</span>
            </div>
            <div className="hero-feature">
              <Download size={16} />
              <span>Export Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Register CTA Banner */}
      <section className="register-banner">
        <div className="container register-banner-content">
          <div className="register-banner-text">
            <h3>Create Your Free Account</h3>
            <p>Save searches, bookmark results, and export your research. One account works across all CoSO legal tools.</p>
          </div>
          <div className="register-banner-actions">
            <Link to="/register" className="btn btn-primary">
              Register Free
              <ChevronRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Sources Section */}
      <section className="sources-section" id="sources">
        <div className="container">
          <h2 className="section-title">Official Sources. Nothing Else.</h2>
          <p className="section-subtitle">
            Every result comes directly from UK government and judicial sources. No blogs, no summaries, no paywalls.
          </p>

          <div className="sources-grid">
            <div className="source-card">
              <div className="source-card-icon legislation">
                <BookOpen size={24} />
              </div>
              <h3>legislation.gov.uk</h3>
              <p>All UK primary and secondary legislation — Acts of Parliament, Statutory Instruments, and more.</p>
              <span className="source-badge legislation">Legislation</span>
            </div>

            <div className="source-card">
              <div className="source-card-icon caselaw">
                <Scale size={24} />
              </div>
              <h3>National Archives Case Law</h3>
              <p>Court judgments from the High Court, Court of Appeal, and other courts via the National Archives.</p>
              <span className="source-badge caselaw">Case Law</span>
            </div>

            <div className="source-card">
              <div className="source-card-icon caselaw">
                <Scale size={24} />
              </div>
              <h3>BAILII</h3>
              <p>The British and Irish Legal Information Institute — comprehensive database of freely available case law.</p>
              <span className="source-badge caselaw">Case Law</span>
            </div>

            <div className="source-card">
              <div className="source-card-icon supreme-court">
                <Landmark size={24} />
              </div>
              <h3>Supreme Court</h3>
              <p>Decided cases and press summaries from the UK Supreme Court.</p>
              <span className="source-badge supreme-court">Supreme Court</span>
            </div>

            <div className="source-card">
              <div className="source-card-icon rules">
                <Gavel size={24} />
              </div>
              <h3>Court Rules</h3>
              <p>Civil Procedure Rules, Family Procedure Rules, Court of Protection Rules, and Practice Directions.</p>
              <span className="source-badge rules">Rules</span>
            </div>

            <div className="source-card">
              <div className="source-card-icon guidance">
                <FileText size={24} />
              </div>
              <h3>Practice Directions</h3>
              <p>Official guidance on court procedures, forms, and requirements from the judiciary.</p>
              <span className="source-badge guidance">Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-content">
            <h2>Built by a Barrister.<br />For Everyone.</h2>
            <p>
              FreeLex was created because access to the law shouldn't cost hundreds of pounds a month. Every person has the right to know the law that governs their life.
            </p>
            <p>
              This tool searches only official UK government and judicial sources — legislation.gov.uk, the National Archives, BAILII, the Supreme Court, and official court rules. No secondary commentary. No paywalled databases. Just the law, straight from the source.
            </p>
            <p className="about-coso">
              A <strong>Chambers of Sarah Okafor</strong> project.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
