import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, DEMO_USERS } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const ROLE_COLORS = {
  ADMIN:   { bg: 'rgba(233,200,74,0.15)',  color: '#e9c84a' },
  MANAGER: { bg: 'rgba(91,154,224,0.15)',  color: '#5b9ae0' },
  VIEWER:  { bg: 'rgba(92,184,138,0.15)',  color: '#5cb88a' },
}

export default function Login() {
  const { login }    = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = login(email.trim(), password)
      addToast(`Welcome back, ${user.name}!`)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(u) {
    setEmail(u.email)
    setPassword(u.password)
    setError('')
  }

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-illustration">💰</div>
        <h2>Track Every Rupee,<br />Own Every Goal</h2>
        <p>Smart expense tracking with role-based access for individuals and teams.</p>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
          {[
            { icon: '📊', title: 'Visual Dashboards',  desc: 'Charts and insights at a glance'     },
            { icon: '👥', title: 'Role-Based Access',   desc: 'Admin, Manager, and Viewer roles'    },
            { icon: '🔍', title: 'Smart Filters',       desc: 'Filter by date, category, and more' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 22, marginTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{f.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-box">

          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">₹</div>
            <div className="login-logo-text">Expensio</div>
          </div>

          <h1>Welcome back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', fontSize: 16, padding: 0,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)',
              }}>
                ✕  {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Register link */}
          <div style={{
            textAlign: 'center', marginTop: 20,
            padding: '16px 0', borderTop: '1px solid var(--border)',
            fontSize: 14, color: 'var(--text-muted)',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="demo-accounts">
            <div className="demo-label">Quick Demo — click to fill credentials</div>
            <div className="demo-cards">
              {DEMO_USERS.map((u) => {
                const rc = ROLE_COLORS[u.role]
                return (
                  <button key={u.id} className="demo-card" onClick={() => fillDemo(u)}>
                    <div className="demo-avatar" style={{ background: rc.bg, color: rc.color }}>
                      {u.avatar}
                    </div>
                    <div className="demo-info">
                      <div className="demo-name">{u.name}</div>
                      <div className="demo-creds">{u.email} · {u.password}</div>
                    </div>
                    <div className="demo-role-chip" style={{ background: rc.bg, color: rc.color }}>
                      {u.role}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
