import React from 'react'
import { useToast } from '../context/ToastContext'

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }

export default function Toast() {
  const { toasts } = useToast()
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontWeight: 700 }}>{ICONS[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
