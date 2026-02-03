import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Scale, UserPlus, Mail, Lock, User, Star, Download, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './AuthPages.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      setMessage('Account created! Please check your email to verify your account.')
      setTimeout(() => {
        navigate('/search')
      }, 2000)
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      if (errorMessage.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.')
      } else if (errorMessage.includes('auth/weak-password')) {
        setError('Password is too weak. Please use a stronger password.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container auth-container--wide">
        <div className="auth-split">
          <div className="auth-benefits">
            <h2>Why Create an Account?</h2>
            <ul className="benefits-list">
              <li>
                <Star size={20} />
                <div>
                  <strong>Save Searches</strong>
                  <span>Keep your research organised and revisit anytime</span>
                </div>
              </li>
              <li>
                <Download size={20} />
                <div>
                  <strong>Export Results</strong>
                  <span>Download search results as CSV for your records</span>
                </div>
              </li>
              <li>
                <Search size={20} />
                <div>
                  <strong>Search History</strong>
                  <span>Track your research across sessions</span>
                </div>
              </li>
            </ul>
            <p className="benefits-note">Free forever. No credit card required.</p>
          </div>

          <div className="auth-form-section">
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <Scale size={32} />
                <span>Free<span className="auth-logo-accent">Lex</span></span>
              </Link>
              <h1>Create Your Account</h1>
              <p>Join thousands of legal professionals using FreeLex</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {message && (
                <div className="auth-success">
                  <CheckCircle size={18} />
                  {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 characters)"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <Loader className="spinner" size={18} /> : (
                  <>
                    <UserPlus size={18} />
                    Create Free Account
                  </>
                )}
              </button>

              <p className="auth-terms">
                By creating an account, you agree to our terms of service and privacy policy.
              </p>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>

            <div className="auth-note">
              <p>One account for all CoSO tools: FreeLex, Court Bundle Builder, Unbundle Docs</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
