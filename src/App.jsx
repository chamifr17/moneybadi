import {
  BadgeCheck,
  Edit3,
  Lock,
  LogOut,
  Mail,
  Home,
  Glasses,
  MoreHorizontal,
  Moon,
  Palette,
  Plus,
  Sun,
  Target,
  Trash2,
  Trophy,
  User,
  WalletCards,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const loadedUserRef = useRef('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: 'Chami',
    email: 'chami@pennymon.app',
  })
  const [dataError, setDataError] = useState('')
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [coins, setCoins] = useState(0)
  const [activeForm, setActiveForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [historyWeek, setHistoryWeek] = useState(1)
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState('2026-05')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSpendCardFlipped, setIsSpendCardFlipped] = useState(false)
  const [swipedExpenseId, setSwipedExpenseId] = useState(null)
  const [touchStartX, setTouchStartX] = useState(null)
  const [draggedExpense, setDraggedExpense] = useState({
    id: null,
    offset: 0,
  })
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
  const [equipped, setEquipped] = useState({
    accessory: 'Round glasses',
    room: 'Cozy desk',
  })

  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])

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
    safeSpend: calculateSafeSpend(accounts, budgets),
  }
  const pennyMonMood = totals.safeSpend >= 40 ? 'Calm' : 'Careful'
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
  const hasCompletedSetup = accounts.length > 0 && budgets.length > 0

  useEffect(() => {
    const setUserFromSession = (session) => {
      const user = session?.user

      if (!user) {
        setIsAuthenticated(false)
        setCurrentUser({ id: '', name: 'Chami', email: 'chami@pennymon.app' })
        return
      }

      setCurrentUser({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      })
      setIsAuthenticated(true)
    }

    supabase.auth.getSession().then(({ data }) => {
      setUserFromSession(data.session)
      setIsAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session)
      setIsAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadMoneyData = useCallback(async (userId) => {
    setIsDataLoading(true)
    setDataError('')

    const [
      { data: walletRows, error: walletError },
      { data: budgetRows, error: budgetError },
      { data: expenseRows, error: expenseError },
      { data: profileRow, error: profileError },
    ] = await Promise.all([
      supabase.from('wallets').select('*').order('created_at', { ascending: true }),
      supabase.from('budgets').select('*').order('created_at', { ascending: true }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('pennymon_profiles').select('*').eq('user_id', userId).maybeSingle(),
    ])

    const error = walletError || budgetError || expenseError || profileError
    if (error) {
      setDataError(error.message)
      setIsDataLoading(false)
      return
    }

    setAccounts(walletRows.map(mapWalletRow))
    setBudgets(budgetRows.map(mapBudgetRow))
    setExpenses(expenseRows.map(mapExpenseRow))

    if (profileRow) {
      setCoins(profileRow.coins)
      setEquipped({
        accessory: profileRow.accessory,
        room: profileRow.room,
      })
    }

    setIsDataLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !currentUser.id) return
    if (loadedUserRef.current === currentUser.id) return

    loadedUserRef.current = currentUser.id

    const timeoutId = window.setTimeout(() => {
      loadMoneyData(currentUser.id)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [currentUser.id, isAuthenticated, loadMoneyData])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setExpenseForm((current) => ({
        ...current,
        accountId: current.accountId || accounts[0]?.id || '',
        budgetId: current.budgetId || budgets[0]?.id || '',
      }))
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [accounts, budgets])

  const submitAuth = async (event) => {
    event.preventDefault()
    if (!authForm.email.trim() || !authForm.password.trim()) return

    setAuthError('')
    setAuthNotice('')
    setIsAuthLoading(true)

    const authRequest =
      authMode === 'signup'
        ? supabase.auth.signUp({
            email: authForm.email.trim(),
            password: authForm.password,
            options: {
              data: {
                full_name: authForm.name.trim() || authForm.email.split('@')[0],
              },
            },
          })
        : supabase.auth.signInWithPassword({
            email: authForm.email.trim(),
            password: authForm.password,
          })

    const { data, error } = await authRequest

    if (error) {
      setAuthError(error.message)
      setIsAuthLoading(false)
      return
    }

    if (authMode === 'signup') {
      if (data.session) {
        await supabase.auth.signOut()
        setIsAuthenticated(false)
      }
      setAuthMode('login')
      setAuthForm((current) => ({
        name: '',
        email: current.email,
        password: '',
      }))
      setAuthNotice('Account created. Login with your registered credentials.')
      setIsAuthLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    loadedUserRef.current = ''
    setIsAuthenticated(false)
    setActiveTab('home')
    setActiveForm(null)
    setEditingId(null)
    setAuthForm({ name: '', email: '', password: '' })
    setAuthError('')
    setAuthNotice('')
  }

  const completeQuest = async (coinReward) => {
    const nextCoins = coins + coinReward
    setCoins(nextCoins)

    if (!currentUser.id) return

    const { error } = await supabase
      .from('pennymon_profiles')
      .upsert(
        {
          user_id: currentUser.id,
          coins: nextCoins,
          mood: pennyMonMood,
          accessory: equipped.accessory,
          room: equipped.room,
        },
        { onConflict: 'user_id' },
      )

    if (error) setDataError(error.message)
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

  const deleteWallet = async (id) => {
    const { error } = await supabase.from('wallets').delete().eq('id', id)

    if (error) {
      setDataError(error.message)
      return
    }

    setAccounts((current) => current.filter((account) => account.id !== id))
  }

  const deleteBudget = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)

    if (error) {
      setDataError(error.message)
      return
    }

    setBudgets((current) => current.filter((budget) => budget.id !== id))
  }

  const saveWallet = async (event) => {
    event.preventDefault()
    const amount = Number(walletForm.balance)
    if (!currentUser.id || !walletForm.name.trim() || Number.isNaN(amount)) return

    const shouldBeDebt = ['Credit', 'Pay later'].includes(walletForm.type)
    const walletData = {
      name: walletForm.name.trim(),
      type: walletForm.type,
      balance: shouldBeDebt && amount > 0 ? -amount : amount,
      tone: shouldBeDebt ? 'bg-rose-50' : 'bg-[#eeeaff]',
    }

    if (editingId) {
      const { data, error } = await supabase
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

      if (error) {
        setDataError(error.message)
        return
      }

      setAccounts((current) =>
        current.map((account) =>
          account.id === editingId ? mapWalletRow(data) : account,
        ),
      )
    } else {
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: currentUser.id,
          name: walletData.name,
          type: walletData.type,
          balance: walletData.balance,
          tone: walletData.tone,
        })
        .select()
        .single()

      if (error) {
        setDataError(error.message)
        return
      }

      setAccounts((current) => [mapWalletRow(data), ...current])
    }
    closeForm()
  }

  const saveBudget = async (event) => {
    event.preventDefault()
    const limit = Number(budgetForm.limit)
    if (!currentUser.id || !budgetForm.name.trim() || Number.isNaN(limit) || limit <= 0) return

    if (editingId) {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          name: budgetForm.name.trim(),
          limit_amount: limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId)
        .select()
        .single()

      if (error) {
        setDataError(error.message)
        return
      }

      setBudgets((current) =>
        current.map((budget) =>
          budget.id === editingId ? mapBudgetRow(data) : budget,
        ),
      )
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: currentUser.id,
          name: budgetForm.name.trim(),
          spent: 0,
          limit_amount: limit,
          color: 'bg-[#6A4DF5]',
        })
        .select()
        .single()

      if (error) {
        setDataError(error.message)
        return
      }

      setBudgets((current) => [mapBudgetRow(data), ...current])
    }
    closeForm()
  }

  const saveExpense = async (event) => {
    event.preventDefault()
    const amount = Number(expenseForm.amount)
    const accountId = expenseForm.accountId
    const budgetId = expenseForm.budgetId
    const account = accounts.find((item) => item.id === accountId)
    const budget = budgets.find((item) => item.id === budgetId)

    if (!currentUser.id || Number.isNaN(amount) || amount <= 0 || !account || !budget) return

    const nextAccountBalance = account.balance - amount
    const nextBudgetSpent = budget.spent + amount

    const [
      { data: walletRow, error: walletError },
      { data: budgetRow, error: budgetError },
      { data: expenseRow, error: expenseError },
    ] = await Promise.all([
      supabase
        .from('wallets')
        .update({
          balance: nextAccountBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', accountId)
        .select()
        .single(),
      supabase
        .from('budgets')
        .update({
          spent: nextBudgetSpent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', budgetId)
        .select()
        .single(),
      supabase
        .from('expenses')
        .insert({
          user_id: currentUser.id,
          wallet_id: accountId,
          budget_id: budgetId,
          account_name: account.name,
          budget_name: budget.name,
          amount,
          date: expenseForm.date || new Date().toISOString().slice(0, 10),
          note: expenseForm.note.trim() || 'Expense',
        })
        .select()
        .single(),
    ])

    const error = walletError || budgetError || expenseError
    if (error) {
      setDataError(error.message)
      return
    }

    setAccounts((current) =>
      current.map((account) =>
        account.id === accountId
          ? mapWalletRow(walletRow)
          : account,
      ),
    )
    setBudgets((current) =>
      current.map((budget) =>
        budget.id === budgetId
          ? mapBudgetRow(budgetRow)
          : budget,
      ),
    )
    setExpenses((current) => [mapExpenseRow(expenseRow), ...current])
    setSelectedHistoryMonth(getExpenseMonthKey(expenseRow.date))
    setHistoryWeek(getWeekOfMonth(new Date(`${expenseRow.date}T00:00:00`)))
    setExpenseForm({
      amount: '',
      accountId: accounts[0]?.id ? String(accounts[0].id) : '',
      budgetId: budgets[0]?.id ? String(budgets[0].id) : '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    })
    setIsCalendarOpen(false)
  }

  const deleteExpense = async (expense) => {
    const account = accounts.find((item) => item.id === expense.walletId)
    const budget = budgets.find((item) => item.id === expense.budgetId)
    const nextAccountBalance = account ? account.balance + expense.amount : null
    const nextBudgetSpent = budget
      ? Math.max(budget.spent - expense.amount, 0)
      : null

    const requests = [
      supabase.from('expenses').delete().eq('id', expense.id),
    ]

    if (account) {
      requests.push(
        supabase
          .from('wallets')
          .update({
            balance: nextAccountBalance,
            updated_at: new Date().toISOString(),
          })
          .eq('id', account.id)
          .select()
          .single(),
      )
    }

    if (budget) {
      requests.push(
        supabase
          .from('budgets')
          .update({
            spent: nextBudgetSpent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', budget.id)
          .select()
          .single(),
      )
    }

    const results = await Promise.all(requests)
    const error = results.find((result) => result.error)?.error

    if (error) {
      setDataError(error.message)
      return
    }

    setExpenses((current) => current.filter((item) => item.id !== expense.id))
    if (account) {
      setAccounts((current) =>
        current.map((item) =>
          item.id === account.id
            ? mapWalletRow(results[1].data)
            : item,
        ),
      )
    }
    if (budget) {
      setBudgets((current) =>
        current.map((item) =>
          item.id === budget.id
            ? mapBudgetRow(results[account ? 2 : 1].data)
            : item,
        ),
      )
    }
    setSwipedExpenseId(null)
    setDraggedExpense({ id: null, offset: 0 })
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallets', label: 'Wallets', icon: WalletCards },
    { id: 'expense', label: 'Add', icon: Plus },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'pennymon', label: 'PennyMon', icon: PennyMonNavIcon },
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

  if (!isAuthenticated) {
    return (
      <AuthScreen
        authError={authError}
        authForm={authForm}
        authMode={authMode}
        authNotice={authNotice}
        isLoading={isAuthLoading}
        onChange={setAuthForm}
        onModeChange={(mode) => {
          setAuthMode(mode)
          setAuthError('')
          setAuthNotice('')
        }}
        onSubmit={submitAuth}
      />
    )
  }

  return (
    <main
      className={`mx-auto flex h-dvh max-w-md flex-col overflow-hidden shadow-2xl ${theme.app} ${theme.shadow}`}
    >
      {activeTab !== 'pennymon' && (
        <header className="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <p className="text-sm font-semibold text-[#6A4DF5]">PennyMon</p>
            <h1 className={`text-2xl font-semibold ${theme.title}`}>
              Hi, {currentUser.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`grid size-11 place-items-center rounded-full border shadow-sm ${theme.card}`}
              onClick={() => setIsDark((current) => !current)}
              type="button"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className={`grid size-11 place-items-center rounded-full border shadow-sm ${theme.card}`}
              onClick={logout}
              type="button"
            >
              <LogOut size={19} />
            </button>
          </div>
        </header>
      )}

      {activeTab !== 'pennymon' && (isDataLoading || dataError) && (
        <div className={`px-5 pb-3 ${theme.page}`}>
          <p
            className={`rounded-2xl border px-3 py-2 text-xs font-semibold ${
              dataError
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                : 'border-white/10 bg-[#2f2e38] text-slate-300'
            }`}
          >
            {dataError || 'Syncing your PennyMon data...'}
          </p>
        </div>
      )}

      <section
        className={
          activeTab === 'pennymon'
            ? 'min-h-0 flex-1 overflow-hidden'
            : `min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5 ${theme.page}`
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
                    <PennyMonPet equipped={equipped} />
                  </div>
                  <div className="mt-4 rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
                    <p className="text-sm font-medium text-white">
                      PennyMon feels calm.
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
            <div className="space-y-3 pb-6">
              {!accounts.length && (
                <SetupHint
                  message="Add your first wallet before logging expenses or customizing PennyMon."
                />
              )}
              {accounts.map((account) => (
                <div
                  className="relative rounded-2xl border border-white/10 bg-[#2b2b32] p-3 text-slate-100 shadow-sm"
                  key={account.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">
                        {account.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {account.type}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold tracking-tight ${
                            account.balance < 0
                              ? 'text-rose-300'
                              : ''
                          }`}
                        >
                          RM{account.balance}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {account.balance < 0 ? 'Outstanding' : 'Available'}
                        </p>
                      </div>
                      <CardActions
                        onDelete={() => deleteWallet(account.id)}
                        onEdit={() => openEditWallet(account)}
                      />
                    </div>
                  </div>
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
            <div className="space-y-3 pb-6">
              {!budgets.length && (
                <SetupHint
                  message="Create your first budget to unlock expenses and PennyMon."
                />
              )}
              {budgets.map((budget) => {
                const progress = Math.min(
                  (budget.spent / budget.limit) * 100,
                  100,
                )
                return (
                  <div
                    className="relative rounded-2xl border border-white/10 bg-[#2b2b32] p-3 text-slate-100 shadow-sm"
                    key={budget.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold leading-tight">
                          {budget.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          RM{budget.spent} / RM{budget.limit}
                        </p>
                      </div>
                      <CardActions
                        onDelete={() => deleteBudget(budget.id)}
                        onEdit={() => openEditBudget(budget)}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#6A4DF5]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-semibold text-[#b9afff]">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      RM{Math.max(budget.limit - budget.spent, 0)} left
                    </p>
                    {/* <div className="mt-4 h-1.5 rounded-full bg-white/10">
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
                  <button
                    className="w-full rounded-2xl border border-white/10 bg-[#202020] px-3 py-3 text-left text-slate-100 outline-none focus:border-[#6A4DF5]"
                    onClick={() => setIsCalendarOpen(true)}
                    type="button"
                  >
                    {formatExpenseDate(expenseForm.date)}
                  </button>
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

            {isCalendarOpen && (
              <CalendarPopover
                selectedDate={expenseForm.date}
                onClose={() => setIsCalendarOpen(false)}
                onSelect={(date) => {
                  setExpenseForm((current) => ({
                    ...current,
                    date,
                  }))
                  setIsCalendarOpen(false)
                }}
              />
            )}

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
                      {formatWeekRange(selectedHistoryMonth, historyWeek)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-xs font-semibold text-[#6A4DF5]">
                    Expense
                  </span>
                </div>
                {historyGraphData.length ? (
                  <SpendingGraph points={historyGraphData} variant="card" />
                ) : (
                  <EmptyGraphState />
                )}
              </div>
              {groupedExpenseHistory.map((monthGroup) => (
                <div className="space-y-3" key={monthGroup.month}>
                  {monthGroup.weeks.map((weekGroup) => (
                    <div className="space-y-2" key={weekGroup.week}>
                      <p className={`text-sm font-medium ${theme.muted}`}>
                        {weekGroup.week}
                      </p>
                      {weekGroup.items.map((expense) => (
                        <div className="relative overflow-hidden rounded-2xl bg-[#8f1d2c]" key={expense.id}>
                          <button
                            className="absolute inset-y-0 right-0 grid w-20 place-items-center text-sm font-bold text-white"
                            onClick={() => deleteExpense(expense)}
                            type="button"
                          >
                            Delete
                          </button>
                          <div
                            className={`relative flex touch-pan-y items-center justify-between rounded-2xl border p-3 will-change-transform ${theme.card}`}
                            onTouchEnd={(event) => {
                              if (touchStartX === null) return
                              const deltaX = event.changedTouches[0].clientX - touchStartX
                              setSwipedExpenseId(deltaX < -42 ? expense.id : null)
                              setDraggedExpense({ id: null, offset: 0 })
                              if (deltaX > 42) setSwipedExpenseId(null)
                              setTouchStartX(null)
                            }}
                            onTouchMove={(event) => {
                              if (touchStartX === null) return
                              const deltaX = event.touches[0].clientX - touchStartX
                              const offset = Math.max(Math.min(deltaX, 0), -86)
                              setDraggedExpense({ id: expense.id, offset })
                            }}
                            onTouchStart={(event) => {
                              setTouchStartX(event.touches[0].clientX)
                              setSwipedExpenseId(null)
                            }}
                            style={{
                              transform:
                                draggedExpense.id === expense.id
                                  ? `translateX(${draggedExpense.offset}px)`
                                  : swipedExpenseId === expense.id
                                    ? 'translateX(-80px)'
                                    : 'translateX(0)',
                              transition:
                                draggedExpense.id === expense.id
                                  ? 'none'
                                  : 'transform 420ms cubic-bezier(.22,1,.36,1)',
                            }}
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
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </section>
        )}

        {activeTab === 'pennymon' && (
          <section className="relative h-full overflow-hidden">
            <div className="absolute inset-0 overflow-hidden bg-[#241c46] shadow-xl shadow-slate-300/60">
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(135deg,rgba(255,255,255,.22)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.22)_50%,rgba(255,255,255,.22)_62%,transparent_62%,transparent)] [background-size:28px_28px]" />
              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  <CoinsIcon />
                  {coins}
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  Mood: {pennyMonMood}
                </div>
              </div>
              <div className="relative px-5 pt-20 text-center">
                <h2 className="text-lg font-black tracking-wide text-white [text-shadow:0_2px_0_rgba(0,0,0,.35)]">
                  PennyMon
                </h2>
                <div className="mt-14">
                  <PennyMonPet equipped={equipped} large />
                </div>
                <div className="hidden">
                  <p className="text-sm font-semibold text-slate-950">
                    Equipped
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {equipped.accessory} · {equipped.room}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-5 left-0 right-0 z-10 grid grid-cols-3 px-8">
                <PennyMonDockButton icon={Glasses} label="Accessories" tone="violet" />
                <PennyMonDockButton icon={Home} label="Room" tone="sky" />
                <PennyMonDockButton icon={Palette} label="Colour" tone="gold" />
              </div>
            </div>
          </section>
        )}
      </section>

      <nav
        className={`grid shrink-0 grid-cols-5 border-t px-3 pb-3 pt-2 ${theme.nav}`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          const isAdd = tab.id === 'expense'
          const isLocked = ['expense', 'pennymon'].includes(tab.id) && !hasCompletedSetup
          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium ${
                isLocked
                  ? 'cursor-not-allowed text-slate-600'
                  : isAdd
                  ? 'text-[#6A4DF5]'
                  : selected
                    ? 'bg-[#eeeaff] text-[#6A4DF5]'
                    : theme.navIdle
              }`}
              key={tab.id}
              onClick={() => {
                if (isLocked) return
                setActiveTab(tab.id)
              }}
            >
              <span
                className={
                  isLocked
                    ? 'opacity-45'
                    : isAdd
                    ? 'grid size-10 place-items-center rounded-full bg-[#6A4DF5] text-white shadow-lg shadow-[#6A4DF5]/30'
                    : ''
                }
              >
                <Icon size={isAdd ? 24 : 19} />
              </span>
              {isLocked ? 'Locked' : tab.label}
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
                placeholder="Bank Islam, Cash, E-wallet..."
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

function PennyMonNavIcon({ size = 19 }) {
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

  return points
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
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
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
    date: targetDate,
    progress,
    remaining,
    safeSpend,
    spent,
    status,
    sources,
    topCategories,
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
          {[0, 1, 2].map((index) => {
            const category = stats.topCategories[index]

            return (
              <CategoryPill
                key={category?.name || `empty-${index}`}
                value={
                  category
                    ? `${category.name} · RM${category.amount}`
                    : 'No expense'
                }
              />
            )
          })}
        </div>
      </div>
      <SourceBar sources={stats.sources} />
    </div>
  )
}

function CategoryPill({ value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2">
      <p className="truncate text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function EmptyGraphState() {
  return (
    <div className="mt-4 rounded-3xl bg-[#202020] p-4">
      <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
        <p className="text-sm font-semibold text-slate-200">
          No spending yet
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Add an expense to see this graph.
        </p>
      </div>
    </div>
  )
}

function SourceBar({ sources }) {
  const colors = [
    { bg: 'bg-white', text: 'text-white' },
    { bg: 'bg-[#c8c0ff]', text: 'text-[#d9d4ff]' },
    { bg: 'bg-[#62d6c8]', text: 'text-[#a8fff5]' },
    { bg: 'bg-[#ffcf70]', text: 'text-[#ffe2a8]' },
    { bg: 'bg-[#ff8aa5]', text: 'text-[#ffc0ce]' },
  ]

  return (
    <div className="mt-3 rounded-2xl bg-white/10 p-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-white/15">
        {sources.length ? (
          sources.map((source, index) => (
            <div
              className={colors[index % colors.length].bg}
              key={source.name}
              style={{ width: `${source.percent}%` }}
            />
          ))
        ) : (
          <div className="w-full bg-white/20" />
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {sources.length ? (
          sources.slice(0, 3).map((source, index) => (
            <span
              className={`text-[11px] font-semibold ${colors[index % colors.length].text}`}
              key={source.name}
            >
              <span
                className={`mr-1 inline-block size-2 rounded-full ${colors[index % colors.length].bg}`}
              />
              {source.name} {source.percent}%
            </span>
          ))
        ) : (
          <span className="text-[11px] font-semibold text-white/65">
            No source data
          </span>
        )}
      </div>
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

function CalendarPopover({ onClose, onSelect, selectedDate }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#2f2e38] p-5 text-slate-100 shadow-2xl shadow-black/50">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#a99cff]">
              Select date
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCalendarTitle(selectedDate)}
            </p>
          </div>
          <button
            className="grid size-10 place-items-center rounded-full bg-[#202020] text-slate-300"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {getCalendarDays(selectedDate).map((day) =>
            day.value ? (
              <button
                className={`grid aspect-square place-items-center rounded-2xl text-base font-semibold transition ${
                  day.value === selectedDate
                    ? 'bg-[#6A4DF5] text-white shadow-lg shadow-[#6A4DF5]/25'
                    : 'bg-[#202020] text-slate-300 hover:bg-white/10'
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
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-[#202020] px-4 py-3 text-sm font-semibold text-slate-300"
            onClick={() => onSelect(new Date().toISOString().slice(0, 10))}
            type="button"
          >
            Today
          </button>
          <button
            className="rounded-2xl bg-[#6A4DF5] px-4 py-3 text-sm font-semibold text-white"
            onClick={onClose}
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function getWeekOfMonth(date) {
  return Math.min(Math.ceil(date.getDate() / 7), 4)
}

function getExpenseMonthKey(dateString) {
  return dateString.slice(0, 7)
}

function calculateSafeSpend(accounts, budgets) {
  if (!accounts.length || !budgets.length) return 0

  const available = accounts
    .filter((account) => account.balance > 0)
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

function formatExpenseMonth(monthKey) {
  const date = new Date(`${monthKey}-01T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
}

function formatWeekRange(monthKey, week) {
  const [year, month] = monthKey.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  const startDay = (week - 1) * 7 + 1
  const endDay = week === 4 ? lastDay : Math.min(week * 7, lastDay)
  const startDate = new Date(year, month - 1, startDay)
  const endDate = new Date(year, month - 1, endDay)
  const startLabel = startDate.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
  })
  const endLabel = endDate.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
  })

  return `Week ${week} · ${startLabel} - ${endLabel}`
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

function mapWalletRow(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: Number(row.balance),
    tone: row.tone,
  }
}

function mapBudgetRow(row) {
  return {
    id: row.id,
    name: row.name,
    spent: Number(row.spent),
    limit: Number(row.limit_amount),
    color: row.color,
  }
}

function mapExpenseRow(row) {
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

function AuthScreen({
  authError,
  authForm,
  authMode,
  authNotice,
  isLoading,
  onChange,
  onModeChange,
  onSubmit,
}) {
  const isSignup = authMode === 'signup'

  const updateField = (field, value) => {
    onChange((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-[#202020] shadow-2xl shadow-black/40">
      <section className="grid min-h-0 flex-1 place-items-center overflow-hidden bg-[#202020] px-7">
        <div className="w-full max-w-sm text-slate-100">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-[#6A4DF5] text-white">
              <PennyMonNavIcon size={26} />
            </div>
            <h1 className="text-3xl font-semibold text-white">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {isSignup
                ? 'Start tracking your money with PennyMon.'
                : 'Login to continue to PennyMon.'}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#2a2a2a] p-1 text-sm font-medium">
            <button
              className={`rounded-lg py-2 transition ${
                !isSignup ? 'bg-[#3a3a3a] text-white' : 'text-slate-400'
              }`}
              onClick={() => onModeChange('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={`rounded-lg py-2 transition ${
                isSignup ? 'bg-[#3a3a3a] text-white' : 'text-slate-400'
              }`}
              onClick={() => onModeChange('signup')}
              type="button"
            >
              Sign up
            </button>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {isSignup && (
              <AuthField
                icon={User}
                label="Name"
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Your name"
                value={authForm.name}
              />
            )}
            <AuthField
              icon={Mail}
              label="Email"
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@email.com"
              type="email"
              value={authForm.email}
            />
            <AuthField
              icon={Lock}
              label="Password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 6 characters"
              type="password"
              value={authForm.password}
            />

            {!isSignup && (
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    className="size-4 accent-[#6A4DF5]"
                    type="checkbox"
                  />
                  Remember me
                </label>
                <button className="text-[#a99cff]" type="button">
                  Forgot password?
                </button>
              </div>
            )}

            {authError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200">
                {authError}
              </p>
            )}
            {authNotice && (
              <p className="rounded-xl border border-[#6A4DF5]/30 bg-[#6A4DF5]/10 px-3 py-2 text-sm font-medium text-[#c8c0ff]">
                {authNotice}
              </p>
            )}

            <button
              className="w-full rounded-xl bg-[#6A4DF5] px-4 py-3 font-semibold text-white transition hover:bg-[#5b3ff0] disabled:cursor-not-allowed disabled:bg-[#4a3aa5]"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Continue'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isSignup ? 'Already have an account?' : 'No account yet?'}{' '}
            <button
              className="font-semibold text-[#a99cff]"
              onClick={() => onModeChange(isSignup ? 'login' : 'signup')}
              type="button"
            >
              {isSignup ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

function AuthField({
  icon: Icon,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-[#3a3a3a] bg-transparent px-4 py-3 text-slate-100 transition focus-within:border-[#6A4DF5]">
        <Icon className="shrink-0 text-slate-500" size={18} />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </div>
    </label>
  )
}

function PennyMonPet({ equipped, large = false }) {
  return (
    <div
      className={`relative mx-auto grid place-items-center ${
        large ? 'size-44' : 'size-32'
      }`}
      aria-label="PennyMon character"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f1edff] to-[#dcd5ff]" />
      <div className="relative h-[72%] w-[66%] rounded-[42%] bg-[#f8cda7] shadow-md">
        <div className="absolute left-1/2 top-3 h-5 w-16 -translate-x-1/2 rounded-full bg-[#6A4DF5] text-[0px]">
          {equipped.accessory}
        </div>
        <div className="absolute left-[27%] top-[36%] size-3 rounded-full bg-slate-950" />
        <div className="absolute right-[27%] top-[36%] size-3 rounded-full bg-slate-950" />
        <div className="absolute left-1/2 top-[55%] h-3 w-8 -translate-x-1/2 rounded-b-full border-b-4 border-slate-950" />
        <div className="absolute bottom-0 left-1/2 h-10 w-20 -translate-x-1/2 rounded-t-3xl bg-[#6A4DF5]" />
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

function PennyMonDockButton({ icon: Icon, label, tone }) {
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

function SetupHint({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-[#2b2b32] p-5 text-center text-slate-300">
      <p className="text-sm font-semibold text-slate-100">Setup required</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
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
