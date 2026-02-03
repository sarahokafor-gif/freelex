import { Link } from 'react-router-dom'
import { Search, BookOpen, Scale, Gavel, FileText, ChevronRight, Lightbulb, Download, Star, ExternalLink, HelpCircle, Zap } from 'lucide-react'
import './HelpPage.css'

const SEARCH_TIPS = [
  {
    title: 'Use abbreviations',
    examples: ['MCA 2005', 'MHA 1983', 'CA 1989', 'CPR', 'PACE'],
    description: 'FreeLex understands common legal abbreviations and expands them automatically.',
  },
  {
    title: 'Search sections',
    examples: ['s3 MHA', 's117 MCA', 'sch1 CA 1989'],
    description: 'Use "s" for section, "sch" for schedule, "art" for article, "r" for rule.',
  },
  {
    title: 'Use full names',
    examples: ['Mental Capacity Act', 'unfair dismissal', 'care order'],
    description: 'Plain English searches work well across all sources.',
  },
  {
    title: 'Try related terms',
    examples: ['best interests', 'DoLS', 'nearest relative'],
    description: 'FreeLex suggests related searches to help you find relevant materials.',
  },
]

const SOURCE_INFO = [
  {
    icon: BookOpen,
    name: 'Legislation',
    source: 'legislation.gov.uk',
    description: 'All UK Acts of Parliament, Statutory Instruments, and secondary legislation. The authoritative source for UK statute law.',
    color: 'blue',
  },
  {
    icon: Scale,
    name: 'Case Law',
    source: 'National Archives & BAILII',
    description: 'Court judgments from High Court, Court of Appeal, tribunals, and other courts. Essential for understanding how law is interpreted.',
    color: 'pink',
  },
  {
    icon: Gavel,
    name: 'Court Rules',
    source: 'legislation.gov.uk (SIs)',
    description: 'Civil Procedure Rules (CPR), Family Procedure Rules (FPR), Court of Protection Rules (CoPR), and Criminal Procedure Rules.',
    color: 'yellow',
  },
  {
    icon: FileText,
    name: 'Guidance',
    source: 'GOV.UK & Judiciary',
    description: 'Official guidance documents, codes of practice, and practice directions from government departments and the judiciary.',
    color: 'green',
  },
]

const COSO_TOOLS = [
  {
    name: 'Court Bundle Builder',
    description: 'Create professional court bundles with automatic pagination, indexing, and formatting.',
    url: 'https://courtbundle.pages.dev',
    status: 'Live',
  },
  {
    name: 'Unbundle Docs',
    description: 'Extract pages, split PDFs, and reorganise legal documents quickly.',
    url: 'https://unbundle.pages.dev',
    status: 'Live',
  },
  {
    name: 'Legal Drafting Assistant',
    description: 'Draft legal documents with intelligent templates and guidance.',
    url: '#',
    status: 'Coming Soon',
  },
]

function HelpPage() {
  return (
    <main className="help-page">
      {/* Header */}
      <div className="help-header">
        <div className="container">
          <h1>How to Use FreeLex</h1>
          <p>Get the most out of your legal research with these tips and guides.</p>
        </div>
      </div>

      <div className="help-body container">
        {/* Search Tips */}
        <section className="help-section">
          <div className="section-header">
            <Search size={24} />
            <div>
              <h2>Search Tips</h2>
              <p>FreeLex understands legal terminology and expands your queries automatically.</p>
            </div>
          </div>

          <div className="tips-grid">
            {SEARCH_TIPS.map((tip, i) => (
              <div key={i} className="tip-card">
                <h3>
                  <Lightbulb size={16} />
                  {tip.title}
                </h3>
                <div className="tip-examples">
                  {tip.examples.map((ex, j) => (
                    <Link key={j} to={`/search?q=${encodeURIComponent(ex)}&source=all`} className="tip-example">
                      {ex}
                    </Link>
                  ))}
                </div>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Understanding Sources */}
        <section className="help-section">
          <div className="section-header">
            <BookOpen size={24} />
            <div>
              <h2>Understanding Results</h2>
              <p>FreeLex searches 14 official UK government and judicial sources.</p>
            </div>
          </div>

          <div className="sources-info-grid">
            {SOURCE_INFO.map((source, i) => (
              <div key={i} className={`source-info-card source-info-card--${source.color}`}>
                <div className="source-info-icon">
                  <source.icon size={24} />
                </div>
                <h3>{source.name}</h3>
                <span className="source-info-origin">{source.source}</span>
                <p>{source.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Result Categories */}
        <section className="help-section">
          <div className="section-header">
            <Zap size={24} />
            <div>
              <h2>Smart Result Grouping</h2>
              <p>Results are automatically organised into categories to help you research efficiently.</p>
            </div>
          </div>

          <div className="categories-list">
            <div className="category-info category-info--green">
              <strong>Start Here</strong>
              <span>Primary legislation — the Acts and statutes themselves. Begin your research here.</span>
            </div>
            <div className="category-info category-info--blue">
              <strong>Key Cases</strong>
              <span>Court judgments interpreting the law. See how legislation has been applied.</span>
            </div>
            <div className="category-info category-info--purple">
              <strong>Official Guidance</strong>
              <span>Codes of practice and official guidance on how the law should be applied.</span>
            </div>
            <div className="category-info category-info--orange">
              <strong>Forms & Procedures</strong>
              <span>Court rules, procedure rules, and forms you'll need for proceedings.</span>
            </div>
          </div>
        </section>

        {/* Export Features */}
        <section className="help-section">
          <div className="section-header">
            <Download size={24} />
            <div>
              <h2>Exporting Results</h2>
              <p>Save and share your research with built-in export tools.</p>
            </div>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <strong>Export CSV</strong>
              <p>Download all search results as a spreadsheet. Includes title, source, type, date, and URL for each result.</p>
            </div>
            <div className="feature-item">
              <strong>Copy Links</strong>
              <p>Copy all result URLs to your clipboard with one click. Paste into documents, emails, or case notes.</p>
            </div>
          </div>
        </section>

        {/* Other CoSO Tools */}
        <section className="help-section">
          <div className="section-header">
            <Star size={24} />
            <div>
              <h2>Other CoSO Tools</h2>
              <p>Free legal tools from the Chambers of Sarah Okafor.</p>
            </div>
          </div>

          <div className="tools-grid">
            {COSO_TOOLS.map((tool, i) => (
              <a
                key={i}
                href={tool.url}
                target={tool.status === 'Live' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`tool-card ${tool.status !== 'Live' ? 'tool-card--disabled' : ''}`}
              >
                <div className="tool-card-header">
                  <h3>{tool.name}</h3>
                  <span className={`tool-status tool-status--${tool.status === 'Live' ? 'live' : 'coming'}`}>
                    {tool.status}
                  </span>
                </div>
                <p>{tool.description}</p>
                {tool.status === 'Live' && (
                  <span className="tool-link">
                    Visit <ExternalLink size={14} />
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Feedback */}
        <section className="help-section help-section--cta">
          <HelpCircle size={32} />
          <h2>Help Us Improve</h2>
          <p>FreeLex is a free tool from the Chambers of Sarah Okafor. Your feedback helps us make it better for everyone.</p>
          <div className="help-cta-buttons">
            <a href="https://forms.gle/freelex-feedback" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Submit Feedback
            </a>
            <Link to="/" className="btn btn-outline">
              <Search size={16} />
              Start Searching
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default HelpPage
