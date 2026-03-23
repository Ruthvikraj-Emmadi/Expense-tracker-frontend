import React, { useEffect, useState } from 'react'
import { getAllExpenses, deleteExpense, getByCategory, getByDateRange } from '../services/expenseService'
import EditModal from '../components/EditModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

const CATS = ['All','Food','Transport','Shopping','Entertainment','Health','Utilities','Education','Rent','Other']
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })

export default function Expenses() {
  const { isManager } = useAuth()
  const { addToast }  = useToast()
  const navigate      = useNavigate()

  const [expenses,   setExpenses]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('All')
  const [startDate,  setStartDate]  = useState('')
  const [endDate,    setEndDate]    = useState('')

  async function load() {
    setLoading(true)
    try { const r = await getAllExpenses(); setExpenses(r.data) }
    catch { addToast('Failed to load', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return
    try { await deleteExpense(id); addToast('Expense deleted'); load() }
    catch { addToast('Delete failed', 'error') }
  }

  async function handleCatFilter(cat) {
    setCategory(cat); setLoading(true)
    try {
      const r = cat === 'All' ? await getAllExpenses() : await getByCategory(cat)
      setExpenses(r.data)
    } catch { addToast('Filter failed','error') }
    finally { setLoading(false) }
  }

  async function applyDates() {
    if (!startDate||!endDate) { addToast('Set both dates','error'); return }
    setLoading(true)
    try { const r = await getByDateRange(startDate, endDate); setExpenses(r.data) }
    catch { addToast('Date filter failed','error') }
    finally { setLoading(false) }
  }

  function reset() { setCategory('All'); setStartDate(''); setEndDate(''); setSearch(''); load() }

  const filtered = expenses.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.description||'').toLowerCase().includes(search.toLowerCase())
  )

  const total = filtered.reduce((s,e)=>s+parseFloat(e.amount),0)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Expenses</h1>
          <p>{filtered.length} records · Total: {fmt(total)}</p>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={() => navigate('/add')}>＋ Add Expense</button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom:20}}>
        <div className="filter-bar">
          <input placeholder="🔍 Search…" value={search} onChange={(e)=>setSearch(e.target.value)}/>
          <select value={category} onChange={(e)=>handleCatFilter(e.target.value)}>
            {CATS.map((c)=><option key={c}>{c}</option>)}
          </select>
          <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
          <input type="date" value={endDate}   onChange={(e)=>setEndDate(e.target.value)}/>
          <button className="btn btn-outline btn-sm" onClick={applyDates}>Apply Dates</button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{textAlign:'center',padding:'40px 0',color:'var(--text-muted)'}}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🗂️</div>
            <h3>No expenses found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Category</th>
                  <th>Date</th><th>Description</th>
                  <th style={{textAlign:'right'}}>Amount</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e,i)=>(
                  <tr key={e.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{i+1}</td>
                    <td style={{fontWeight:500}}>{e.title}</td>
                    <td><span className="badge">{e.category}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{e.date}</td>
                    <td style={{color:'var(--text-muted)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {e.description||'—'}
                    </td>
                    <td style={{textAlign:'right'}}><span className="amt">{fmt(e.amount)}</span></td>
                    {isManager && (
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-outline btn-sm" onClick={()=>setEditTarget(e)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(e.id)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editTarget && (
        <EditModal expense={editTarget} onClose={()=>setEditTarget(null)} onUpdated={load}/>
      )}
    </div>
  )
}
