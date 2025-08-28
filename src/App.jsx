import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Expense Tracker</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/transactions" className="hover:underline">Transactions</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-gray-600">Charts and summaries will appear here.</p>
    </div>
  )
}

function Transactions() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transactions</h2>
      <p className="text-gray-600">List, filter, and manage your transactions.</p>
    </div>
  )
}

function Login() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" />
        <button className="w-full bg-blue-600 text-white rounded px-3 py-2">Login</button>
      </form>
    </div>
  )
}

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
