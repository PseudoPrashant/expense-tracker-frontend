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
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import StatCard from '../components/dashboard/StatCard'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const [s, c, m] = await Promise.all([
        api.get('/transactions/analytics/summary'),
        api.get('/transactions/analytics/by-category'),
        api.get('/transactions/analytics/monthly-trend'),
      ])
      return {
        summary: s.data,
        byCategory: c.data,
        monthly: m.data,
      }
    }
  })

  if (isLoading) {
    return <div className="text-gray-500 text-center py-8">Loading dashboard...</div>
  }

  if (isError) {
    return <div className="text-red-500 text-center py-8">Failed to load analytics data.</div>
  }

  const { summary, byCategory, monthly } = data

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
        <StatCard label="Total Income" value={summary?.totalIncome || 0} />
        <StatCard label="Total Expense" value={summary?.totalExpense || 0} />
        <StatCard label="Savings" value={summary?.savings || 0} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Category Breakdown</h3>
          {byCategory.length > 0 ? <Pie data={pieData} /> : <div className="text-gray-400 text-sm">No category data</div>}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Monthly Trend</h3>
          {monthly.length > 0 ? <Bar data={barData} /> : <div className="text-gray-400 text-sm">No monthly data</div>}
        </div>
      </div>
    </div>
  )
}
