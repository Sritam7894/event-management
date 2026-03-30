import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center mt-20">Loading...</div>
  if (!user || user.role !== 'admin') return <Navigate to="/" />

  return children
}

export default AdminRoute