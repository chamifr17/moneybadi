import {
  BadgeCheck,
  Edit3,
  Home,
  MoreHorizontal,
  Moon,
  Plus,
  Shirt,
  ShoppingBag,
  Sun,
  Target,
  Trash2,
  Trophy,
  WalletCards,
  X,
} from 'lucide-react'
import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [coins, setCoins] = useState(85)
  const [activeForm, setActiveForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [historyWeek, setHistoryWeek] = useState(1)
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState('2026-05')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSpendCardFlipped, setIsSpendCardFlipped] = useState(false)
  const [walletForm, setWalletForm] = useState({
    name: '',
    type: 'Bank',
    balance: '',
  })
  const [budgetForm, setBudgetForm] = useState({
    name: '',
    limit: '',
  })
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    accountId: '',
    budgetId: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  })
  const [equipped] = useState({
    outfit: 'Mint hoodie',
    accessory: 'Round glasses',
    room: 'Cozy desk',
  })

  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Maybank', type: 'Bank', balance: 820, tone: 'bg-[#eeeaff]' },
    { id: 2, name: 'CIMB', type: 'Bank', balance: 360, tone: 'bg-slate-100' },
    { id: 3, name: 'Cash', type: 'Cash', balance: 90, tone: 'bg-zinc-100' },
    { id: 4, name: 'TNG eWallet', type: 'E-wallet', balance: 74, tone: 'bg-[#f3f1ff]' },
    { id: 5, name: 'SPayLater', type: 'Pay later', balance: -120, tone: 'bg-rose-50' },
    { id: 6, name: 'GrabPay', type: 'E-wallet', balance: 48, tone: 'bg-[#eeeaff]' },
    { id: 7, name: 'ShopeePay', type: 'E-wallet', balance: 32, tone: 'bg-zinc-100' },
    { id: 8, name: 'Savings', type: 'Saving', balance: 500, tone: 'bg-[#f3f1ff]' },
    { id: 9, name: 'Credit Card', type: 'Credit', balance: -280, tone: 'bg-rose-50' },
  ])

  const [budgets, setBudgets] = useState([
    { id: 1, name: 'Food', spent: 310, limit: 500, color: 'bg-[#6A4DF5]' },
    { id: 2, name: 'Transport', spent: 92, limit: 180, color: 'bg-slate-700' },
    { id: 3, name: 'Shopping', spent: 210, limit: 260, color: 'bg-zinc-500' },
    { id: 4, name: 'Bills', spent: 160, limit: 300, color: 'bg-[#9787ff]' },
    { id: 5, name: 'Groceries', spent: 240, limit: 420, color: 'bg-[#6A4DF5]' },
    { id: 6, name: 'Entertainment', spent: 85, limit: 150, color: 'bg-slate-700' },
    { id: 7, name: 'Health', spent: 45, limit: 120, color: 'bg-zinc-500' },
    { id: 8, name: 'Savings', spent: 180, limit: 300, color: 'bg-[#9787ff]' },
  ])

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 18,
      accountName: 'TNG eWallet',
      budgetName: 'Food',
      date: '2026-05-22',
      note: 'Lunch',
    },
    {
      id: 2,
      amount: 12,
      accountName: 'Cash',
      budgetName: 'Transport',
      date: '2026-05-21',
      note: 'Train',
    },
    {
      id: 3,
      amount: 45,
      accountName: 'Maybank',
      budgetName: 'Groceries',
      date: '2026-05-15',
      note: 'Snacks and drinks',
    },
    {
      id: 4,
      amount: 28,
      accountName: 'CIMB',
      budgetName: 'Food',
      date: '2026-04-28',
      note: 'Dinner',
    },
    {
      id: 5,
      amount: 65,
      accountName: 'Maybank',
      budgetName: 'Shopping',
      date: '2026-04-20',
      note: 'Shirt',
    },
  ])

  const quests = [
    { title: 'Log one expense', reward: 15, done: true },
    { title: 'Stay under RM42 today', reward: 30, done: false },
    { title: 'Review your food budget', reward: 20, done: false },
  ]

  const available = accounts
    .filter((account) => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0)
  const debt = accounts
    .filter((account) => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0)
  const totals = {
    available,
    debt,
    trueBalance: available - debt,
    safeSpend: 42,
  }
  const badiMood = totals.safeSpend >= 40 ? 'Calm' : 'Careful'
  const historyMonths = getExpenseMonths(expenses)
  const todayStats = getTodayStats(expenses, totals.safeSpend)
  const groupedExpenseHistory = groupExpenses(
    expenses,
    historyWeek,
    selectedHistoryMonth,
  )
  const historyGraphData = getSpendingGraphData(
    expenses,
    selectedHistoryMonth,
    historyWeek,
  )

  const completeQuest = (coinReward) => {
    setCoins((current) => current + coinReward)
  }

  const closeForm = () => {
    setActiveForm(null)
    setEditingId(null)
    setWalletForm({ name: '', type: 'Bank', balance: '' })
    setBudgetForm({ name: '', limit: '' })
    setExpenseForm({
      amount: '',
      accountId: '',
      budgetId: '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    })
    setIsCalendarOpen(false)
  }

  const openAddWallet = () => {
    setEditingId(null)
    setWalletForm({ name: '', type: 'Bank', balance: '' })
    setActiveForm('wallet')
  }

  const openEditWallet = (account) => {
    setEditingId(account.id)
    setWalletForm({
      name: account.name,
      type: account.type,
      balance: String(Math.abs(account.balance)),
    })
    setActiveForm('wallet')
  }

  const openAddBudget = () => {
    setEditingId(null)
    setBudgetForm({ name: '', limit: '' })
    setActiveForm('budget')
  }

  const openEditBudget = (budget) => {
    setEditingId(budget.id)
    setBudgetForm({
      name: budget.name,
      limit: String(budget.limit),
    })
    setActiveForm('budget')
  }

  const deleteWallet = (id) => {
    setAccounts((current) => current.filter((account) => account.id !== id))
  }

  const deleteBudget = (id) => {
    setBudgets((current) => current.filter((budget) => budget.id !== id))
  }

  const saveWallet = (event) => {
    event.preventDefault()
    const amount = Number(walletForm.balance)
    if (!walletForm.name.trim() || Number.isNaN(amount)) return

    const shouldBeDebt = ['Credit', 'Pay later'].includes(walletForm.type)
    const walletData = {
      name: walletForm.name.trim(),
      type: walletForm.type,
      balance: shouldBeDebt && amount > 0 ? -amount : amount,
      tone: shouldBeDebt ? 'bg-rose-50' : 'bg-[#eeeaff]',
    }

    if (editingId) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === editingId ? { ...account, ...walletData } : account,
        ),
      )
    } else {
      setAccounts((current) => [
        {
          id: Date.now(),
          ...walletData,
        },
        ...current,
      ])
    }
    closeForm()
  }

  const saveBudget = (event) => {
    event.preventDefault()
    const limit = Number(budgetForm.limit)
    if (!budgetForm.name.trim() || Number.isNaN(limit) || limit <= 0) return

    if (editingId) {
      setBudgets((current) =>
        current.map((budget) =>
          budget.id === editingId
            ? {
                ...budget,
                name: budgetForm.name.trim(),
                limit,
              }
            : budget,
        ),
      )
    } else {
      setBudgets((current) => [
        {
          id: Date.now(),
          name: budgetForm.name.trim(),
          spent: 0,
          limit,
          color: 'bg-[#6A4DF5]',
        },
        ...current,
      ])
    }
    closeForm()
  }

  const saveExpense = (event) => {
    event.preventDefault()
    const amount = Number(expenseForm.amount)
    const accountId = Number(expenseForm.accountId)
    const budgetId = Number(expenseForm.budgetId)
    const account = accounts.find((item) => item.id === accountId)
    const budget = budgets.find((item) => item.id === budgetId)

    if (Number.isNaN(amount) || amount <= 0 || !account || !budget) return

    setAccounts((current) =>
      current.map((account) =>
        account.id === accountId
          ? { ...account, balance: account.balance - amount }
          : account,
      ),
    )
    setBudgets((current) =>
      current.map((budget) =>
        budget.id === budgetId
          ? { ...budget, spent: budget.spent + amount }
          : budget,
      ),
    )
    setExpenses((current) => [
      {
        id: Date.now(),
        amount,
        accountName: account.name,
        budgetName: budget.name,
        date: expenseForm.date || new Date().toISOString().slice(0, 10),
        note: expenseForm.note.trim() || 'Expense',
      },
      ...current,
    ])
    setExpenseForm({
      amount: '',
      accountId: accounts[0]?.id ? String(accounts[0].id) : '',
      budgetId: budgets[0]?.id ? String(budgets[0].id) : '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    })
    setIsCalendarOpen(false)
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallets', label: 'Wallets', icon: WalletCards },
    { id: 'expense', label: 'Add', icon: Plus },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'closet', label: 'Badi', icon: BadiNavIcon },
  ]

  const theme = {
    app: isDark ? 'bg-[#202020]' : 'bg-[#f7f7fb]',
    page: isDark ? 'bg-[#282828]' : 'bg-[#f7f7fb]',
    card: isDark
      ? 'border-white/10 bg-[#2f2e38] text-slate-100'
      : 'border-slate-200 bg-white text-slate-950',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    title: isDark ? 'text-slate-100' : 'text-[#171725]',
    nav: isDark ? 'border-[#35343f] bg-[#24232d]' : 'border-slate-200 bg-white',
    navIdle: isDark ? 'text-slate-400' : 'text-slate-500',
    shadow: isDark ? 'shadow-black/40' : 'shadow-slate-300/60',
  }

  return (
    <main
      className={`mx-auto flex h-screen max-w-md flex-col overflow-hidden shadow-2xl ${theme.app} ${theme.shadow}`}
    >
      {activeTab !== 'closet' && (
        <header className="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <p className="text-sm font-semibold text-[#6A4DF5]">MoneyBadi</p>
            <h1 className={`text-2xl font-semibold ${theme.title}`}>
              Hi, Chami
            </h1>
          </div>
          <button
            className={`grid size-11 place-items-center rounded-full border shadow-sm ${theme.card}`}
            onClick={() => setIsDark((current) => !current)}
            type="button"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
      )}

      <section
        className={
          activeTab === 'closet'
            ? 'h-[calc(100vh-76px)] overflow-hidden'
            : `flex-1 space-y-4 overflow-y-auto px-5 pb-24 ${theme.page}`
        }
      >
        {activeTab === 'home' && (
          <div className="space-y-4 pt-3">
            <div
              className="block h-[286px] w-full text-left [perspective:1200px]"
              onClick={() => setIsSpendCardFlipped((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setIsSpendCardFlipped((current) => !current)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div
                className="relative h-full transition-transform duration-500 [transform-style:preserve-3d]"
                style={{
                  transform: isSpendCardFlipped
                    ? 'rotateY(180deg)'
                    : 'rotateY(0deg)',
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#6A4DF5] p-5 text-white shadow-xl shadow-[#6A4DF5]/20 [backface-visibility:hidden]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white/75">Today</p>
                      <h2 className="mt-1 text-3xl font-semibold text-white">
                        RM{totals.safeSpend}
                      </h2>
                      <p className="mt-1 text-sm text-white/75">
                        safe to spend
                      </p>
                    </div>
                    <Badi equipped={equipped} />
                  </div>
                  <div className="mt-4 rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
                    <p className="text-sm font-medium text-white">
                      Badi feels calm.
                    </p>
                    <p className="mt-1 text-sm text-white/75">
                      Food spending is moving fast. Review it today to keep your
                      buddy energized.
                    </p>
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold text-white/70">
                    See insight
                  </p>
                </div>
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#6A4DF5] p-5 text-white shadow-xl shadow-[#6A4DF5]/20 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white/75">
                        Today insight
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                      {formatExpenseDate(todayStats.date)}
                    </span>
                  </div>
                  <TodayInsight stats={todayStats} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat
                label="Available"
                value={`RM${totals.available}`}
                isDark={isDark}
              />
              <Stat label="Debt" value={`RM${totals.debt}`} isDark={isDark} />
              <Stat
                label="True"
                value={`RM${totals.trueBalance}`}
                isDark={isDark}
              />
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${theme.title}`}>
                  Daily quests
                </h2>
                <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-sm font-semibold text-[#6A4DF5]">
                  {coins} coins
                </span>
              </div>
              <div className="space-y-3">
                {quests.map((quest) => (
                  <div
                    className={`flex items-center justify-between rounded-3xl border p-4 shadow-sm ${theme.card}`}
                    key={quest.title}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-2xl bg-[#eeeaff] text-[#6A4DF5]">
                        {quest.done ? (
                          <BadgeCheck size={20} />
                        ) : (
                          <Trophy size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {quest.title}
                        </p>
                        <p className={`text-sm ${theme.muted}`}>
                          +{quest.reward} coins
                        </p>
                      </div>
                    </div>
                    <button
                      className="rounded-full bg-[#6A4DF5] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#6A4DF5]/20 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                      disabled={quest.done}
                      onClick={() => completeQuest(quest.reward)}
                    >
                      {quest.done ? 'Done' : 'Do'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'wallets' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Wallets"
              subtitle="Track banks, cash, e-wallets, and pay-later."
              isDark={isDark}
              onAction={openAddWallet}
            />
            <div className="grid grid-cols-2 gap-3 pb-6">
              {accounts.map((account) => (
                <div
                  className="relative min-h-36 rounded-3xl border border-white/10 bg-[#2b2b32] p-4 text-slate-100 shadow-sm"
                  key={account.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold leading-tight">
                        {account.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {account.type}
                      </p>
                    </div>
                    <CardActions
                      onDelete={() => deleteWallet(account.id)}
                      onEdit={() => openEditWallet(account)}
                    />
                  </div>
                  <p
                    className={`mt-8 text-2xl font-semibold tracking-tight ${
                      account.balance < 0
                        ? 'text-rose-300'
                        : ''
                    }`}
                  >
                    RM{account.balance}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {account.balance < 0 ? 'Outstanding' : 'Available balance'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'budgets' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Budgets"
              subtitle="Simple category limits with progress."
              isDark={isDark}
              onAction={openAddBudget}
            />
            <div className="grid grid-cols-2 gap-3 pb-6">
              {budgets.map((budget) => {
                const progress = Math.min(
                  (budget.spent / budget.limit) * 100,
                  100,
                )
                return (
                  <div
                    className="relative min-h-36 rounded-3xl border border-white/10 bg-[#2b2b32] p-4 text-slate-100 shadow-sm"
                    key={budget.id}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold leading-tight">
                          {budget.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          RM{budget.limit - budget.spent} left
                        </p>
                      </div>
                      <CardActions
                        onDelete={() => deleteBudget(budget.id)}
                        onEdit={() => openEditBudget(budget)}
                      />
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-2xl font-semibold tracking-tight">
                          RM{budget.spent}
                        </p>
                        <p className="text-xs text-slate-500">
                          of RM{budget.limit}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#3a3748] px-2.5 py-1 text-xs font-semibold text-[#b9afff]">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#6A4DF5]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {/* <p className="mt-5 text-xl font-semibold">
                      RM{budget.spent}
                    </p>
                    <p className={`text-xs ${theme.muted}`}>
                      of RM{budget.limit}
                    </p>
                    <div className="mt-4 h-2.5 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${budget.color}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    */}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === 'expense' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Add Expense"
              subtitle="Log spending and update your wallet and budget."
              isDark={isDark}
            />
            <form
              className={`space-y-4 rounded-[2rem] border p-4 shadow-sm ${theme.card}`}
              onSubmit={saveExpense}
            >
              <Field label="Amount">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                  inputMode="decimal"
                  onChange={(event) =>
                    setExpenseForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="25"
                  type="number"
                  value={expenseForm.amount}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Paid from">
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-[#202020] px-3 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        accountId: event.target.value,
                      }))
                    }
                    value={expenseForm.accountId}
                  >
                    <option value="">Wallet</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget">
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-[#202020] px-3 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        budgetId: event.target.value,
                      }))
                    }
                    value={expenseForm.budgetId}
                  >
                    <option value="">Category</option>
                    {budgets.map((budget) => (
                      <option key={budget.id} value={budget.id}>
                        {budget.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <div className="relative">
                    <button
                      className="w-full rounded-2xl border border-white/10 bg-[#202020] px-3 py-3 text-left text-slate-100 outline-none focus:border-[#6A4DF5]"
                      onClick={() => setIsCalendarOpen((current) => !current)}
                      type="button"
                    >
                      {formatExpenseDate(expenseForm.date)}
                    </button>
                    {isCalendarOpen && (
                      <CalendarPopover
                        selectedDate={expenseForm.date}
                        onSelect={(date) => {
                          setExpenseForm((current) => ({
                            ...current,
                            date,
                          }))
                          setIsCalendarOpen(false)
                        }}
                      />
                    )}
                  </div>
                </Field>
                <Field label="Note">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-[#202020] px-3 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                    placeholder="Lunch"
                    value={expenseForm.note}
                  />
                </Field>
              </div>
              <button className="w-full rounded-2xl bg-[#6A4DF5] px-4 py-3 font-semibold text-white shadow-lg shadow-[#6A4DF5]/20">
                Save expense
              </button>
            </form>

            <section className="space-y-3 pb-6">
              <div>
                <h2 className={`text-lg font-semibold ${theme.title}`}>
                  Expense history
                </h2>
              </div>
              <div className="flex items-center justify-between gap-3">
                <select
                  className="rounded-2xl border border-[#6A4DF5] bg-[#6A4DF5] px-3 py-2 text-xs font-semibold text-white outline-none"
                  onChange={(event) => setSelectedHistoryMonth(event.target.value)}
                  value={selectedHistoryMonth}
                >
                  {historyMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-4 rounded-2xl bg-[#202020] p-1 text-xs font-semibold">
                  {[1, 2, 3, 4].map((week) => (
                    <button
                      className={`rounded-xl px-4 py-2 ${
                        historyWeek === week
                          ? 'bg-[#6A4DF5] text-white'
                          : 'text-slate-400'
                      }`}
                      key={week}
                      onClick={() => setHistoryWeek(week)}
                      type="button"
                    >
                      W{week}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`rounded-[2rem] border p-4 ${theme.card}`}>
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Weekly spending
                    </p>
                    <p className={`text-xs ${theme.muted}`}>
                      Week {historyWeek} · {formatExpenseMonth(selectedHistoryMonth)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-xs font-semibold text-[#6A4DF5]">
                    Expense
                  </span>
                </div>
                <SpendingGraph points={historyGraphData} variant="card" />
              </div>
              {groupedExpenseHistory.map((monthGroup) => (
                <div className="space-y-3" key={monthGroup.month}>
                  {monthGroup.weeks.map((weekGroup) => (
                    <div className="space-y-2" key={weekGroup.week}>
                      <p className={`text-sm font-medium ${theme.muted}`}>
                        {weekGroup.week}
                      </p>
                      {weekGroup.items.map((expense) => (
                        <div
                          className={`flex items-center justify-between rounded-2xl border p-3 ${theme.card}`}
                          key={expense.id}
                        >
                          <div>
                            <p className="font-semibold">{expense.note}</p>
                            <p className={`text-xs ${theme.muted}`}>
                              {formatExpenseDate(expense.date)} ·{' '}
                              {expense.budgetName} · {expense.accountName}
                            </p>
                          </div>
                          <p className="font-semibold text-rose-300">
                            -RM{expense.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </section>
        )}

        {activeTab === 'closet' && (
          <section className="h-full">
            <div className="relative h-full overflow-hidden bg-[#241c46] shadow-xl shadow-slate-300/60">
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(135deg,rgba(255,255,255,.22)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.22)_50%,rgba(255,255,255,.22)_62%,transparent_62%,transparent)] [background-size:28px_28px]" />
              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  <CoinsIcon />
                  {coins}
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  Mood: {badiMood}
                </div>
              </div>
              <div className="relative px-5 pt-20 text-center">
                <h2 className="text-lg font-black tracking-wide text-white [text-shadow:0_2px_0_rgba(0,0,0,.35)]">
                  Badi Closet
                </h2>
                <div className="mt-14">
                  <Badi equipped={equipped} large />
                </div>
                <div className="hidden">
                  <p className="text-sm font-semibold text-slate-950">
                    Equipped
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {equipped.outfit} · {equipped.accessory} · {equipped.room}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-5 left-0 right-0 z-10 grid grid-cols-3 px-8">
                <ClosetDockButton icon={Shirt} label="Closet" tone="violet" />
                <ClosetDockButton icon={Home} label="Room" tone="sky" />
                <ClosetDockButton icon={ShoppingBag} label="Shop" tone="gold" />
              </div>
            </div>
          </section>
        )}
      </section>

      <nav
        className={`fixed bottom-0 left-1/2 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t px-3 pb-4 pt-2 ${theme.nav}`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          const isAdd = tab.id === 'expense'
          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium ${
                isAdd
                  ? 'text-[#6A4DF5]'
                  : selected
                    ? 'bg-[#eeeaff] text-[#6A4DF5]'
                    : theme.navIdle
              }`}
              key={tab.id}
              onClick={tab.action || (() => setActiveTab(tab.id))}
            >
              <span
                className={
                  isAdd
                    ? 'grid size-10 place-items-center rounded-full bg-[#6A4DF5] text-white shadow-lg shadow-[#6A4DF5]/30'
                    : ''
                }
              >
                <Icon size={isAdd ? 24 : 19} />
              </span>
              {tab.label}
            </button>
          )
        })}
      </nav>

      {activeForm === 'wallet' && (
        <FormSheet
          title={editingId ? 'Edit Wallet' : 'Add Wallet'}
          onClose={closeForm}
        >
          <form className="space-y-4" onSubmit={saveWallet}>
            <Field label="Wallet name">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                onChange={(event) =>
                  setWalletForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Maybank, Cash, TNG..."
                value={walletForm.name}
              />
            </Field>
            <Field label="Wallet type">
              <select
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                onChange={(event) =>
                  setWalletForm((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
                value={walletForm.type}
              >
                <option>Bank</option>
                <option>Cash</option>
                <option>E-wallet</option>
                <option>Saving</option>
                <option>Pay later</option>
                <option>Credit</option>
              </select>
            </Field>
            <Field label="Current balance">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                inputMode="decimal"
                onChange={(event) =>
                  setWalletForm((current) => ({
                    ...current,
                    balance: event.target.value,
                  }))
                }
                placeholder="0"
                type="number"
                value={walletForm.balance}
              />
            </Field>
            <button className="w-full rounded-2xl bg-[#6A4DF5] px-4 py-3 font-semibold text-white shadow-lg shadow-[#6A4DF5]/20">
              {editingId ? 'Update wallet' : 'Save wallet'}
            </button>
          </form>
        </FormSheet>
      )}

      {activeForm === 'budget' && (
        <FormSheet
          title={editingId ? 'Edit Budget' : 'Add Budget'}
          onClose={closeForm}
        >
          <form className="space-y-4" onSubmit={saveBudget}>
            <Field label="Budget category">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Food, bills, transport..."
                value={budgetForm.name}
              />
            </Field>
            <Field label="Monthly limit">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                inputMode="decimal"
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    limit: event.target.value,
                  }))
                }
                placeholder="500"
                type="number"
                value={budgetForm.limit}
              />
            </Field>
            <button className="w-full rounded-2xl bg-[#6A4DF5] px-4 py-3 font-semibold text-white shadow-lg shadow-[#6A4DF5]/20">
              {editingId ? 'Update budget' : 'Save budget'}
            </button>
          </form>
        </FormSheet>
      )}

    </main>
  )
}

function BadiNavIcon({ size = 19 }) {
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full bg-[#dcd5ff]" />
      <span className="absolute bottom-[1px] h-[82%] w-[72%] rounded-[42%] bg-[#f8cda7]">
        <span className="absolute left-[25%] top-[38%] size-[3px] rounded-full bg-slate-950" />
        <span className="absolute right-[25%] top-[38%] size-[3px] rounded-full bg-slate-950" />
        <span className="absolute left-1/2 top-[58%] h-[3px] w-[8px] -translate-x-1/2 rounded-b-full border-b-2 border-slate-950" />
        <span className="absolute bottom-0 left-1/2 h-[5px] w-[13px] -translate-x-1/2 rounded-t-full bg-[#6A4DF5]" />
      </span>
    </span>
  )
}

function getSpendingGraphData(expenses, selectedMonth, selectedWeek = null) {
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

  const points = Object.entries(byDate)
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

  if (points.length > 1) return points
  if (points.length === 1) {
    return [
      { ...points[0], amount: Math.max(points[0].amount * 0.55, 1) },
      points[0],
    ]
  }

  return [
    { date: `${selectedMonth}-07`, amount: 12, label: '07' },
    { date: `${selectedMonth}-14`, amount: 28, label: '14' },
    { date: `${selectedMonth}-21`, amount: 18, label: '21' },
    { date: `${selectedMonth}-28`, amount: 36, label: '28' },
  ]
}

function getTodayStats(expenses, safeSpend) {
  const today = new Date().toISOString().slice(0, 10)
  const latestExpenseDate = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.date
  const hasTodayExpenses = expenses.some((expense) => expense.date === today)
  const targetDate = hasTodayExpenses ? today : latestExpenseDate || today
  const dayExpenses = expenses.filter((expense) => expense.date === targetDate)
  const spent = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = Math.max(safeSpend - spent, 0)
  const progress = Math.min((spent / Math.max(safeSpend, 1)) * 100, 100)
  const categoryTotals = dayExpenses.reduce((totals, expense) => {
    totals[expense.budgetName] = (totals[expense.budgetName] || 0) + expense.amount
    return totals
  }, {})
  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  const status =
    progress >= 100 ? 'Over limit' : progress >= 75 ? 'Watch spending' : 'On track'

  return {
    count: dayExpenses.length,
    date: targetDate,
    progress,
    remaining,
    safeSpend,
    spent,
    status,
    topCategory,
  }
}

function TodayInsight({ stats }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (stats.progress / 100) * circumference

  return (
    <div className="mt-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15">
      <div className="flex items-center gap-4">
        <div className="relative grid size-28 shrink-0 place-items-center">
          <svg className="size-28 -rotate-90" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              fill="none"
              r={radius}
              stroke="rgba(255,255,255,.18)"
              strokeWidth="12"
            />
            <circle
              cx="56"
              cy="56"
              fill="none"
              r={radius}
              stroke="white"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              strokeWidth="12"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xl font-bold leading-none">RM{stats.spent}</p>
              <p className="mt-1 text-[11px] font-semibold text-white/65">
                spent
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <InsightPill label="Left today" value={`RM${stats.remaining}`} />
          <InsightPill label="Top category" value={stats.topCategory} />
          <InsightPill label="Daily status" value={stats.status} />
        </div>
      </div>
    </div>
  )
}

function InsightPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2">
      <p className="text-[11px] font-medium text-white/60">{label}</p>
      <p className="truncate text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function SpendingGraph({ points, variant = 'purple' }) {
  const isCard = variant === 'card'
  const maxAmount = Math.max(...points.map((point) => point.amount), 1)
  const width = 320
  const height = 116
  const chartPoints = points.map((point, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
    const y = height - (point.amount / maxAmount) * (height - 22) - 10
    return { ...point, x, y }
  })
  const line = chartPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <div
      className={`mt-4 rounded-3xl p-3 ${
        isCard ? 'bg-[#202020]' : 'bg-white/10 ring-1 ring-white/15'
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className={isCard ? 'font-semibold text-slate-100' : 'font-semibold text-white'}>
          Daily spending
        </span>
        <span className={isCard ? 'text-slate-400' : 'text-white/70'}>
          Peak RM{maxAmount}
        </span>
      </div>
      <svg
        className="h-32 w-full overflow-visible"
        viewBox={`0 0 ${width} ${height + 22}`}
      >
        {[0, 1, 2].map((lineIndex) => (
          <line
            key={lineIndex}
            stroke={isCard ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.14)'}
            strokeDasharray="4 6"
            x1="0"
            x2={width}
            y1={20 + lineIndex * 44}
            y2={20 + lineIndex * 44}
          />
        ))}
        <path d={area} fill={isCard ? 'rgba(106,77,245,.2)' : 'rgba(255,255,255,.14)'} />
        <path
          d={line}
          fill="none"
          stroke={isCard ? '#8f7dff' : 'white'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        {chartPoints.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} fill="#6A4DF5" r="7" />
            <circle cx={point.x} cy={point.y} fill={isCard ? '#f8fafc' : 'white'} r="3" />
            <text
              fill={isCard ? 'rgba(226,232,240,.72)' : 'rgba(255,255,255,.72)'}
              fontSize="11"
              textAnchor="middle"
              x={point.x}
              y={height + 18}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function formatExpenseDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  })
}

function formatCalendarTitle(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
}

function getCalendarDays(dateString) {
  const selected = new Date(`${dateString}T00:00:00`)
  const year = selected.getFullYear()
  const month = selected.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const blanks = Array.from({ length: firstDay }, (_, index) => ({
    key: `blank-${index}`,
    value: null,
  }))
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    return {
      key: `${year}-${month}-${day}`,
      value: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      label: day,
    }
  })

  return [...blanks, ...days]
}

function CalendarPopover({ onSelect, selectedDate }) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-3xl border border-white/10 bg-[#2f2e38] p-3 shadow-2xl shadow-black/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">
          {formatCalendarTitle(selectedDate)}
        </p>
        <button
          className="rounded-xl bg-[#202020] px-3 py-1 text-xs font-semibold text-slate-300"
          onClick={() => onSelect(new Date().toISOString().slice(0, 10))}
          type="button"
        >
          Today
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {getCalendarDays(selectedDate).map((day) =>
          day.value ? (
            <button
              className={`grid aspect-square place-items-center rounded-xl text-sm font-semibold ${
                day.value === selectedDate
                  ? 'bg-[#6A4DF5] text-white'
                  : 'bg-[#202020] text-slate-300'
              }`}
              key={day.key}
              onClick={() => onSelect(day.value)}
              type="button"
            >
              {day.label}
            </button>
          ) : (
            <span key={day.key} />
          ),
        )}
      </div>
    </div>
  )
}

function getWeekOfMonth(date) {
  return Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)
}

function getExpenseMonthKey(dateString) {
  return dateString.slice(0, 7)
}

function formatExpenseMonth(monthKey) {
  const date = new Date(`${monthKey}-01T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
}

function getExpenseMonths(expenses) {
  return [...new Set(expenses.map((expense) => getExpenseMonthKey(expense.date)))]
    .sort((a, b) => b.localeCompare(a))
    .map((month) => ({
      value: month,
      label: formatExpenseMonth(month),
    }))
}

function groupExpenses(expenses, selectedWeek, selectedMonth) {
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

function Badi({ equipped, large = false }) {
  return (
    <div
      className={`relative mx-auto grid place-items-center ${
        large ? 'size-44' : 'size-32'
      }`}
      aria-label="MoneyBadi character"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f1edff] to-[#dcd5ff]" />
      <div className="relative h-[72%] w-[66%] rounded-[42%] bg-[#f8cda7] shadow-md">
        <div className="absolute left-1/2 top-3 h-5 w-16 -translate-x-1/2 rounded-full bg-[#6A4DF5] text-[0px]">
          {equipped.accessory}
        </div>
        <div className="absolute left-[27%] top-[36%] size-3 rounded-full bg-slate-950" />
        <div className="absolute right-[27%] top-[36%] size-3 rounded-full bg-slate-950" />
        <div className="absolute left-1/2 top-[55%] h-3 w-8 -translate-x-1/2 rounded-b-full border-b-4 border-slate-950" />
        <div className="absolute bottom-0 left-1/2 h-10 w-20 -translate-x-1/2 rounded-t-3xl bg-[#6A4DF5]">
          <span className="sr-only">{equipped.outfit}</span>
        </div>
      </div>
    </div>
  )
}

function CoinsIcon() {
  return (
    <span className="grid size-6 place-items-center rounded-full bg-[#6A4DF5] text-xs font-black text-white">
      $
    </span>
  )
}

function ClosetDockButton({ icon: Icon, label, tone }) {
  const tones = {
    gold: 'from-amber-200 to-orange-300 text-amber-950 shadow-orange-950/25',
    sky: 'from-sky-200 to-cyan-300 text-sky-950 shadow-sky-950/25',
    violet: 'from-violet-200 to-[#b6a7ff] text-[#322070] shadow-violet-950/25',
  }

  return (
    <button
      className="group flex flex-col items-center gap-1 justify-self-center text-xs font-black text-white [text-shadow:0_2px_0_rgba(0,0,0,.35)]"
      type="button"
    >
      <div
        className={`grid size-[4.35rem] place-items-center rounded-full border-[3px] border-white bg-gradient-to-b ${tones[tone]} shadow-xl transition-transform group-active:translate-y-1`}
      >
        <div className="grid size-12 place-items-center rounded-full bg-white/35 ring-1 ring-white/45">
          <Icon size={27} strokeWidth={2.8} />
        </div>
      </div>
      <span className="rounded-full bg-black/20 px-3 py-0.5 backdrop-blur-sm">
        {label}
      </span>
    </button>
  )
}

function CardActions({ onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-9 z-20 w-28 overflow-hidden rounded-2xl border border-white/10 bg-[#202020] p-1 shadow-xl shadow-black/30">
          <button
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-white/10"
            onClick={() => {
              setIsOpen(false)
              onEdit()
            }}
            type="button"
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-300 hover:bg-white/10"
            onClick={() => {
              setIsOpen(false)
              onDelete()
            }}
            type="button"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, isDark }) {
  return (
    <div
      className={`rounded-3xl border p-3 shadow-sm ${
        isDark
          ? 'border-white/10 bg-[#2f2e38] text-slate-100'
          : 'border-slate-200 bg-white text-slate-950'
      }`}
    >
      <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

function FormSheet({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50">
      <section className="w-full max-w-md rounded-t-[2rem] border border-white/10 bg-[#2f2e38] p-5 text-slate-100 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="grid size-10 place-items-center rounded-full bg-[#202020] text-slate-300"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  )
}

function ActionHeader({ icon: Icon, title, subtitle, isDark, onAction }) {
  return (
    <div
      className={`flex items-center justify-between rounded-[2rem] p-5 text-white shadow-lg ${
        isDark ? 'bg-[#171717] shadow-black/30' : 'bg-[#24232d] shadow-slate-300/40'
      }`}
    >
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      </div>
      {onAction && (
        <button
          className="grid size-11 place-items-center rounded-full bg-white text-[#6A4DF5]"
          onClick={onAction}
          type="button"
        >
          <Icon size={20} />
        </button>
      )}
    </div>
  )
}

export default App
