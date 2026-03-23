import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Expenses   from './pages/Expenses'
import AddExpense from './pages/AddExpense'
import Reports    from './pages/Reports'
import Admin      from './pages/Admin'
import Profile    from './pages/Profile'
import Toast      from './components/Toast'

// ---- Protected route wrapper ----
function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ---- Sidebar ----
function Sidebar() {
  const { user, isAdmin, isManager, logout } = useAuth()
  const navigate = useNavigate()

  const ROLE_COLORS = {
    ADMIN:   { bg:'rgba(233,200,74,0.15)', color:'#e9c84a' },
    MANAGER: { bg:'rgba(91,154,224,0.15)', color:'#5b9ae0' },
    VIEWER:  { bg:'rgba(92,184,138,0.15)', color:'#5cb88a' },
  }
  const rc = ROLE_COLORS[user.role]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">₹</div>
        <div className="brand-name">Expensio</div>
      </div>
      <div className={`sidebar-role-badge role-${user.role.toLowerCase()}`}>{user.role}</div>

      {/* All users */}
      <div className="sidebar-section-label">Main</div>
      <NavLink to="/" end className={({isActive})=>`nav-item${isActive?' active':''}`}>
        <span className="nav-icon">▦</span>
        <span className="nav-label">Dashboard</span>
      </NavLink>
      <NavLink to="/expenses" className={({isActive})=>`nav-item${isActive?' active':''}`}>
        <span className="nav-icon">💳</span>
        <span className="nav-label">Expenses</span>
      </NavLink>

      {/* Manager + Admin */}
      {isManager && (
        <>
          <div className="sidebar-section-label">Manage</div>
          <NavLink to="/add" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <span className="nav-icon">＋</span>
            <span className="nav-label">Add Expense</span>
          </NavLink>
          <NavLink to="/reports" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Reports</span>
          </NavLink>
        </>
      )}

      {/* Admin only */}
      {isAdmin && (
        <>
          <div className="sidebar-section-label">Admin</div>
          <NavLink to="/admin" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <span className="nav-icon">🛡️</span>
            <span className="nav-label">Admin Panel</span>
            <span className="nav-badge">Admin</span>
          </NavLink>
        </>
      )}

      <div className="sidebar-spacer" />

      {/* Profile link */}
      <NavLink to="/profile" className={({isActive})=>`nav-item${isActive?' active':''}`}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </NavLink>

      {/* User footer */}
      <div className="sidebar-user">
        <div className="user-avatar" style={{background:rc.bg,color:rc.color}}>{user.avatar||user.name[0]}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role}</div>
        </div>
        <button className="logout-btn" title="Sign out" onClick={()=>{ logout(); navigate('/login') }}>⏻</button>
      </div>
    </aside>
  )
}

// ---- Topbar ----
function Topbar({ title }) {
  const { user } = useAuth()
  const now = new Date()
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <div className="topbar-chip">
          🕐 {now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
        </div>
        <div className="topbar-chip">
          👤 {user.name}
        </div>
      </div>
    </div>
  )
}

// ---- App shell (sidebar + topbar + content) ----
function AppShell() {
  const { user } = useAuth()
  if (!user) return null

  const PAGE_TITLES = {
    '/':        'Dashboard',
    '/expenses':'Expenses',
    '/add':     'Add Expense',
    '/reports': 'Reports',
    '/admin':   'Admin Panel',
    '/profile': 'My Profile',
  }
  const path  = window.location.pathname
  const title = PAGE_TITLES[path] || 'Expensio'

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar title={title} />
        <div className="page-body">
          <Routes>
            <Route path="/"        element={<Dashboard  />} />
            <Route path="/expenses"element={<Expenses   />} />
            <Route path="/add"     element={<AddExpense />} />
            <Route path="/reports" element={<Reports    />} />
            <Route path="/admin"   element={<Admin      />} />
            <Route path="/profile" element={<Profile    />} />
            <Route path="*"        element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// ---- Root ----
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login"    element={<Login    />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <Protected>
                <AppShell />
              </Protected>
            }/>
          </Routes>
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
