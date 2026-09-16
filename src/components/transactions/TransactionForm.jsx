import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../lib/api'
import { categories } from '../../lib/constants'

const transactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number({ invalid_type_error: "Amount is required" }).positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
})

export default function TransactionForm() {
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().slice(0, 10),
      description: '',
    }
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/transactions', data)
    },
    onSuccess: () => {
      reset() // Reset the form on success
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
    }
  })

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-semibold mb-3">Add Transaction</h3>
      <form className="flex flex-col gap-3 md:flex-row md:items-start" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <select className="border rounded px-2 py-2 w-full" {...register('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="flex-1">
          <input 
            className="border rounded px-2 py-2 w-full" 
            type="number" 
            step="0.01"
            placeholder="Amount" 
            {...register('amount', { valueAsNumber: true })} 
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <div className="flex-1">
          <select className="border rounded px-2 py-2 w-full" {...register('category')}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <input 
            className="border rounded px-2 py-2 w-full" 
            type="date" 
            {...register('date')} 
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>

        <div className="flex-[2]">
          <input 
            className="border rounded px-2 py-2 w-full" 
            placeholder="Description (Optional)" 
            {...register('description')} 
          />
        </div>

        <div>
          <button 
            type="submit" 
            disabled={mutation.isPending} 
            className="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50 w-full"
          >
            {mutation.isPending ? 'Saving...' : 'Add'}
          </button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 text-sm mt-2">Failed to add transaction.</p>
      )}
    </div>
  )
}
