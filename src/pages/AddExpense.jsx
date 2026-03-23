import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import { createExpense } from '../services/expenseService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AddExpense() {
  const { isManager } = useAuth()
  const { addToast }  = useToast()
  const navigate      = useNavigate()
  const [loading, setLoading] = useState(false)

  if (!isManager) {
    return (
      <div className="access-denied">
        <div className="icon">🔒</div>
        <h2>Access Restricted</h2>
        <p>Only Managers and Admins can add expenses.</p>
        <button className="btn btn-outline" style={{marginTop:16}} onClick={()=>navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  async function handleSubmit(data) {
    setLoading(true)
    try {
      await createExpense(data)
      addToast('Expense added successfully!')
      navigate('/expenses')
    } catch (err) {
      const msg = err.response?.data?.messages
        ? Object.values(err.response.data.messages).join(', ')
        : 'Failed to add expense'
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Add Expense</h1>
          <p>Record a new transaction</p>
        </div>
      </div>

      <div className="card" style={{maxWidth:600}}>
        <ExpenseForm onSubmit={handleSubmit} loading={loading}/>
      </div>
    </div>
  )
}
