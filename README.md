# Expense Tracker Frontend (Vite + React)

## Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080`

## Setup & Run

```bash
npm install
npm run dev
```

App opens at **http://localhost:5173**

## Demo Accounts

| Role    | Email                    | Password     | Access |
|---------|--------------------------|--------------|--------|
| Admin   | admin@expensio.com       | admin123     | Full access + Admin Panel + Users |
| Manager | manager@expensio.com     | manager123   | Add/Edit/Delete + Reports |
| Viewer  | viewer@expensio.com      | viewer123    | View only |

## Role Permissions

### ADMIN
- Dashboard, Expenses, Add/Edit/Delete, Reports, Admin Panel, User Management

### MANAGER
- Dashboard, Expenses, Add/Edit/Delete, Reports

### VIEWER
- Dashboard (read-only), Expenses (read-only)

## Project Structure

```
src/
├── main.jsx
├── App.jsx               # Routes + Sidebar + Topbar
├── index.css             # Global dark theme
├── context/
│   ├── AuthContext.jsx   # Login/logout/role state
│   └── ToastContext.jsx  # Notifications
├── components/
│   ├── ExpenseForm.jsx   # Reusable form
│   ├── EditModal.jsx     # Edit popup
│   └── Toast.jsx         # Toast notifications
├── pages/
│   ├── Login.jsx         # Login + demo accounts
│   ├── Dashboard.jsx     # Charts + stats
│   ├── Expenses.jsx      # Table + filter
│   ├── AddExpense.jsx    # Add form (Manager+)
│   ├── Reports.jsx       # Analytics (Manager+)
│   ├── Admin.jsx         # Admin panel (Admin only)
│   └── Profile.jsx       # User profile + permissions
└── services/
    └── expenseService.js # Axios API calls
```
