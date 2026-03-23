import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ROLE_COLORS = {
  ADMIN:   { bg:'rgba(233,200,74,0.15)',  color:'#e9c84a' },
  MANAGER: { bg:'rgba(91,154,224,0.15)',  color:'#5b9ae0' },
  VIEWER:  { bg:'rgba(92,184,138,0.15)',  color:'#5cb88a' },
}

const ROLE_PERMISSIONS = {
  ADMIN: [
    '✅ View Dashboard & Charts',
    '✅ View All Expenses',
    '✅ Add Expenses',
    '✅ Edit Expenses',
    '✅ Delete Expenses',
    '✅ View Reports',
    '✅ Access Admin Panel',
    '✅ View & Manage Users',
  ],
  MANAGER: [
    '✅ View Dashboard & Charts',
    '✅ View All Expenses',
    '✅ Add Expenses',
    '✅ Edit Expenses',
    '✅ Delete Expenses',
    '✅ View Reports',
    '❌ Admin Panel',
    '❌ Manage Users',
  ],
  VIEWER: [
    '✅ View Dashboard & Charts',
    '✅ View All Expenses',
    '❌ Add Expenses',
    '❌ Edit Expenses',
    '❌ Delete Expenses',
    '❌ View Reports',
    '❌ Admin Panel',
    '❌ Manage Users',
  ],
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const rc = ROLE_COLORS[user.role]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Profile</h1>
          <p>Account details and permissions</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>⏻ Sign Out</button>
      </div>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-big-avatar">{user.avatar || user.name[0]}</div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div style={{marginTop:10}}>
            <span style={{background:rc.bg,color:rc.color,padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em'}}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {/* Account info */}
        <div className="card">
          <div className="card-title">Account Details</div>
          {[
            ['User ID',  `#${user.id}`],
            ['Full Name', user.name],
            ['Email',    user.email],
            ['Role',     user.role],
            ['Status',   'Active'],
          ].map(([k,v])=>(
            <div key={k} className="report-row">
              <span className="report-key">{k}</span>
              <span className="report-val">{v}</span>
            </div>
          ))}
        </div>

        {/* Permissions */}
        <div className="card">
          <div className="card-title">Your Permissions</div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
            {ROLE_PERMISSIONS[user.role].map((p)=>(
              <div key={p} style={{fontSize:13.5,color: p.startsWith('✅') ? 'var(--text)' : 'var(--text-muted)'}}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
