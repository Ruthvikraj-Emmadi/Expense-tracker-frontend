import React, { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import { updateExpense } from '../services/expenseService'
import { useToast } from '../context/ToastContext'

export default function EditModal({ expense, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  async function handleSubmit(data) {
    setLoading(true)
    try {
      await updateExpense(expense.id, data)
      addToast('Expense updated')
      onUpdated()
      onClose()
    } catch {
      addToast('Update failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <ExpenseForm initial={expense} onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
      </div>
    </div>
  )
}
