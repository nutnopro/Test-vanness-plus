import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (err) {
      toast.error('Logout failed')
      console.error(err)
    } finally {
      setLoggingOut(false)
    }
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? 'bg-indigo-700 text-white shadow'
          : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <span
              onClick={() => navigate('/dashboard')}
              className="text-white font-bold text-xl cursor-pointer select-none hover:opacity-90 transition"
            >
              ✅ TodoApp
            </span>

            {user && (
              <div className="ml-6 flex gap-2">
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/tasks', 'Tasks')}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          {user && (
            <div className="flex items-center gap-4">

              {/* Email */}
              <div className="hidden sm:block text-indigo-200 text-sm truncate max-w-[220px]">
                {user.email}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-indigo-800 hover:bg-indigo-900 text-white text-sm px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  )
}
