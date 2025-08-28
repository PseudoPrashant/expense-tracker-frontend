import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '../lib/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, savings: 0 })
  const [byCategory, setByCategory] = useState([])
  const [monthly, setMonthly] = useState([])

  useEffect(() => {
    ;(async () => {
      const [s, c, m] = await Promise.all([
        api.get('/transactions/analytics/summary'),
        api.get('/transactions/analytics/by-category'),
        api.get('/transactions/analytics/monthly-trend'),
      ])
      setSummary(s.data)
      setByCategory(c.data)
      setMonthly(m.data)
    })()
  }, [])

  const pieData = {
    labels: byCategory.map((x) => x.category),
    datasets: [
      {
        label: 'Expenses',
        data: byCategory.map((x) => x.total),
        backgroundColor: ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'],
      },
    ],
  }

  const barData = {
    labels: monthly.map((x) => `M${x.month}`),
    datasets: [
      { label: 'Income', data: monthly.map((x) => x.income), backgroundColor: '#34d399' },
      { label: 'Expense', data: monthly.map((x) => x.expense), backgroundColor: '#f87171' },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total Income" value={summary.totalIncome} />
        <Stat label="Total Expense" value={summary.totalExpense} />
        <Stat label="Savings" value={summary.savings} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Category Breakdown</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Monthly Trend</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">₹ {Number(value).toFixed(2)}</div>
    </div>
  )
}


