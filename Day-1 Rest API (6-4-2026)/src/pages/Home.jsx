import { useEffect, useState } from 'react'
import api from '../api/axiosClient'
import useAuth from '../context/useAuth'

const Home = () => {
  const { logout } = useAuth()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const { data } = await api.get('/protected')
        setMessage(data.message)
      } catch {
        setMessage('Failed to load protected content')
      } finally {
        setLoading(false)
      }
    }

    fetchProtected()
  }, [])

  return (
    <div className="ui-page flex flex-col">
      <header className="ui-topbar">
        <div className="ui-topbar-inner">
          <span className="ui-brand">
            AuthApp
          </span>
          <button
            onClick={logout}
            className="ui-btn-outline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="ui-card max-w-xl text-center">
          <h1 className="mb-3 text-2xl font-semibold text-slate-900">
            Protected Home
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            This page is only visible to authenticated users.
          </p>
          {loading ? (
            <div className="ui-pill">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              Loading secure content...
            </div>
          ) : (
            <p className="ui-alert-success">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
