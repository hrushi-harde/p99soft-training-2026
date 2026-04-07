import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SignIn = () => {
  const { login, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)

    if (!email || !password) return
    await login(email, password)
  }

  const emailValid = !touched || /.+@.+\..+/.test(email)
  const passwordValid = !touched || password.length >= 8

  return (
    <div className="ui-center">
      <div className="ui-card max-w-md">
        <h1 className="ui-title">
          Welcome back
        </h1>
        <p className="ui-subtitle">
          Sign in to access your dashboard
        </p>

        {error && (
          <div className="ui-alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="ui-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ui-input"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {!emailValid && (
              <p className="mt-1 text-xs text-red-400">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <div>
            <label className="ui-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ui-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {!passwordValid && (
              <p className="mt-1 text-xs text-red-400">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password || !emailValid || !passwordValid}
            className="ui-btn-primary"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="ui-footnote">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="ui-link"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
