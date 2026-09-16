import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  
  if (!user) {
    return (
      <nav className="flex gap-4 text-sm">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/signup" className="hover:underline">Sign up</Link>
      </nav>
    )
  }
  
  return (
    <nav className="flex gap-4 text-sm items-center">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/transactions" className="hover:underline">Transactions</Link>
      <button onClick={logout} className="text-red-600">Logout</button>
    </nav>
  )
}
