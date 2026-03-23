import React, { useState } from 'react'

const CATEGORIES = ['Food','Transport','Shopping','Entertainment','Health','Utilities','Education','Rent','Other']
const today = new Date().toISOString().split('T')[0]

export default function ExpenseForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title:       initial.title       || '',
    description: initial.description || '',
    amount:      initial.amount      || '',
    category:    initial.category    || '',
    date:        initial.date        || today,
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.title.trim())              e.title    = 'Title is required'
    if (!form.amount || +form.amount<=0) e.amount   = 'Enter a valid positive amount'
    if (!form.category)                  e.category = 'Select a category'
    if (!form.date)                      e.date     = 'Date is required'
    return e
  }

  function change(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  function submit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={change} placeholder="e.g. Lunch at office" />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input name="amount" type="number" min="0.01" step="0.01"
            value={form.amount} onChange={change} placeholder="0.00" />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={change}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={change} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>

        <div className="form-group full">
          <label>Description (optional)</label>
          <input name="description" value={form.description} onChange={change} placeholder="Notes…" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : '✓  Save Expense'}
          </button>
          {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    </form>
  )
}
