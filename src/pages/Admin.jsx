import React, { useEffect, useState } from 'react'
import { getAllExpenses, deleteExpense } from '../services/expenseService'
import { useAuth, DEMO_USERS } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import EditModal from '../components/EditModal'

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })

const ROLE_COLORS = {
  ADMIN:   { bg:'rgba(233,200,74,0.15)',  color:'#e9c84a' },
  MANAGER: { bg:'rgba(91,154,224,0.15)',  color:'#5b9ae0' },
  VIEWER:  { bg:'rgba(92,184,138,0.15)',  color:'#5cb88a' },
}

export default function Admin() {
  const { isAdmin }  = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [expenses,   setExpenses]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [tab,        setTab]        = useState('expenses')

  useEffect(() => {
    getAllExpenses().then((r)=>setExpenses(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="icon">🔒</div>
        <h2>Admins Only</h2>
        <p>You don't have permission to access the Admin Panel.</p>
        <button className="btn btn-outline" style={{marginTop:16}} onClick={()=>navigate('/')}>← Back to Dashboard</button>
      </div>
    )
  }

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this expense?')) return
    try { await deleteExpense(id); addToast('Deleted'); setExpenses((p)=>p.filter((e)=>e.id!==id)) }
    catch { addToast('Delete failed','error') }
  }

  const total = expenses.reduce((s,e)=>s+parseFloat(e.amount),0)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Admin Panel</h1>
          <p>Full system control · {expenses.length} records · {fmt(total)} total</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:24,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:4,width:'fit-content'}}>
        {['expenses','users'].map((t)=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{
              padding:'7px 20px', borderRadius:8, fontSize:13, fontWeight:600,
              textTransform:'capitalize', transition:'all 0.2s',
              background: tab===t ? 'var(--accent)' : 'transparent',
              color: tab===t ? 'var(--bg)' : 'var(--text-muted)',
            }}
          >
            {t === 'expenses' ? '💳 Expenses' : '👥 Users'}
          </button>
        ))}
      </div>

      {tab === 'expenses' && (
        <div className="card">
          <div className="card-title" style={{marginBottom:16}}>All Expense Records</div>
          {loading ? (
            <div style={{textAlign:'center',padding:'40px 0',color:'var(--text-muted)'}}>Loading…</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Title</th><th>Category</th><th>Date</th><th>Description</th><th style={{textAlign:'right'}}>Amount</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {expenses.map((e)=>(
                    <tr key={e.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{e.id}</td>
                      <td style={{fontWeight:500}}>{e.title}</td>
                      <td><span className="badge">{e.category}</span></td>
                      <td style={{color:'var(--text-muted)'}}>{e.date}</td>
                      <td style={{color:'var(--text-muted)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.description||'—'}</td>
                      <td style={{textAlign:'right'}}><span className="amt">{fmt(e.amount)}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-outline btn-sm" onClick={()=>setEditTarget(e)}>Edit</button>
                          <button className="btn btn-danger btn-sm"  onClick={()=>handleDelete(e.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="card-title" style={{marginBottom:16}}>Registered Users</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {DEMO_USERS.map((u)=>{
                  const rc = ROLE_COLORS[u.role]
                  return (
                    <tr key={u.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{u.id}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:30,height:30,borderRadius:'50%',background:rc.bg,color:rc.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,flexShrink:0}}>
                            {u.avatar}
                          </div>
                          <span style={{fontWeight:500}}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--text-muted)'}}>{u.email}</td>
                      <td>
                        <span style={{background:rc.bg,color:rc.color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                          {u.role}
                        </span>
                      </td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editTarget && <EditModal expense={editTarget} onClose={()=>setEditTarget(null)} onUpdated={()=>getAllExpenses().then((r)=>setExpenses(r.data))}/>}
    </div>
  )
}
