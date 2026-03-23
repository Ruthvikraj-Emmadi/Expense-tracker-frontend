import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Default demo users
const DEFAULT_USERS = [
  { id: 1, name: 'Admin User',   email: 'admin@expensio.com',   password: 'admin123',   role: 'ADMIN',   avatar: 'A' },
  { id: 2, name: 'Priya Sharma', email: 'manager@expensio.com', password: 'manager123', role: 'MANAGER', avatar: 'P' },
  { id: 3, name: 'Ravi Kumar',   email: 'viewer@expensio.com',  password: 'viewer123',  role: 'VIEWER',  avatar: 'R' },
]

export const DEMO_USERS = DEFAULT_USERS

function getUsers() {
  const saved = localStorage.getItem('expensio_users')
  return saved ? JSON.parse(saved) : DEFAULT_USERS
}

function saveUsers(users) {
  localStorage.setItem('expensio_users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expensio_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(email, password) {
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...safe } = found
    localStorage.setItem('expensio_user', JSON.stringify(safe))
    setUser(safe)
    return safe
  }

  function register(name, email, password, role) {
    const users = getUsers()
    const exists = users.find((u) => u.email === email)
    if (exists) throw new Error('An account with this email already exists')
    const newUser = {
      id:       users.length + 1,
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      role,
      avatar:   name.trim()[0].toUpperCase(),
    }
    const updated = [...users, newUser]
    saveUsers(updated)
    // auto login after register
    const { password: _, ...safe } = newUser
    localStorage.setItem('expensio_user', JSON.stringify(safe))
    setUser(safe)
    return safe
  }

  function logout() {
    localStorage.removeItem('expensio_user')
    setUser(null)
  }

  const isAdmin   = user?.role === 'ADMIN'
  const isManager = user?.role === 'MANAGER' || isAdmin
  const isViewer  = !!user

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isManager, isViewer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
