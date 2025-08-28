import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  )
}


