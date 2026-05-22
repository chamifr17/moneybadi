import {
  BadgeCheck,
  Banknote,
  Edit3,
  Home,
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
  const [historyFilter, setHistoryFilter] = useState('month')
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState('2026-05')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
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
  const groupedExpenseHistory = groupExpenses(
    expenses,
    historyFilter,
    selectedHistoryMonth,
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
            <div className="rounded-[2rem] bg-[#6A4DF5] p-5 text-white shadow-xl shadow-[#6A4DF5]/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/75">Today</p>
                  <h2 className="mt-1 text-3xl font-semibold text-white">
                    RM{totals.safeSpend}
                  </h2>
                  <p className="mt-1 text-sm text-white/75">safe to spend</p>
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
                  className={`min-h-40 rounded-2xl border p-4 shadow-sm ${theme.card}`}
                  key={account.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`grid size-12 place-items-center rounded-xl ${account.tone} text-[#6A4DF5]`}
                    >
                      <Banknote size={21} />
                    </div>
                    <CardActions
                      onDelete={() => deleteWallet(account.id)}
                      onEdit={() => openEditWallet(account)}
                    />
                  </div>
                  <p className="mt-4 text-base font-semibold leading-tight">
                    {account.name}
                  </p>
                  <p className={`mt-1 text-sm ${theme.muted}`}>
                    {account.type}
                  </p>
                  <p
                    className={`mt-5 text-xl font-semibold ${
                      account.balance < 0
                        ? isDark
                          ? 'text-rose-300'
                          : 'text-rose-600'
                        : ''
                    }`}
                  >
                    RM{account.balance}
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
                    className={`min-h-40 rounded-2xl border p-4 shadow-sm ${theme.card}`}
                    key={budget.id}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold leading-tight">
                          {budget.name}
                        </p>
                        <p className={`mt-1 text-sm ${theme.muted}`}>
                          RM{budget.limit - budget.spent} left
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="rounded-full bg-[#eeeaff] px-2 py-1 text-xs font-semibold text-[#6A4DF5]">
                          {Math.round(progress)}%
                        </span>
                        <CardActions
                          onDelete={() => deleteBudget(budget.id)}
                          onEdit={() => openEditBudget(budget)}
                        />
                      </div>
                    </div>
                    <p className="mt-5 text-xl font-semibold">
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
              <h2 className={`text-lg font-semibold ${theme.title}`}>
                Expense history
              </h2>
              <div className="flex items-center justify-between gap-2">
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
                <div className="grid grid-cols-3 rounded-2xl bg-[#202020] p-1 text-xs font-semibold">
                  {['day', 'week', 'month'].map((filter) => (
                    <button
                      className={`rounded-xl px-3 py-2 capitalize ${
                        historyFilter === filter
                          ? 'bg-[#6A4DF5] text-white'
                          : 'text-slate-400'
                      }`}
                      key={filter}
                      onClick={() => setHistoryFilter(filter)}
                      type="button"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
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

              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-3 bg-white/10 p-4 backdrop-blur">
                <ClosetDockButton icon={Shirt} label="Closet" />
                <ClosetDockButton icon={Home} label="Room" />
                <ClosetDockButton icon={ShoppingBag} label="Shop" />
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

function groupExpenses(expenses, filter, selectedMonth) {
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
  const months = []

  sorted
    .filter((expense) => getExpenseMonthKey(expense.date) === selectedMonth)
    .forEach((expense) => {
    const date = new Date(`${expense.date}T00:00:00`)
    const month = date.toLocaleDateString('en-MY', {
      month: 'long',
      year: 'numeric',
    })
    const week =
      filter === 'day'
        ? formatExpenseDate(expense.date)
        : filter === 'week'
          ? `Week ${getWeekOfMonth(date)}`
          : 'All expenses'
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

function ClosetDockButton({ icon: Icon, label }) {
  return (
    <button className="flex flex-col items-center gap-1 rounded-3xl border border-white/50 bg-white p-3 text-xs font-bold text-slate-800 shadow-lg">
      <div className="grid size-12 place-items-center rounded-2xl bg-[#eeeaff] text-[#6A4DF5]">
        <Icon size={24} />
      </div>
      {label}
    </button>
  )
}

function CardActions({ onDelete, onEdit }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="grid size-8 place-items-center rounded-xl bg-white/10 text-slate-300 hover:text-white"
        onClick={onEdit}
        type="button"
      >
        <Edit3 size={15} />
      </button>
      <button
        className="grid size-8 place-items-center rounded-xl bg-white/10 text-rose-300 hover:text-rose-200"
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={15} />
      </button>
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
