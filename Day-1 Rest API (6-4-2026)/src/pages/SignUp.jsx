import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../context/useAuth'

const SignUp = () => {
  const { signup, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)

    if (!email || !password || !passwordValid || !matchValid) return
    await signup(email, password)
  }

  const emailValid = !touched || /.+@.+\..+/.test(email)
  const passwordValid = !touched || password.length >= 8
  const matchValid = !touched || password === confirm

  return (
    <div className="ui-center">
      <div className="ui-card max-w-md">
        <h1 className="ui-title">
          Create your account
        </h1>
        <p className="ui-subtitle">
          Sign up to get started
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
              autoComplete="new-password"
            />
            {!passwordValid && (
              <p className="mt-1 text-xs text-red-400">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <div>
            <label className="ui-label">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="ui-input"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {!matchValid && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !email ||
              !password ||
              !confirm ||
              !emailValid ||
              !passwordValid ||
              !matchValid
            }
            className="ui-btn-primary"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                Creating account...
              </span>
            ) : (
              'Sign up'
            )}
          </button>
        </form>

        <p className="ui-footnote">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="ui-link"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
