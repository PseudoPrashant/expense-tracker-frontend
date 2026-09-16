export default function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">₹ {Number(value).toFixed(2)}</div>
    </div>
  )
}
