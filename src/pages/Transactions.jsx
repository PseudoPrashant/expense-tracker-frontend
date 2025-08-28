import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Misc', 'Income']

export default function Transactions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [search, setSearch] = useState('')

  const query = useMemo(() => {
    const q = new URLSearchParams()
    if (type) q.set('type', type)
    if (category) q.set('category', category)
    if (startDate) q.set('startDate', startDate)
    if (endDate) q.set('endDate', endDate)
    if (search) q.set('search', search)
    return q.toString()
  }, [type, category, startDate, endDate, search])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await api.get(`/transactions${query ? `?${query}` : ''}`)
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [query])

  const onDelete = async (id) => {
    await api.delete(`/transactions/${id}`)
    fetchItems()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <select className="border rounded px-2 py-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="border rounded px-2 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input type="date" className="border rounded px-2 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="border rounded px-2 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={fetchItems} className="bg-blue-600 text-white rounded px-3 py-2">Apply</button>
        </div>
      </div>

      <TransactionForm onCreated={fetchItems} />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Description</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={6}>No transactions</td></tr>
            ) : (
              items.map((tx) => (
                <tr key={tx._id} className="border-b last:border-0">
                  <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{tx.type}</td>
                  <td className="p-3">{tx.category}</td>
                  <td className="p-3">₹ {Number(tx.amount).toFixed(2)}</td>
                  <td className="p-3">{tx.description}</td>
                  <td className="p-3">
                    <button onClick={() => onDelete(tx._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransactionForm({ onCreated }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/transactions', { type, amount: Number(amount), category, date, description })
      setAmount('')
      setDescription('')
      onCreated?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Add Transaction</h3>
      <form className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end" onSubmit={onSubmit}>
        <select className="border rounded px-2 py-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input className="border rounded px-2 py-2" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select className="border rounded px-2 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input className="border rounded px-2 py-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="border rounded px-2 py-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button disabled={loading} className="bg-green-600 text-white rounded px-3 py-2">{loading ? 'Saving...' : 'Add'}</button>
      </form>
    </div>
  )
}


