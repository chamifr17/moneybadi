import {
  formatExpenseDate,
  formatExpenseMonth,
  getExpenseMonthKey,
  getLocalDateKey,
  getWeekOfMonth,
} from '../../../shared/utils/date'
import { formatMoneyAmount } from '../../../shared/utils/money'

export function isCreditLineAccount(account) {
  return ['Credit', 'Pay later'].includes(account?.type)
}

export function getCreditLineAvailable(account) {
  if (!isCreditLineAccount(account)) return Infinity
  return Math.max(Number(account.balance) || 0, 0)
}

export function isDebtTargetAccount(account) {
  return isCreditLineAccount(account) || account?.balance < 0
}

export function isPiggyBankEligibleType(type) {
  return ['Bank', 'E-wallet'].includes(type)
}

export function getSpendingGraphData(expenses, selectedMonth, selectedWeek = null) {
  const byDate = expenses
    .filter((expense) => getExpenseMonthKey(expense.date) === selectedMonth)
    .filter((expense) => {
      if (!selectedWeek) return true
      const date = new Date(`${expense.date}T00:00:00`)
      return getWeekOfMonth(date) === selectedWeek
    })
    .reduce((groups, expense) => {
      groups[expense.date] = (groups[expense.date] || 0) + expense.amount
      return groups
    }, {})

  return Object.entries(byDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, amount]) => ({
      date,
      amount,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('en-MY', {
        day: '2-digit',
        month: 'short',
      }),
    }))
}

export function getTodayStats(expenses, safeSpend) {
  const today = getLocalDateKey(new Date())
  const dayExpenses = expenses.filter((expense) => expense.date === today)
  const spent = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = Math.max(safeSpend - spent, 0)
  const progress = Math.min((spent / Math.max(safeSpend, 1)) * 100, 100)
  const categoryTotals = dayExpenses.reduce((totals, expense) => {
    totals[expense.budgetName] = (totals[expense.budgetName] || 0) + expense.amount
    return totals
  }, {})
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount }))
  const sourceTotals = dayExpenses.reduce((totals, expense) => {
    totals[expense.accountName] = (totals[expense.accountName] || 0) + expense.amount
    return totals
  }, {})
  const sources = Object.entries(sourceTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      percent: spent ? Math.round((amount / spent) * 100) : 0,
    }))
  const status =
    progress >= 100 ? 'Over limit' : progress >= 75 ? 'Watch spending' : 'On track'

  return {
    count: dayExpenses.length,
    date: today,
    progress,
    remaining,
    safeSpend,
    spent,
    status,
    sources,
    topCategories,
  }
}

export function calculateSafeSpend(accounts, budgets, piggyBankWalletIds = []) {
  if (!accounts.length || !budgets.length) return 0

  const available = accounts
    .filter(
      (account) =>
        account.balance > 0 &&
        !isCreditLineAccount(account) &&
        !piggyBankWalletIds.includes(String(account.id)),
    )
    .reduce((sum, account) => sum + account.balance, 0)
  const remainingBudget = budgets.reduce(
    (sum, budget) => sum + Math.max(budget.limit - budget.spent, 0),
    0,
  )
  const today = new Date()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = Math.max(lastDayOfMonth.getDate() - today.getDate() + 1, 1)
  const flexibleMoney = Math.max(available - remainingBudget, 0)

  return Math.floor(flexibleMoney / daysLeft)
}

export function calculateDebt(accounts, expenses) {
  const negativeDebt = accounts
    .filter((account) => account.balance < 0 && !isCreditLineAccount(account))
    .reduce((sum, account) => sum + Math.abs(account.balance), 0)

  const creditLineDebt = accounts
    .filter(isCreditLineAccount)
    .reduce((sum, account) => {
      const charged = expenses
        .filter(
          (expense) =>
            expense.walletId === account.id &&
            !expense.budgetName?.startsWith('Debt: '),
        )
        .reduce((total, expense) => total + expense.amount, 0)
      const repaid = expenses
        .filter((expense) => expense.budgetName === `Debt: ${account.name}`)
        .reduce((total, expense) => total + expense.amount, 0)

      return sum + Math.max(charged - repaid, 0)
    }, 0)

  return negativeDebt + creditLineDebt
}

export function getPennyMonMood(totals, budgets, todayStats, purchasedTodayIds = []) {
  if (!budgets.length) return 'Happy'
  if (budgets.some((budget) => budget.spent / budget.limit >= 1.2)) return 'Angry'
  if (totals.debt > 0 && totals.debt > totals.available) return 'Angry'
  if (budgets.some((budget) => budget.spent > budget.limit)) return 'Sad'
  if (budgets.some((budget) => budget.spent / budget.limit >= 0.9)) return 'Worried'
  if (purchasedTodayIds.length > 0 && totals.safeSpend >= 50) return 'Excited'
  if (todayStats.spent > 0) return 'Calm'
  return 'Happy'
}

export function getPennyMonMoodReason(
  totals,
  budgets,
  todayStats,
  purchasedTodayIds = [],
) {
  if (!budgets.length) {
    return 'No budget has been created yet, so PennyMon is starting in a happy mood.'
  }

  const badlyOverspentBudget = budgets.find((budget) => budget.spent / budget.limit >= 1.2)
  if (badlyOverspentBudget) {
    return `${badlyOverspentBudget.name} is 120% or more over its limit, so PennyMon feels angry.`
  }

  if (totals.debt > 0 && totals.debt > totals.available) {
    return 'Your debt is higher than your available cash, so PennyMon feels angry.'
  }

  const overspentBudget = budgets.find((budget) => budget.spent > budget.limit)
  if (overspentBudget) {
    return `${overspentBudget.name} is over its budget limit, so PennyMon feels sad.`
  }

  const nearLimitBudget = budgets.find((budget) => budget.spent / budget.limit >= 0.9)
  if (nearLimitBudget) {
    return `${nearLimitBudget.name} has used 90% or more of its budget, so PennyMon feels worried.`
  }

  if (purchasedTodayIds.length > 0 && totals.safeSpend >= 50) {
    return `You bought something new for PennyMon and still have RM${formatMoneyAmount(totals.safeSpend)} safe to spend per day, so PennyMon feels excited.`
  }

  if (todayStats.spent > 0) {
    return 'You logged spending today and your budgets are still under control, so PennyMon feels calm.'
  }

  return 'Your budgets look stable today, so PennyMon feels happy.'
}

export function getExpenseMonths(expenses) {
  return [...new Set(expenses.map((expense) => getExpenseMonthKey(expense.date)))]
    .sort((a, b) => b.localeCompare(a))
    .map((month) => ({
      value: month,
      label: formatExpenseMonth(month),
    }))
}

export function groupExpenses(expenses, selectedWeek, selectedMonth) {
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
  const months = []

  sorted
    .filter((expense) => getExpenseMonthKey(expense.date) === selectedMonth)
    .filter((expense) => {
      const date = new Date(`${expense.date}T00:00:00`)
      return getWeekOfMonth(date) === selectedWeek
    })
    .forEach((expense) => {
      const date = new Date(`${expense.date}T00:00:00`)
      const month = date.toLocaleDateString('en-MY', {
        month: 'long',
        year: 'numeric',
      })
      const week = formatExpenseDate(expense.date)
      let monthGroup = months.find((item) => item.month === month)

      if (!monthGroup) {
        monthGroup = { month, weeks: [] }
        months.push(monthGroup)
      }

      let weekGroup = monthGroup.weeks.find((item) => item.week === week)

      if (!weekGroup) {
        weekGroup = { week, items: [] }
        monthGroup.weeks.push(weekGroup)
      }

      weekGroup.items.push(expense)
    })

  return months
}
