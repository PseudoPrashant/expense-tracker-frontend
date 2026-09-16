import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { categories } from '../lib/constants'
import TransactionForm from '../components/transactions/TransactionForm'

export default function Transactions() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [search, setSearch] = useState('')

  const queryStr = useMemo(() => {
    const q = new URLSearchParams()
    if (type) q.set('type', type)
    if (category) q.set('category', category)
    if (startDate) q.set('startDate', startDate)
    if (endDate) q.set('endDate', endDate)
    if (search) q.set('search', search)
    return q.toString()
  }, [type, category, startDate, endDate, search])

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['transactions', queryStr],
    queryFn: async () => {
      const { data } = await api.get(`/transactions${queryStr ? `?${queryStr}` : ''}`)
      return data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
    }
  })

  const exportCSV = async () => {
    try {
      const response = await api.get('/transactions/export/csv', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transactions.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export CSV')
    }
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
          <button className="bg-blue-600 text-white rounded px-3 py-2 opacity-50 cursor-not-allowed">Auto-applied</button>
          <button onClick={exportCSV} className="bg-green-600 text-white rounded px-3 py-2">Export CSV</button>
        </div>
      </div>

      <TransactionForm />

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
            {isLoading ? (
              <tr><td className="p-3 text-center text-gray-500" colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3 text-center text-gray-500" colSpan={6}>No transactions</td></tr>
            ) : (
              items.map((tx) => (
                <tr key={tx._id} className="border-b last:border-0">
                  <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{tx.type}</td>
                  <td className="p-3">{tx.category}</td>
                  <td className="p-3">₹ {Number(tx.amount).toFixed(2)}</td>
                  <td className="p-3">{tx.description}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => deleteMutation.mutate(tx._id)} 
                      disabled={deleteMutation.isPending}
                      className="text-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
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
