import React, { useEffect, useState } from 'react'
import { getAllExpenses } from '../services/expenseService'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#e9c84a','#5cb88a','#e05c5c','#5b9ae0','#c87ee0','#e08c5b','#5bdde0','#e05ba8','#a0e05b']
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })

export default function Dashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllExpenses()
      .then((r) => setExpenses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total      = expenses.reduce((s, e) => s + parseFloat(e.amount), 0)
  const now        = new Date()
  const thisMonth  = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear() })
  const monthTotal = thisMonth.reduce((s, e) => s + parseFloat(e.amount), 0)

  const catMap = {}
  expenses.forEach((e) => { catMap[e.category] = (catMap[e.category]||0) + parseFloat(e.amount) })
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value)

  const mMap = {}
  expenses.forEach((e) => {
    const d = new Date(e.date)
    const k = d.toLocaleString('default',{month:'short',year:'2-digit'})
    mMap[k] = (mMap[k]||0) + parseFloat(e.amount)
  })
  const monthlyData = Object.entries(mMap).slice(-6).map(([month,amount])=>({month,amount}))
  const recent = [...expenses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6)

  if (loading) return <div style={{color:'var(--text-muted)',textAlign:'center',paddingTop:60}}>Loading data…</div>

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Good {now.getHours()<12?'morning':now.getHours()<18?'afternoon':'evening'}, {user.name.split(' ')[0]} 👋</h1>
          <p>Here's your expense overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon:'💳', label:'Total Spent',     value: fmt(total),          sub:`${expenses.length} transactions`      },
          { icon:'📅', label:'This Month',       value: fmt(monthTotal),     sub:`${thisMonth.length} this month`       },
          { icon:'📊', label:'Avg. Per Expense', value: expenses.length?fmt(total/expenses.length):'₹0', sub:'all time average' },
          { icon:'🏷️', label:'Top Category',     value: catData[0]?.name||'—', sub: catData[0]?fmt(catData[0].value):'no data' },
        ].map((s)=>(
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {expenses.length > 0 && (
        <div className="chart-grid">
          <div className="card">
            <div className="card-title">Monthly Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barSize={26}>
                <XAxis dataKey="month" tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#7a776e',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>'₹'+v}/>
                <Tooltip contentStyle={{background:'#161510',border:'1px solid #302e25',borderRadius:8,fontSize:13}}
                  formatter={(v)=>[fmt(v),'Amount']}/>
                <Bar dataKey="amount" fill="#e9c84a" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Spending by Category</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={38}>
                  {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#161510',border:'1px solid #302e25',borderRadius:8,fontSize:13}}
                  formatter={(v)=>[fmt(v)]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px 14px',marginTop:12}}>
              {catData.slice(0,5).map((c,i)=>(
                <span key={c.name} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'var(--text-muted)'}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:COLORS[i],flexShrink:0,display:'inline-block'}}/>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="card">
        <div className="card-title">Recent Transactions</div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No expenses yet</h3>
            <p>Add your first expense to see it here</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th style={{textAlign:'right'}}>Amount</th></tr></thead>
              <tbody>
                {recent.map((e)=>(
                  <tr key={e.id}>
                    <td style={{fontWeight:500}}>{e.title}</td>
                    <td><span className="badge">{e.category}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{e.date}</td>
                    <td style={{textAlign:'right'}}><span className="amt">{fmt(e.amount)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
