import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-3">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
    </div>
  )
}


