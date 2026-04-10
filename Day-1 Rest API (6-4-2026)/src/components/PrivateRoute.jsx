import { Navigate } from 'react-router-dom'
import useAuth from '../context/useAuth'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="ui-center">
        <div className="ui-pill">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Checking session...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default PrivateRoute
