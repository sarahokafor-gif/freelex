import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Scale, LogIn, Mail, Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './AuthPages.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  const { login, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      navigate('/search')
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      if (errorMessage.includes('auth/user-not-found')) {
        setError('No account found with this email. Please register first.')
      } else if (errorMessage.includes('auth/wrong-password') || errorMessage.includes('auth/invalid-credential')) {
        setError('Incorrect password. Please try again.')
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.')
      } else if (errorMessage.includes('auth/too-many-requests')) {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      await resetPassword(email)
      setMessage('Password reset email sent! Check your inbox.')
      setShowResetPassword(false)
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      if (errorMessage.includes('auth/user-not-found')) {
        setError('No account found with this email.')
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showResetPassword) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <Scale size={32} />
              <span>Free<span className="auth-logo-accent">Lex</span></span>
            </Link>
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          <form className="auth-form" onSubmit={handleResetPassword}>
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

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <Loader className="spinner" size={18} /> : 'Send Reset Link'}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => setShowResetPassword(false)}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Scale size={32} />
            <span>Free<span className="auth-logo-accent">Lex</span></span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to access your saved searches and bookmarks</p>
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
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <Loader className="spinner" size={18} /> : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowResetPassword(true)}
            disabled={loading}
          >
            Forgot your password?
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register free</Link></p>
        </div>

        <div className="auth-note">
          <p>One account for all CoSO tools: FreeLex, Court Bundle Builder, Unbundle Docs</p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
