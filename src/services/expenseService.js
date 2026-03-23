import axios from 'axios'

const API = axios.create({ baseURL: 'https://expense-tracker-backend-j2ei.onrender.com/api' })

export const getAllExpenses    = ()           => API.get('/expenses')
export const getExpenseById   = (id)         => API.get(`/expenses/${id}`)
export const createExpense    = (data)       => API.post('/expenses', data)
export const updateExpense    = (id, data)   => API.put(`/expenses/${id}`, data)
export const deleteExpense    = (id)         => API.delete(`/expenses/${id}`)
export const getByCategory    = (cat)        => API.get(`/expenses/category/${cat}`)
export const getByDateRange   = (s, e)       => API.get('/expenses/filter', { params: { startDate: s, endDate: e } })

export default API
