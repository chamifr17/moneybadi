import { supabase } from '../../../lib/supabase'

export async function loadMoneyRows(userId) {
  const [wallets, budgets, expenses, profile] = await Promise.all([
    supabase.from('wallets').select('*').order('created_at', { ascending: true }),
    supabase.from('budgets').select('*').order('created_at', { ascending: true }),
    supabase.from('expenses').select('*').order('date', { ascending: false }),
    supabase.from('pennymon_profiles').select('*').eq('user_id', userId).maybeSingle(),
  ])

  return {
    walletRows: wallets.data || [],
    budgetRows: budgets.data || [],
    expenseRows: expenses.data || [],
    profileRow: profile.data,
    error: wallets.error || budgets.error || expenses.error || profile.error,
  }
}

export function deleteWalletById(id) {
  return supabase.from('wallets').delete().eq('id', id)
}

export function deleteBudgetById(id) {
  return supabase.from('budgets').delete().eq('id', id)
}

export function saveWalletRow({ editingId, userId, walletData }) {
  if (editingId) {
    return supabase
      .from('wallets')
      .update({
        name: walletData.name,
        type: walletData.type,
        balance: walletData.balance,
        tone: walletData.tone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId)
      .select()
      .single()
  }

  return supabase
    .from('wallets')
    .insert({
      user_id: userId,
      name: walletData.name,
      type: walletData.type,
      balance: walletData.balance,
      tone: walletData.tone,
    })
    .select()
    .single()
}

export function updateWalletBalance(id, balance) {
  return supabase
    .from('wallets')
    .update({ balance, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export function saveBudgetRow({ budgetData, editingId, userId }) {
  if (editingId) {
    return supabase
      .from('budgets')
      .update({
        name: budgetData.name,
        limit_amount: budgetData.limit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId)
      .select()
      .single()
  }

  return supabase
    .from('budgets')
    .insert({
      user_id: userId,
      name: budgetData.name,
      spent: 0,
      limit_amount: budgetData.limit,
      color: 'bg-[#6A4DF5]',
    })
    .select()
    .single()
}

export function updateBudgetLimit(id, limit) {
  return supabase
    .from('budgets')
    .update({ limit_amount: limit, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export function updateBudgetSpent(id, spent) {
  return supabase
    .from('budgets')
    .update({ spent, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export function insertExpenseRow({ account, amount, budget, date, note, userId }) {
  return supabase
    .from('expenses')
    .insert({
      user_id: userId,
      wallet_id: account.id,
      budget_id: budget?.id || null,
      account_name: account.name,
      budget_name: budget?.name || note.budgetName,
      amount,
      date,
      note: note.text,
    })
    .select()
    .single()
}

export function deleteExpenseById(id) {
  return supabase.from('expenses').delete().eq('id', id)
}
