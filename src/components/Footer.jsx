import { Scale, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Scale size={20} />
              <span className="footer-logo-text">
                Free<span className="footer-logo-accent">Lex</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Free access to UK law. Search legislation, case law, court rules, and guidance — all from official government sources.
            </p>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Sarah Okafor. All rights reserved.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Sources</h4>
            <a href="https://www.legislation.gov.uk" target="_blank" rel="noopener noreferrer" className="footer-link">
              legislation.gov.uk <ExternalLink size={12} />
            </a>
            <a href="https://caselaw.nationalarchives.gov.uk" target="_blank" rel="noopener noreferrer" className="footer-link">
              National Archives Case Law <ExternalLink size={12} />
            </a>
            <a href="https://www.bailii.org" target="_blank" rel="noopener noreferrer" className="footer-link">
              BAILII <ExternalLink size={12} />
            </a>
            <a href="https://www.supremecourt.uk" target="_blank" rel="noopener noreferrer" className="footer-link">
              Supreme Court <ExternalLink size={12} />
            </a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">CoSO Apps</h4>
            <a href="https://www.courtbundlebuilder.co.uk" target="_blank" rel="noopener noreferrer" className="footer-link">
              Court Bundle Builder <ExternalLink size={12} />
            </a>
            <a href="https://www.unbundledocs.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              Unbundle Docs <ExternalLink size={12} />
            </a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <Link to="/" className="footer-link">Privacy Policy</Link>
            <Link to="/" className="footer-link">Terms of Use</Link>
            <Link to="/" className="footer-link">Disclaimer</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            FreeLex searches official UK government sources only. It does not provide legal advice.
            Always verify information with the original source.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
