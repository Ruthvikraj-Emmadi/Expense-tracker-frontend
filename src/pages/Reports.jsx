import React, { useEffect, useState } from 'react'
import { getAllExpenses } from '../services/expenseService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })

export default function Reports() {
  const { isManager } = useAuth()
  const navigate      = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllExpenses().then((r)=>setExpenses(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (!isManager) {
    return (
      <div className="access-denied">
        <div className="icon">🔒</div>
        <h2>Access Restricted</h2>
        <p>Only Managers and Admins can view reports.</p>
        <button className="btn btn-outline" style={{marginTop:16}} onClick={()=>navigate('/')}>← Back to Dashboard</button>
      </div>
    )
  }

  if (loading) return <div style={{color:'var(--text-muted)',textAlign:'center',paddingTop:60}}>Loading…</div>

  // Category totals
  const catMap = {}
  expenses.forEach((e)=>{ catMap[e.category]=(catMap[e.category]||0)+parseFloat(e.amount) })
  const catData = Object.entries(catMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value)

  // Monthly totals
  const mMap = {}
  expenses.forEach((e)=>{
    const d = new Date(e.date)
    const k = d.toLocaleString('default',{month:'short',year:'2-digit'})
    mMap[k]=(mMap[k]||0)+parseFloat(e.amount)
  })
  const monthData = Object.entries(mMap).map(([month,total])=>({month,total}))

  const total = expenses.reduce((s,e)=>s+parseFloat(e.amount),0)
  const avg   = expenses.length ? total/expenses.length : 0
  const max   = expenses.reduce((m,e)=>Math.max(m,parseFloat(e.amount)),0)
  const topExp = expenses.find((e)=>parseFloat(e.amount)===max)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports</h1>
          <p>Detailed spending analysis</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="report-grid">
        <div className="report-card">
          <div className="report-card-title">Summary</div>
          {[
            ['Total Expenses',    expenses.length],
            ['Total Amount',      fmt(total)],
            ['Average Amount',    fmt(avg)],
            ['Highest Expense',   fmt(max)],
            ['Top Expense Title', topExp?.title||'—'],
          ].map(([k,v])=>(
            <div key={k} className="report-row">
              <span className="report-key">{k}</span>
              <span className="report-val">{v}</span>
            </div>
          ))}
        </div>

        <div className="report-card">
          <div className="report-card-title">By Category</div>
          {catData.map((c)=>(
            <div key={c.name} className="report-row">
              <span className="report-key">{c.name}</span>
              <span className="report-val">{fmt(c.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart - by category */}
      <div className="chart-grid">
        <div className="card">
          <div className="card-title">Spending by Category</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} barSize={22}>
              <XAxis dataKey="name" tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>'₹'+v}/>
              <Tooltip contentStyle={{background:'#161510',border:'1px solid #302e25',borderRadius:8,fontSize:13}} formatter={(v)=>[fmt(v)]}/>
              <Bar dataKey="value" fill="#e9c84a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Monthly Spend Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#302e25"/>
              <XAxis dataKey="month" tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>'₹'+v}/>
              <Tooltip contentStyle={{background:'#161510',border:'1px solid #302e25',borderRadius:8,fontSize:13}} formatter={(v)=>[fmt(v),'Total']}/>
              <Line type="monotone" dataKey="total" stroke="#e9c84a" strokeWidth={2} dot={{fill:'#e9c84a',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
