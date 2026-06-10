export function mapWalletRow(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: Number(row.balance),
    tone: row.tone,
  }
}

export function mapBudgetRow(row) {
  return {
    id: row.id,
    name: row.name,
    spent: Number(row.spent),
    limit: Number(row.limit_amount),
    color: row.color,
  }
}

export function mapExpenseRow(row) {
  return {
    id: row.id,
    walletId: row.wallet_id,
    budgetId: row.budget_id,
    amount: Number(row.amount),
    accountName: row.account_name,
    budgetName: row.budget_name,
    date: row.date,
    note: row.note,
  }
}
