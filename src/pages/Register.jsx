import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const ROLES = [
  { value: 'VIEWER',  label: 'Viewer',  desc: 'Can view dashboard and expenses only',           color: '#5cb88a', bg: 'rgba(92,184,138,0.15)'  },
  { value: 'MANAGER', label: 'Manager', desc: 'Can add, edit, delete expenses and view reports', color: '#5b9ae0', bg: 'rgba(91,154,224,0.15)'  },
  { value: 'ADMIN',   label: 'Admin',   desc: 'Full access including admin panel and users',     color: '#e9c84a', bg: 'rgba(233,200,74,0.15)'  },
]

export default function Register() {
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [role,     setRole]     = useState('VIEWER')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!name.trim())          e.name     = 'Full name is required'
    if (!email.trim())         e.email    = 'Email is required'
    if (password.length < 6)   e.password = 'Password must be at least 6 characters'
    if (password !== confirm)  e.confirm  = 'Passwords do not match'
    if (!role)                 e.role     = 'Please select a role'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const user = register(name, email, password, role)
      addToast(`Account created! Welcome, ${user.name}!`)
      navigate('/')
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-illustration">🚀</div>
        <h2>Join Expensio<br />Start Tracking Today</h2>
        <p>Create your account and take control of your finances in minutes.</p>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 320 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Choose your role
          </div>
          {ROLES.map((r) => (
            <div key={r.value} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 16px', borderRadius: 10,
              background: role === r.value ? r.bg : 'var(--bg3)',
              border: `1px solid ${role === r.value ? r.color : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onClick={() => setRole(r.value)}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: r.bg, color: r.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12, flexShrink: 0,
              }}>
                {r.value[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: role === r.value ? r.color : 'var(--text)' }}>
                  {r.label}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{r.desc}</div>
              </div>
              {role === r.value && (
                <div style={{ marginLeft: 'auto', color: r.color, fontSize: 18 }}>✓</div>
              )}
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

          <h1>Create account</h1>
          <p className="login-subtitle">Fill in your details to get started</p>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ravi Kumar"
                autoFocus
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', fontSize: 16, padding: 0,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>

            {/* Role selector */}
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                ))}
              </select>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            {/* General error */}
            {errors.general && (
              <div style={{
                background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)',
              }}>
                ✕  {errors.general}
              </div>
            )}

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Password strength
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: password.length >= i * 3
                        ? i <= 1 ? '#e05c5c' : i <= 2 ? '#e0b45b' : i <= 3 ? '#5b9ae0' : '#5cb88a'
                        : 'var(--border)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {password.length < 3 ? 'Weak' : password.length < 6 ? 'Fair' : password.length < 9 ? 'Good' : 'Strong'}
                </div>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          {/* Login link */}
          <div style={{
            textAlign: 'center', marginTop: 20,
            padding: '16px 0', borderTop: '1px solid var(--border)',
            fontSize: 14, color: 'var(--text-muted)',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
