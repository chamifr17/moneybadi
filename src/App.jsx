import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Home,
  Glasses,
  Palette,
  Plus,
  Target,
  Trash2,
  Trophy,
  User,
  WalletCards,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import angryPennyMon from './assets/pennymon/angry.png'
import coboyHatAccessory from './assets/pennymon/accessories/coboyhat.png'
import flowerHeadAccessory from './assets/pennymon/accessories/flowerhead.png'
import glassesAccessory from './assets/pennymon/accessories/glasses.png'
import haloAccessory from './assets/pennymon/accessories/halo.png'
import headphoneAccessory from './assets/pennymon/accessories/headphone.png'
import ribbonAccessory from './assets/pennymon/accessories/ribbon.png'
import spaceBowlAccessory from './assets/pennymon/accessories/spacebowl.png'
import blueAngryPennyMon from './assets/pennymon/colors/blue/angry.png'
import blueCalmPennyMon from './assets/pennymon/colors/blue/calm.png'
import blueExcitedPennyMon from './assets/pennymon/colors/blue/excited.png'
import blueHappyPennyMon from './assets/pennymon/colors/blue/happy.png'
import blueSadPennyMon from './assets/pennymon/colors/blue/sad.png'
import blueWorriedPennyMon from './assets/pennymon/colors/blue/worried.png'
import calmPennyMon from './assets/pennymon/calm.png'
import excitedPennyMon from './assets/pennymon/excited.png'
import flowersRoom from './assets/pennymon/rooms/flowers.png'
import happyPennyMon from './assets/pennymon/happy.png'
import orangeAngryPennyMon from './assets/pennymon/colors/orange/angry.png'
import orangeCalmPennyMon from './assets/pennymon/colors/orange/calm.png'
import orangeExcitedPennyMon from './assets/pennymon/colors/orange/excited.png'
import orangeHappyPennyMon from './assets/pennymon/colors/orange/happy.png'
import orangeSadPennyMon from './assets/pennymon/colors/orange/sad.png'
import orangeWorriedPennyMon from './assets/pennymon/colors/orange/worried.png'
import sadPennyMon from './assets/pennymon/sad.png'
import spaceRoom from './assets/pennymon/rooms/space.png'
import worriedPennyMon from './assets/pennymon/worried.png'
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from './features/auth/services/authService'
import { askPennyMon } from './features/ai/services/pennyMonAiService'
import {
  calculateDebt,
  calculateSafeSpend,
  getCreditLineAvailable,
  getExpenseMonths,
  getPennyMonMood,
  getPennyMonMoodReason,
  getSpendingGraphData,
  getTodayStats,
  groupExpenses,
  isCreditLineAccount,
  isDebtTargetAccount,
  isPiggyBankEligibleType,
} from './features/money/utils/finance'
import {
  deleteBudgetById,
  deleteExpenseById,
  deleteWalletById,
  insertExpenseRow,
  loadMoneyRows,
  saveBudgetRow,
  saveWalletRow,
  updateBudgetLimit,
  updateBudgetSpent,
  updateWalletBalance,
} from './features/money/services/moneyService'
import { mapBudgetRow, mapExpenseRow, mapWalletRow } from './features/money/utils/mappers'
import { savePennyMonProfile } from './features/pennymon/services/pennyMonProfileService'
import { getDailyQuests } from './features/quests/utils/quests'
import {
  getOwnedItemsStorageKey,
  getPiggyBankDepositStorageKey,
  getPiggyBankStorageKey,
  getPurchaseStorageKey,
  getQuestStorageKey,
  loadClaimedQuestIds,
  loadOwnedItems,
  loadPiggyBankDepositTodayIds,
  loadPiggyBankWalletIds,
  loadPurchasedTodayIds,
} from './shared/storage/pennymonStorage'
import {
  formatCalendarTitle,
  formatExpenseDate,
  formatExpenseMonth,
  formatHomeDate,
  formatWeekRange,
  getCalendarDays,
  getExpenseMonthKey,
  getLocalDateKey,
  getWeekOfMonth,
} from './shared/utils/date'
import { formatMoneyAmount } from './shared/utils/money'

const pennyMonImages = {
  Angry: angryPennyMon,
  Calm: calmPennyMon,
  Excited: excitedPennyMon,
  Happy: happyPennyMon,
  Sad: sadPennyMon,
  Worried: worriedPennyMon,
}

const pennyMonColorSets = {
  Default: pennyMonImages,
  Blue: {
    Angry: blueAngryPennyMon,
    Calm: blueCalmPennyMon,
    Excited: blueExcitedPennyMon,
    Happy: blueHappyPennyMon,
    Sad: blueSadPennyMon,
    Worried: blueWorriedPennyMon,
  },
  Orange: {
    Angry: orangeAngryPennyMon,
    Calm: orangeCalmPennyMon,
    Excited: orangeExcitedPennyMon,
    Happy: orangeHappyPennyMon,
    Sad: orangeSadPennyMon,
    Worried: orangeWorriedPennyMon,
  },
}

const colorOptions = [
  {
    id: 'Default',
    name: 'Original',
    price: 0,
    owned: true,
    preview: pennyMonImages.Happy,
    swatch: 'bg-[#f6c0cf]',
  },
  {
    id: 'Blue',
    name: 'Blue',
    price: 180,
    preview: blueHappyPennyMon,
    swatch: 'bg-[#6fb7ff]',
  },
  {
    id: 'Orange',
    name: 'Orange',
    price: 180,
    preview: orangeHappyPennyMon,
    swatch: 'bg-[#ff9f43]',
  },
]

const accessoryOptions = [
  {
    id: 'None',
    name: 'None',
    owned: true,
    image: null,
    previewClass: 'bg-white/10',
  },
  {
    id: 'Glasses',
    name: 'Glasses',
    price: 90,
    owned: true,
    image: glassesAccessory,
    previewClass: 'bg-[#d8d3ff]',
  },
  {
    id: 'Halo',
    name: 'Halo',
    price: 120,
    image: haloAccessory,
    previewClass: 'bg-[#ffe9a8]',
  },
  {
    id: 'Headphone',
    name: 'Headphone',
    price: 140,
    image: headphoneAccessory,
    previewClass: 'bg-[#b7d7ff]',
  },
  {
    id: 'Ribbon',
    name: 'Ribbon',
    price: 100,
    image: ribbonAccessory,
    previewClass: 'bg-[#ffc8dc]',
  },
  {
    id: 'Flower Head',
    name: 'Flower Head',
    price: 130,
    image: flowerHeadAccessory,
    previewClass: 'bg-[#ffd5e6]',
  },
  {
    id: 'Space Bowl',
    name: 'Space Bowl',
    price: 160,
    image: spaceBowlAccessory,
    previewClass: 'bg-[#c7d2ff]',
  },
  {
    id: 'Cowboy Hat',
    name: 'Cowboy Hat',
    price: 150,
    image: coboyHatAccessory,
    previewClass: 'bg-[#ffd8a8]',
  },
]

const preloadPennyMonImages = [
  ...new Set([
    ...Object.values(pennyMonImages),
    ...Object.values(pennyMonColorSets.Blue),
    ...Object.values(pennyMonColorSets.Orange),
    ...accessoryOptions.map((accessory) => accessory.image).filter(Boolean),
  ]),
]

const roomOptions = [
  {
    id: 'Default room',
    name: 'Default room',
    price: 0,
    background: 'bg-[#202020]',
    plain: true,
    preview: 'from-[#202020] via-[#25252b] to-[#171717]',
  },
  {
    id: 'Flower room',
    name: 'Flower room',
    price: 220,
    image: flowersRoom,
    preview: 'from-[#f8d7e8] via-[#ef9ac7] to-[#8f6df6]',
  },
  {
    id: 'Space room',
    name: 'Space room',
    price: 200,
    image: spaceRoom,
    preview: 'from-[#120f2d] via-[#35206f] to-[#8067ff]',
  },
]


const defaultOwnedItems = {
  accessories: ['None', 'Glasses'],
  colors: ['Default'],
  rooms: ['Default room'],
}

const demoOwnedItems = {
  accessories: accessoryOptions.map((accessory) => accessory.id),
  colors: colorOptions.map((color) => color.id),
  rooms: roomOptions.map((room) => room.id),
}

const demoUnlockCoinAmount = 9999

const pennyMonMoodQuotes = {
  Angry: 'Pause first. Your money needs a reset.',
  Calm: 'Nice tracking. Keep today steady.',
  Excited: 'New treat unlocked, and money still looks good.',
  Happy: 'Everything looks balanced today.',
  Sad: 'A small fix now can save the month.',
  Worried: 'Slow down a little. You are near the line.',
}

const pennyMonQuickQuestions = [
  'Why do you feel this way?',
  'Can I spend today?',
  'Top spending today?',
  'Budget check',
  'Debt check',
  'Wallet check',
]

function App() {
  const loadedUserRef = useRef('')
  const pennyMonLastTapRef = useRef(0)
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
  const [hasLoadedMoneyData, setHasLoadedMoneyData] = useState(false)
  const [arePennyMonImagesReady, setArePennyMonImagesReady] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [coins, setCoins] = useState(0)
  const [ownedItems, setOwnedItems] = useState(defaultOwnedItems)
  const [claimedQuestIds, setClaimedQuestIds] = useState([])
  const [purchasedTodayIds, setPurchasedTodayIds] = useState([])
  const [piggyBankWalletIds, setPiggyBankWalletIds] = useState([])
  const [piggyBankDepositTodayIds, setPiggyBankDepositTodayIds] = useState([])
  const [activeForm, setActiveForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [historyWeek, setHistoryWeek] = useState(1)
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(
    getExpenseMonthKey(getLocalDateKey(new Date())),
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSpendCardFlipped, setIsSpendCardFlipped] = useState(false)
  const [isMoodInfoOpen, setIsMoodInfoOpen] = useState(false)
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isAccessoryPickerOpen, setIsAccessoryPickerOpen] = useState(false)
  const [isPennyMonPresetsOpen, setIsPennyMonPresetsOpen] = useState(false)
  const [isPennyMonHelpOpen, setIsPennyMonHelpOpen] = useState(false)
  const [pennyMonChatInput, setPennyMonChatInput] = useState('')
  const [pennyMonAnswer, setPennyMonAnswer] = useState('')
  const [isPennyMonThinking, setIsPennyMonThinking] = useState(false)
  const [savingAction, setSavingAction] = useState('')
  const [pendingPurchase, setPendingPurchase] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [swipedExpenseId, setSwipedExpenseId] = useState(null)
  const [swipedMoneyCardId, setSwipedMoneyCardId] = useState(null)
  const [touchStartX, setTouchStartX] = useState(null)
  const [draggedExpense, setDraggedExpense] = useState({
    id: null,
    offset: 0,
  })
  const [draggedMoneyCard, setDraggedMoneyCard] = useState({
    id: null,
    offset: 0,
  })
  const [walletForm, setWalletForm] = useState({
    name: '',
    type: 'Bank',
    balance: '',
    isPiggyBank: false,
  })
  const [walletAmountForm, setWalletAmountForm] = useState({
    amount: '',
  })
  const [budgetForm, setBudgetForm] = useState({
    name: '',
    limit: '',
  })
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    accountId: '',
    budgetId: '',
    date: getLocalDateKey(new Date()),
    debtAccountId: '',
    mode: 'expense',
    note: '',
  })
  const [equipped, setEquipped] = useState({
    accessory: 'None',
    color: 'Default',
    room: 'Default room',
  })

  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const sortedAccounts = [...accounts].sort((accountA, accountB) => {
    const accountAIsPiggyBank = piggyBankWalletIds.includes(String(accountA.id))
    const accountBIsPiggyBank = piggyBankWalletIds.includes(String(accountB.id))

    if (accountAIsPiggyBank === accountBIsPiggyBank) return 0
    return accountAIsPiggyBank ? -1 : 1
  })

  const available = accounts
    .filter(
      (account) =>
        account.balance > 0 &&
        !isCreditLineAccount(account) &&
        !piggyBankWalletIds.includes(String(account.id)),
    )
    .reduce((sum, account) => sum + account.balance, 0)
  const debt = calculateDebt(accounts, expenses)
  const totals = {
    available,
    debt,
    trueBalance: available - debt,
    safeSpend: calculateSafeSpend(accounts, budgets, piggyBankWalletIds),
  }
  const historyMonths = getExpenseMonths(expenses)
  const currentHistoryMonth = getExpenseMonthKey(getLocalDateKey(new Date()))
  const historyMonthOptions = [
    {
      value: currentHistoryMonth,
      label: formatExpenseMonth(currentHistoryMonth),
    },
    ...historyMonths.filter((month) => month.value !== currentHistoryMonth),
  ]
  const todayStats = getTodayStats(expenses, totals.safeSpend)
  const quests = getDailyQuests({
    claimedQuestIds,
    piggyBankDepositTodayIds,
    purchasedTodayIds,
    todayStats,
  })
  const pennyMonMood = getPennyMonMood(
    totals,
    budgets,
    todayStats,
    purchasedTodayIds,
  )
  const pennyMonMoodReason = getPennyMonMoodReason(
    totals,
    budgets,
    todayStats,
    purchasedTodayIds,
  )
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
  const equippedRoom =
    roomOptions.find((room) => room.id === equipped.room) || roomOptions[0]

  useEffect(() => {
    const resetKeyboardScroll = () => {
      window.setTimeout(() => {
        if (activeTab !== 'expense' || window.innerWidth > 768) return

        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 80)
    }

    window.addEventListener('focusout', resetKeyboardScroll)

    return () => {
      window.removeEventListener('focusout', resetKeyboardScroll)
    }
  }, [activeTab])

  useEffect(() => {
    let isMounted = true

    Promise.all(
      preloadPennyMonImages.map(
        (source) =>
          new Promise((resolve) => {
            const image = new Image()
            image.onload = resolve
            image.onerror = resolve
            image.src = source

            if (image.decode) {
              image.decode().then(resolve).catch(resolve)
            }
          }),
      ),
    ).then(() => {
      if (isMounted) setArePennyMonImagesReady(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const setUserFromSession = (session) => {
      const user = session?.user

      if (!user) {
        setIsAuthenticated(false)
        setHasLoadedMoneyData(false)
        setCurrentUser({ id: '', name: 'Chami', email: 'chami@pennymon.app' })
        return
      }

      setHasLoadedMoneyData(false)
      setCurrentUser({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      })
      setIsAuthenticated(true)
    }

    getCurrentSession().then(({ data }) => {
      setUserFromSession(data.session)
      setIsAuthLoading(false)
    })

    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      setUserFromSession(session)
      setIsAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadMoneyData = useCallback(async (userId) => {
    setIsDataLoading(true)
    setHasLoadedMoneyData(false)
    setDataError('')

    const {
      budgetRows,
      error,
      expenseRows,
      profileRow,
      walletRows,
    } = await loadMoneyRows(userId)
    if (error) {
      setDataError(error.message)
      setIsDataLoading(false)
      setHasLoadedMoneyData(true)
      return
    }

    const loadedOwnedItems = loadOwnedItems(userId, defaultOwnedItems)
    const loadedPiggyBankWalletIds = loadPiggyBankWalletIds(userId)
    setAccounts(walletRows.map(mapWalletRow))
    setBudgets(budgetRows.map(mapBudgetRow))
    setExpenses(expenseRows.map(mapExpenseRow))
    setSelectedHistoryMonth(getExpenseMonthKey(getLocalDateKey(new Date())))
    setHistoryWeek(getWeekOfMonth(new Date()))
    setClaimedQuestIds(loadClaimedQuestIds(userId))
    setPiggyBankWalletIds(loadedPiggyBankWalletIds)
    setPiggyBankDepositTodayIds(loadPiggyBankDepositTodayIds(userId))
    setPurchasedTodayIds(loadPurchasedTodayIds(userId))

    if (profileRow) {
      const profileCoins = Number(profileRow.coins)
      const nextOwnedItems =
        profileCoins >= demoUnlockCoinAmount ? demoOwnedItems : loadedOwnedItems
      const selectedRoom = isOwnedItem(nextOwnedItems, 'rooms', profileRow.room)
        ? profileRow.room
        : 'Default room'
      setOwnedItems(nextOwnedItems)
      if (profileCoins >= demoUnlockCoinAmount) {
        localStorage.setItem(
          getOwnedItemsStorageKey(userId),
          JSON.stringify(nextOwnedItems),
        )
      }
      setCoins(profileCoins)
      setEquipped({
        accessory: normalizeAccessory(profileRow.accessory),
        color: localStorage.getItem(`pennymon-color-${userId}`) || 'Default',
        room: selectedRoom,
      })
    } else {
      setOwnedItems(loadedOwnedItems)
      setEquipped((current) => ({
        ...current,
        color: localStorage.getItem(`pennymon-color-${userId}`) || 'Default',
      }))
    }

    setIsDataLoading(false)
    setHasLoadedMoneyData(true)
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
    setExpenseForm((current) => {
      const amount = Number(current.amount)
      const validExpenseAccounts = accounts.filter((account) => {
        if (!isCreditLineAccount(account)) return true
        if (Number.isNaN(amount) || amount <= 0) return true
        return amount <= getCreditLineAvailable(account)
      })
      const currentAccountIsValid =
        current.mode === 'debt' ||
        validExpenseAccounts.some((account) => account.id === current.accountId)

      return {
        ...current,
        accountId:
          current.mode === 'expense' && !currentAccountIsValid
            ? validExpenseAccounts[0]?.id || ''
            : current.accountId || accounts[0]?.id || '',
        budgetId: current.budgetId || budgets[0]?.id || '',
        debtAccountId:
          current.debtAccountId ||
          accounts.find(isDebtTargetAccount)?.id ||
          '',
      }
    })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [accounts, budgets, expenseForm.amount])

  const submitAuth = async (event) => {
    event.preventDefault()
    if (!authForm.email.trim() || !authForm.password.trim()) return

    setAuthError('')
    setAuthNotice('')
    setIsAuthLoading(true)

    const authRequest =
      authMode === 'signup'
        ? signUpWithEmail({
            email: authForm.email.trim(),
            name: authForm.name.trim(),
            password: authForm.password,
          })
        : signInWithEmail({
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
        await signOut()
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
    await signOut()
    loadedUserRef.current = ''
    setIsAuthenticated(false)
    setHasLoadedMoneyData(false)
    setActiveTab('home')
    setActiveForm(null)
    setEditingId(null)
    setAuthForm({ name: '', email: '', password: '' })
    setAuthError('')
    setAuthNotice('')
  }

  const saveCoins = async (nextCoins) => {
    setCoins(nextCoins)

    if (!currentUser.id) return

    const { error } = await savePennyMonProfile({
      accessory: equipped.accessory,
      coins: nextCoins,
      mood: pennyMonMood,
      room: equipped.room,
      userId: currentUser.id,
    })

    if (error) setDataError(error.message)
  }

  const completeQuest = async (quest) => {
    if (!quest.claimable || quest.claimed) return

    const nextCoins = coins + quest.reward
    const nextClaimedQuestIds = [...claimedQuestIds, quest.id]

    setClaimedQuestIds(nextClaimedQuestIds)
    localStorage.setItem(
      getQuestStorageKey(currentUser.id),
      JSON.stringify(nextClaimedQuestIds),
    )
    await saveCoins(nextCoins)
  }

  const purchaseItem = async (kind, item) => {
    if (isOwnedItem(ownedItems, kind, item.id) || coins < item.price) return

    const nextCoins = coins - item.price
    const nextOwnedItems = {
      ...ownedItems,
      [kind]: [...(ownedItems[kind] || []), item.id],
    }
    const purchaseKey = `${kind}:${item.id}`
    const nextPurchasedTodayIds = purchasedTodayIds.includes(purchaseKey)
      ? purchasedTodayIds
      : [...purchasedTodayIds, purchaseKey]

    setOwnedItems(nextOwnedItems)
    setPurchasedTodayIds(nextPurchasedTodayIds)
    localStorage.setItem(
      getOwnedItemsStorageKey(currentUser.id),
      JSON.stringify(nextOwnedItems),
    )
    localStorage.setItem(
      getPurchaseStorageKey(currentUser.id),
      JSON.stringify(nextPurchasedTodayIds),
    )
    await saveCoins(nextCoins)
  }

  const requestPurchase = (kind, item) => {
    if (isOwnedItem(ownedItems, kind, item.id)) return
    if (coins < item.price) return

    setPendingPurchase({ item, kind })
  }

  const confirmPurchase = async () => {
    if (!pendingPurchase) return

    await purchaseItem(pendingPurchase.kind, pendingPurchase.item)
    setPendingPurchase(null)
  }

  const buildPennyMonReply = (question) => {
    const normalizedQuestion = question.toLowerCase()
    const topCategory = todayStats.topCategories[0]
    const highestBudget = budgets
      .filter((budget) => budget.limit > 0)
      .sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0]

    if (normalizedQuestion.includes('feel') || normalizedQuestion.includes('mood')) {
      return pennyMonMoodReason
    }

    if (normalizedQuestion.includes('spend') || normalizedQuestion.includes('today')) {
      if (!todayStats.count) {
        return 'No expenses recorded for today yet. Once you add an expense, I can explain your spending pattern.'
      }

      return `Today you spent RM${formatMoneyAmount(todayStats.spent)} from ${todayStats.count} transaction${todayStats.count === 1 ? '' : 's'}. Your safe-to-spend balance is RM${formatMoneyAmount(todayStats.remaining)}.`
    }

    if (normalizedQuestion.includes('top') || normalizedQuestion.includes('category')) {
      if (!topCategory) return 'No category has spending today yet.'

      return `Your highest spending today is ${topCategory.name} at RM${formatMoneyAmount(topCategory.amount)}.`
    }

    if (normalizedQuestion.includes('budget')) {
      if (!budgets.length) return 'You have not created a budget yet. Add one first so I can track your limit.'
      if (!highestBudget) return 'Your budgets are set, but there is no spending pressure yet.'

      return `${highestBudget.name} is the budget to watch: RM${formatMoneyAmount(highestBudget.spent)} used from RM${formatMoneyAmount(highestBudget.limit)}.`
    }

    if (normalizedQuestion.includes('debt') || normalizedQuestion.includes('pay later')) {
      if (totals.debt <= 0) return 'You have no active debt recorded right now.'

      return `Your current debt is RM${formatMoneyAmount(totals.debt)}. Settling a small amount early can keep your monthly cash flow calmer.`
    }

    if (normalizedQuestion.includes('wallet')) {
      if (!accounts.length) return 'You have not added a wallet yet. Add your bank, cash, e-wallet, or pay later source first.'

      return `You have RM${formatMoneyAmount(totals.available)} available across ${accounts.length} wallet${accounts.length === 1 ? '' : 's'}. PiggyBank wallets are kept separate from safe-to-spend.`
    }

    return 'I can only help with your spending, budget, wallet, debt, and PennyMon mood. Try asking about today\'s spending or your budget.'
  }

  const buildPennyMonSummary = () => ({
    mood: pennyMonMood,
    moodReason: pennyMonMoodReason,
    today: {
      spent: todayStats.spent,
      count: todayStats.count,
      remaining: todayStats.remaining,
      topCategories: todayStats.topCategories,
    },
    totals: {
      available: totals.available,
      debt: totals.debt,
      safeSpend: totals.safeSpend,
    },
    budgets: budgets.map((budget) => ({
      name: budget.name,
      limit: budget.limit,
      spent: budget.spent,
    })),
    wallets: accounts.map((account) => ({
      name: account.name,
      type: account.type,
      amount: account.amount,
      isPiggyBank: piggyBankWalletIds.includes(String(account.id)),
    })),
  })

  const sendPennyMonMessage = async (messageText = pennyMonChatInput) => {
    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) return

    setIsPennyMonThinking(true)
    setPennyMonAnswer('')
    setPennyMonChatInput('')
    setIsPennyMonPresetsOpen(false)

    const fallbackAnswer = buildPennyMonReply(trimmedMessage)
    const minimumThinkingDelay = new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const [{ data, error }] = await Promise.all([
        askPennyMon({
          question: trimmedMessage,
          summary: buildPennyMonSummary(),
        }),
        minimumThinkingDelay,
      ])

      if (error) throw error

      setPennyMonAnswer(data?.answer || fallbackAnswer)
    } catch (error) {
      console.error('PennyMon AI failed:', error)
      setPennyMonAnswer(fallbackAnswer)
    } finally {
      setIsPennyMonThinking(false)
    }
  }

  const showPennyMonPresets = () => {
    setIsPennyMonPresetsOpen((current) => !current)
  }

  const handlePennyMonTap = () => {
    const shouldBlockDoubleTap =
      isPennyMonHelpOpen ||
      isPennyMonPresetsOpen ||
      isPennyMonThinking ||
      Boolean(pennyMonAnswer)

    if (shouldBlockDoubleTap) {
      pennyMonLastTapRef.current = 0
      return
    }

    const currentTap = Date.now()

    if (currentTap - pennyMonLastTapRef.current < 320) {
      showPennyMonPresets()
      pennyMonLastTapRef.current = 0
      return
    }

    pennyMonLastTapRef.current = currentTap
  }

  const updatePiggyBankWallets = (walletId, shouldMark) => {
    if (!currentUser.id) return

    const walletKey = String(walletId)
    const nextWalletIds = shouldMark
      ? [...new Set([...piggyBankWalletIds, walletKey])]
      : piggyBankWalletIds.filter((id) => id !== walletKey)

    setPiggyBankWalletIds(nextWalletIds)
    localStorage.setItem(
      getPiggyBankStorageKey(currentUser.id),
      JSON.stringify(nextWalletIds),
    )
  }

  const recordPiggyBankDeposit = (walletId, amount) => {
    if (!currentUser.id || amount < 5) return

    const depositKey = String(walletId)
    const nextDepositIds = piggyBankDepositTodayIds.includes(depositKey)
      ? piggyBankDepositTodayIds
      : [...piggyBankDepositTodayIds, depositKey]

    setPiggyBankDepositTodayIds(nextDepositIds)
    localStorage.setItem(
      getPiggyBankDepositStorageKey(currentUser.id),
      JSON.stringify(nextDepositIds),
    )
  }

  const equipRoom = async (room) => {
    if (!isOwnedItem(ownedItems, 'rooms', room.id)) return

    setEquipped((current) => ({ ...current, room: room.id }))
    setIsRoomPickerOpen(false)

    if (!currentUser.id) return

    const { error } = await savePennyMonProfile({
      accessory: equipped.accessory,
      coins,
      mood: pennyMonMood,
      room: room.id,
      userId: currentUser.id,
    })

    if (error) setDataError(error.message)
  }

  const equipColor = (color) => {
    if (!isOwnedItem(ownedItems, 'colors', color.id)) return

    setEquipped((current) => ({ ...current, color: color.id }))
    setIsColorPickerOpen(false)

    if (currentUser.id) {
      localStorage.setItem(`pennymon-color-${currentUser.id}`, color.id)
    }
  }

  const equipAccessory = async (accessory) => {
    if (!isOwnedItem(ownedItems, 'accessories', accessory.id)) return

    setEquipped((current) => ({ ...current, accessory: accessory.id }))
    setIsAccessoryPickerOpen(false)

    if (!currentUser.id) return

    const { error } = await savePennyMonProfile({
      accessory: accessory.id,
      coins,
      mood: pennyMonMood,
      room: equipped.room,
      userId: currentUser.id,
    })

    if (error) setDataError(error.message)
  }

  const closeForm = () => {
    setActiveForm(null)
    setEditingId(null)
    setWalletForm({ name: '', type: 'Bank', balance: '', isPiggyBank: false })
    setWalletAmountForm({ amount: '' })
    setBudgetForm({ name: '', limit: '' })
    setExpenseForm({
      amount: '',
      accountId: '',
      budgetId: '',
      date: getLocalDateKey(new Date()),
      debtAccountId: '',
      mode: 'expense',
      note: '',
    })
    setIsCalendarOpen(false)
  }

  const openAddWallet = () => {
    setEditingId(null)
    setWalletForm({ name: '', type: 'Bank', balance: '', isPiggyBank: false })
    setActiveForm('wallet')
  }

  const openEditWallet = (account) => {
    setEditingId(account.id)
    setWalletForm({
      name: account.name,
      type: account.type,
      balance: String(Math.abs(account.balance)),
      isPiggyBank: piggyBankWalletIds.includes(String(account.id)),
    })
    setActiveForm('wallet')
  }

  const openAddWalletAmount = (account) => {
    setEditingId(account.id)
    setWalletAmountForm({ amount: '' })
    setActiveForm('walletAmount')
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

  const openAddBudgetLimit = (budget) => {
    setEditingId(budget.id)
    setWalletAmountForm({ amount: '' })
    setActiveForm('budgetLimit')
  }

  const deleteWallet = async (id) => {
    const { error } = await deleteWalletById(id)

    if (error) {
      setDataError(error.message)
      return
    }

    setAccounts((current) => current.filter((account) => account.id !== id))
    updatePiggyBankWallets(id, false)
  }

  const deleteBudget = async (id) => {
    const { error } = await deleteBudgetById(id)

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
    setSavingAction('wallet')

    try {
      const shouldBeDebt = isCreditLineAccount(walletForm)
      const walletData = {
        name: walletForm.name.trim(),
        type: walletForm.type,
        balance: amount,
        tone: shouldBeDebt ? 'bg-rose-50' : 'bg-[#eeeaff]',
      }

      const { data, error } = await saveWalletRow({
        editingId,
        userId: currentUser.id,
        walletData,
      })

      if (error) {
        setDataError(error.message)
        return
      }

      if (editingId) {
        setAccounts((current) =>
          current.map((account) =>
            account.id === editingId ? mapWalletRow(data) : account,
          ),
        )
        updatePiggyBankWallets(
          data.id,
          walletForm.isPiggyBank && isPiggyBankEligibleType(walletData.type),
        )
      } else {
        setAccounts((current) => [mapWalletRow(data), ...current])
        if (walletForm.isPiggyBank && isPiggyBankEligibleType(walletData.type)) {
          updatePiggyBankWallets(data.id, true)
          if (amount >= 5) {
            recordPiggyBankDeposit(data.id, amount)
          }
        }
      }
      closeForm()
    } finally {
      setSavingAction('')
    }
  }

  const addWalletAmount = async (event) => {
    event.preventDefault()
    const amount = Number(walletAmountForm.amount)
    const account = accounts.find((item) => item.id === editingId)

    if (!currentUser.id || !account || Number.isNaN(amount) || amount <= 0) return
    setSavingAction('walletAmount')

    try {
      const nextBalance = account.balance + amount
      const { data, error } = await updateWalletBalance(account.id, nextBalance)

      if (error) {
        setDataError(error.message)
        return
      }

      setAccounts((current) =>
        current.map((item) =>
          item.id === account.id ? mapWalletRow(data) : item,
        ),
      )
      if (piggyBankWalletIds.includes(String(account.id)) && amount >= 5) {
        recordPiggyBankDeposit(account.id, amount)
      }
      closeForm()
    } finally {
      setSavingAction('')
    }
  }

  const addBudgetLimit = async (event) => {
    event.preventDefault()
    const amount = Number(walletAmountForm.amount)
    const budget = budgets.find((item) => item.id === editingId)

    if (!currentUser.id || !budget || Number.isNaN(amount) || amount <= 0) return
    setSavingAction('budgetLimit')

    try {
      const nextLimit = budget.limit + amount
      const { data, error } = await updateBudgetLimit(budget.id, nextLimit)

      if (error) {
        setDataError(error.message)
        return
      }

      setBudgets((current) =>
        current.map((item) =>
          item.id === budget.id ? mapBudgetRow(data) : item,
        ),
      )
      closeForm()
    } finally {
      setSavingAction('')
    }
  }

  const saveBudget = async (event) => {
    event.preventDefault()
    const limit = Number(budgetForm.limit)
    if (!currentUser.id || !budgetForm.name.trim() || Number.isNaN(limit) || limit <= 0) return
    setSavingAction('budget')

    try {
      const { data, error } = await saveBudgetRow({
        budgetData: {
          name: budgetForm.name.trim(),
          limit,
        },
        editingId,
        userId: currentUser.id,
      })

      if (error) {
        setDataError(error.message)
        return
      }

      if (editingId) {
        setBudgets((current) =>
          current.map((budget) =>
            budget.id === editingId ? mapBudgetRow(data) : budget,
          ),
        )
      } else {
        setBudgets((current) => [mapBudgetRow(data), ...current])
      }
      closeForm()
    } finally {
      setSavingAction('')
    }
  }

  const saveExpense = async (event) => {
    event.preventDefault()
    const amount = Number(expenseForm.amount)
    const accountId = expenseForm.accountId
    const budgetId = expenseForm.budgetId
    const account = accounts.find((item) => item.id === accountId)
    const budget = budgets.find((item) => item.id === budgetId)
    const isDebtPayment = expenseForm.mode === 'debt'
    const debtAccount = accounts.find((item) => item.id === expenseForm.debtAccountId)

    if (!currentUser.id || Number.isNaN(amount) || amount <= 0 || !account) return

    if (!isDebtPayment && isCreditLineAccount(account)) {
      const availableLimit = getCreditLineAvailable(account)

      if (amount > availableLimit) {
        setDataError(
          `${account.name} only has RM${formatMoneyAmount(availableLimit)} limit left.`,
        )
        return
      }
    }

    setSavingAction(isDebtPayment ? 'debt' : 'expense')

    try {
      if (isDebtPayment) {
        if (!debtAccount || !isDebtTargetAccount(debtAccount) || debtAccount.id === account.id) return

        const paymentAmount = isCreditLineAccount(debtAccount)
          ? amount
          : Math.min(amount, Math.abs(debtAccount.balance))
        const nextAccountBalance = account.balance - paymentAmount
        const nextDebtBalance = debtAccount.balance + paymentAmount
        const [
          { data: walletRow, error: walletError },
          { data: debtWalletRow, error: debtWalletError },
          { data: expenseRow, error: expenseError },
        ] = await Promise.all([
          updateWalletBalance(accountId, nextAccountBalance),
          updateWalletBalance(debtAccount.id, nextDebtBalance),
          insertExpenseRow({
            account,
            amount: paymentAmount,
            budget: null,
            date: expenseForm.date || getLocalDateKey(new Date()),
            note: {
              budgetName: `Debt: ${debtAccount.name}`,
              text: expenseForm.note.trim() || `Payment to ${debtAccount.name}`,
            },
            userId: currentUser.id,
          }),
        ])

        const error = walletError || debtWalletError || expenseError
        if (error) {
          setDataError(error.message)
          return
        }

        setAccounts((current) =>
          current.map((item) => {
            if (item.id === accountId) return mapWalletRow(walletRow)
            if (item.id === debtAccount.id) return mapWalletRow(debtWalletRow)
            return item
          }),
        )
        setExpenses((current) => [mapExpenseRow(expenseRow), ...current])
        setSelectedHistoryMonth(getExpenseMonthKey(expenseRow.date))
        setHistoryWeek(getWeekOfMonth(new Date(`${expenseRow.date}T00:00:00`)))
        setExpenseForm({
          amount: '',
          accountId: accounts[0]?.id ? String(accounts[0].id) : '',
          budgetId: budgets[0]?.id ? String(budgets[0].id) : '',
          date: getLocalDateKey(new Date()),
          debtAccountId: accounts.find(isDebtTargetAccount)?.id || '',
          mode: 'debt',
          note: '',
        })
        setIsCalendarOpen(false)
        setSuccessMessage('Debt settled successfully.')
        return
      }

      if (!budget) return

      const nextAccountBalance = account.balance - amount
      const nextBudgetSpent = budget.spent + amount

      const [
        { data: walletRow, error: walletError },
        { data: budgetRow, error: budgetError },
        { data: expenseRow, error: expenseError },
      ] = await Promise.all([
        updateWalletBalance(accountId, nextAccountBalance),
        updateBudgetSpent(budgetId, nextBudgetSpent),
        insertExpenseRow({
          account,
          amount,
          budget,
          date: expenseForm.date || getLocalDateKey(new Date()),
          note: {
            text: expenseForm.note.trim() || 'Expense',
          },
          userId: currentUser.id,
        }),
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
        date: getLocalDateKey(new Date()),
        debtAccountId: accounts.find(isDebtTargetAccount)?.id || '',
        mode: 'expense',
        note: '',
      })
      setIsCalendarOpen(false)
      setSuccessMessage('Expense added successfully.')
    } finally {
      setSavingAction('')
    }
  }

  const deleteExpense = async (expense) => {
    const account = accounts.find((item) => item.id === expense.walletId)
    const budget = budgets.find((item) => item.id === expense.budgetId)
    const debtAccountName = expense.budgetName?.startsWith('Debt: ')
      ? expense.budgetName.replace('Debt: ', '')
      : ''
    const debtAccount = debtAccountName
      ? accounts.find((item) => item.name === debtAccountName)
      : null
    const nextAccountBalance = account ? account.balance + expense.amount : null
    const nextBudgetSpent = budget
      ? Math.max(budget.spent - expense.amount, 0)
      : null
    const nextDebtBalance = debtAccount
      ? debtAccount.balance - expense.amount
      : null

    const requests = [
      deleteExpenseById(expense.id),
    ]

    if (account) {
      requests.push(
        updateWalletBalance(account.id, nextAccountBalance),
      )
    }

    if (budget) {
      requests.push(
        updateBudgetSpent(budget.id, nextBudgetSpent),
      )
    }
    if (debtAccount) {
      requests.push(
        updateWalletBalance(debtAccount.id, nextDebtBalance),
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
    if (debtAccount) {
      const debtResultIndex = account && budget ? 3 : account || budget ? 2 : 1
      setAccounts((current) =>
        current.map((item) =>
          item.id === debtAccount.id
            ? mapWalletRow(results[debtResultIndex].data)
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
    app: 'bg-[#202020]',
    page: 'bg-[#282828]',
    card: 'border-white/10 bg-[#2f2e38] text-slate-100',
    muted: 'text-slate-400',
    title: 'text-slate-100',
    nav: 'border-[#35343f] bg-[#24232d]',
    navIdle: 'text-slate-400',
    shadow: 'shadow-black/40',
  }
  const isModalOpen =
    Boolean(activeForm) ||
    isCalendarOpen ||
    isRoomPickerOpen ||
    isColorPickerOpen ||
    isAccessoryPickerOpen ||
    isPennyMonHelpOpen ||
    Boolean(pendingPurchase) ||
    Boolean(successMessage)
  const isPageScrollLocked =
    isModalOpen ||
    isMoodInfoOpen ||
    isPennyMonPresetsOpen ||
    Boolean(pennyMonAnswer) ||
    isPennyMonThinking
  const pageScrollClass = `min-h-0 flex-1 space-y-4 ${
    isPageScrollLocked ? 'overflow-y-hidden' : 'overflow-y-auto'
  } px-5 pb-[calc(24px+env(safe-area-inset-bottom))] ${theme.page}`
  const isPennyMonShopOpen =
    isRoomPickerOpen || isColorPickerOpen || isAccessoryPickerOpen
  const pennyMonAskTrayClass =
    'fixed bottom-[calc(124px+env(safe-area-inset-bottom))] left-1/2 z-[120] w-full max-w-md -translate-x-1/2 px-5'
  const pennyMonAnswerTrayClass =
    'fixed bottom-[calc(160px+env(safe-area-inset-bottom))] left-1/2 z-[120] w-full max-w-md -translate-x-1/2 px-5'
  const isHomeReady = hasLoadedMoneyData && arePennyMonImagesReady
  const shouldShowHomeLoading = activeTab === 'home' && !isHomeReady && !dataError
  const pendingExpenseAmount = Number(expenseForm.amount)

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

  if (activeTab === 'home' && !isHomeReady && !dataError) {
    return <AppBootLoading />
  }

  return (
    <main
      className={`relative mx-auto flex h-dvh max-w-md flex-col overflow-hidden shadow-2xl ${theme.app} ${theme.shadow} animate-[tabPageIn_700ms_cubic-bezier(.2,.8,.2,1)_both]`}
    >
      {activeTab !== 'pennymon' && (
        <header className="flex items-center justify-between px-5 pb-3.5 pt-6">
          <div>
            <p className="text-sm font-semibold text-[#6A4DF5]">PennyMon</p>
            <h1 className={`text-2xl font-semibold ${theme.title}`}>
              Hi, {currentUser.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
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
        key={activeTab}
        className={
          activeTab === 'pennymon'
            ? 'min-h-0 flex-1 overflow-hidden animate-[tabPageIn_700ms_cubic-bezier(.2,.8,.2,1)_both]'
            : `${pageScrollClass} animate-[tabPageIn_700ms_cubic-bezier(.2,.8,.2,1)_both]`
        }
      >
        {activeTab === 'home' && (
          shouldShowHomeLoading ? (
            <HomeLoadingState />
          ) : (
          <div
            className="space-y-4 pt-3.5 animate-[homeContentIn_700ms_cubic-bezier(.2,.8,.2,1)_both]"
            key={`home-${hasLoadedMoneyData ? 'ready' : 'error'}`}
          >
            <div
              className="block h-[315px] w-full text-left [perspective:1200px]"
              onClick={() => {
                if (isMoodInfoOpen) return
                setIsSpendCardFlipped((current) => !current)
              }}
              onKeyDown={(event) => {
                if (isMoodInfoOpen) return
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
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#6A4DF5] bg-[radial-gradient(circle_at_24%_7%,rgba(255,255,255,.28),transparent_34%),linear-gradient(135deg,#8d63ff_0%,#6A4DF5_48%,#4f35df_100%)] p-5 pt-7 text-white shadow-xl shadow-[#6A4DF5]/20 [backface-visibility:hidden]">
                  <div className="absolute inset-0 animate-[homeCardFaceIn_520ms_cubic-bezier(.2,.8,.2,1)_both] will-change-transform">
                    <div className="absolute left-5 top-6 flex h-[138px] w-[48%] flex-col justify-center rounded-[1.6rem] bg-white/18 px-5 py-4 text-white ring-1 ring-white/25 backdrop-blur-md">
                      <div className="flex items-start gap-2">
                        <p className="min-w-0 flex-1 text-base font-bold leading-snug">
                          PennyMon feels {pennyMonMood.toLowerCase()}.
                        </p>
                        <button
                          className="grid size-6 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-black text-white ring-1 ring-white/25"
                          onClick={(event) => {
                            event.stopPropagation()
                            setIsMoodInfoOpen(true)
                          }}
                          type="button"
                        >
                          ?
                        </button>
                      </div>
                      <p className="mt-2 text-base font-medium leading-snug text-white/70">
                        {pennyMonMoodQuotes[pennyMonMood]}
                      </p>
                    </div>
                    <div className="absolute -right-4 top-4">
                      <PennyMonPet
                        accessory={equipped.accessory}
                        color={equipped.color}
                        mood={pennyMonMood}
                        size="home"
                      />
                    </div>
                    <div className="absolute bottom-7 left-5 max-w-[72%] text-left">
                      <p className="text-sm font-medium text-white/75">
                        {formatHomeDate(todayStats.date)}
                      </p>
                      <h2 className="mt-2 text-[clamp(2.15rem,11vw,3.25rem)] font-semibold leading-none tracking-normal text-white">
                        RM{formatMoneyAmount(todayStats.spent)}
                      </h2>
                      <p className="mt-2 text-base font-medium text-white/70">
                        spent today
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-6 flex items-center gap-2 text-sm font-semibold text-white">
                      <span>See insight</span>
                      <ArrowRight size={20} strokeWidth={2.4} />
                    </div>
                  </div>
                  {isMoodInfoOpen && (
                    <div
                      className="absolute inset-x-8 top-1/2 z-20 -translate-y-1/2 rounded-[1.75rem] bg-[#202020]/90 p-4 text-center text-white shadow-2xl shadow-black/30 ring-1 ring-white/15 backdrop-blur-md"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <p className="text-sm font-bold">
                        Why PennyMon feels {pennyMonMood.toLowerCase()}
                      </p>
                      <p className="mt-2 text-sm leading-snug text-white/70">
                        {pennyMonMoodReason}
                      </p>
                      <button
                        className="mt-4 rounded-full bg-[#6A4DF5] px-4 py-2 text-xs font-bold text-white"
                        onClick={(event) => {
                          event.stopPropagation()
                          setIsMoodInfoOpen(false)
                        }}
                        type="button"
                      >
                        Got it
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#6A4DF5] bg-[radial-gradient(circle_at_24%_0%,rgba(255,255,255,.28),transparent_34%),linear-gradient(135deg,#8d63ff_0%,#6A4DF5_48%,#4f35df_100%)] p-5 text-white shadow-xl shadow-[#6A4DF5]/20 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <TodayInsight
                    hasCompletedSetup={hasCompletedSetup}
                    onAddExpense={() => {
                      if (!hasCompletedSetup) return
                      setIsSpendCardFlipped(false)
                      setActiveTab('expense')
                    }}
                    stats={todayStats}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat
                label="Available"
                value={`RM${formatMoneyAmount(totals.available)}`}
              />
              <Stat
                label="Debt"
                value={`RM${formatMoneyAmount(totals.debt)}`}
              />
              <Stat
                label="True"
                value={`RM${formatMoneyAmount(totals.trueBalance)}`}
              />
            </div>

            <section className="pt-1">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${theme.title}`}>
                  Daily quests
                </h2>
                <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-sm font-semibold text-[#6A4DF5]">
                  {coins} Monny
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
                          +{quest.reward} Monny
                        </p>
                      </div>
                    </div>
                    <button
                      className="rounded-full bg-[#6A4DF5] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#6A4DF5]/20 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                      disabled={!quest.claimable || quest.claimed}
                      onClick={() => completeQuest(quest)}
                    >
                      {quest.claimed
                        ? 'Claimed'
                        : quest.claimable
                          ? 'Claim'
                          : quest.done
                            ? '9 PM'
                            : 'Locked'}
                    </button>
                  </div>
                ))}
                <div className="h-[calc(8rem+env(safe-area-inset-bottom))]" aria-hidden="true" />
              </div>
            </section>
          </div>
          )
        )}

        {activeTab === 'wallets' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Wallets"
              subtitle="Track banks, cash, e-wallets, and pay-later."
              onAction={openAddWallet}
            />
            <div className="space-y-3 pb-6">
              {!accounts.length && (
                <SetupHint
                  message="Add your first wallet before logging expenses or customizing PennyMon."
                />
              )}
              {sortedAccounts.map((account) => {
                const isPiggyBank = piggyBankWalletIds.includes(String(account.id))
                const isUnavailableCreditLine =
                  isCreditLineAccount(account) && getCreditLineAvailable(account) <= 0

                return (
                  <SwipeActionCard
                    actionWidth={180}
                    addLabel="Add"
                    cardId={`wallet-${account.id}`}
                    className={`relative rounded-2xl border p-3 text-slate-100 shadow-sm ${
                      isPiggyBank
                        ? 'border-[#6A4DF5]/45 bg-[#2f2a46]'
                        : 'border-white/10 bg-[#2b2b32]'
                    }`}
                    draggedCard={draggedMoneyCard}
                    key={account.id}
                    onAdd={() => openAddWalletAmount(account)}
                    onDelete={() => deleteWallet(account.id)}
                    onEdit={() => openEditWallet(account)}
                    setDraggedCard={setDraggedMoneyCard}
                    setSwipedCardId={setSwipedMoneyCardId}
                    setTouchStartX={setTouchStartX}
                    swipedCardId={swipedMoneyCardId}
                    touchStartX={touchStartX}
                  >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-semibold leading-tight">
                          {account.name}
                        </p>
                        {isPiggyBank && (
                          <span className="shrink-0 rounded-full bg-[#eeeaff] px-2 py-0.5 text-[10px] font-black text-[#6A4DF5]">
                            PiggyBank
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-xs ${isPiggyBank ? 'text-[#c8c0ff]' : 'text-slate-400'}`}>
                        {account.type}
                      </p>
                      {isUnavailableCreditLine && (
                        <p className="mt-1 text-[11px] font-semibold text-amber-300">
                          Settle your debt to continue using this Pay later.
                        </p>
                      )}
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
                          {isPiggyBank
                            ? 'Saved'
                            : isCreditLineAccount(account)
                            ? 'Limit left'
                            : account.balance < 0
                              ? 'Outstanding'
                              : 'Available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwipeActionCard>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === 'budgets' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Budgets"
              subtitle="Simple category limits with progress."
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
                const isOverLimit = budget.spent >= budget.limit
                return (
                  <SwipeActionCard
                    actionWidth={180}
                    addLabel="Limit"
                    cardId={`budget-${budget.id}`}
                    className="relative rounded-2xl border border-white/10 bg-[#2b2b32] p-3 text-slate-100 shadow-sm"
                    draggedCard={draggedMoneyCard}
                    key={budget.id}
                    onAdd={() => openAddBudgetLimit(budget)}
                    onDelete={() => deleteBudget(budget.id)}
                    onEdit={() => openEditBudget(budget)}
                    setDraggedCard={setDraggedMoneyCard}
                    setSwipedCardId={setSwipedMoneyCardId}
                    setTouchStartX={setTouchStartX}
                    swipedCardId={swipedMoneyCardId}
                    touchStartX={touchStartX}
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
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            isOverLimit ? 'bg-[#b91c1c]' : 'bg-[#6A4DF5]'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span
                        className={`w-10 text-right text-xs font-semibold ${
                          isOverLimit ? 'text-red-300' : 'text-[#b9afff]'
                        }`}
                      >
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-xs ${
                        isOverLimit ? 'text-red-300' : 'text-slate-500'
                      }`}
                    >
                      {isOverLimit
                        ? `RM${formatMoneyAmount(budget.spent - budget.limit)} over limit`
                        : `RM${formatMoneyAmount(budget.limit - budget.spent)} left`}
                    </p>
                  </SwipeActionCard>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === 'expense' && (
          <section className="space-y-4 pt-3">
            <ActionHeader
              icon={Plus}
              title="Add Expense / Settle Debt"
              subtitle="Log spending and update your wallet and budget."
            />
            <form
              className={`space-y-4 rounded-[2rem] border p-4 shadow-sm ${theme.card}`}
              onSubmit={saveExpense}
            >
              <div className="grid grid-cols-2 rounded-2xl bg-[#202020] p-1 text-sm font-semibold">
                {[
                  { id: 'expense', label: 'Expense' },
                  { id: 'debt', label: 'Debt' },
                ].map((mode) => (
                  <button
                    className={`rounded-xl px-3 py-2 transition ${
                      expenseForm.mode === mode.id
                        ? 'bg-[#6A4DF5] text-white'
                        : 'text-slate-400'
                    }`}
                    key={mode.id}
                    onClick={() =>
                      setExpenseForm((current) => ({
                        ...current,
                        accountId:
                          mode.id === 'debt'
                            ? accounts.find((account) => account.balance >= 0)?.id || ''
                            : current.accountId || accounts[0]?.id || '',
                        budgetId:
                          mode.id === 'expense'
                            ? current.budgetId || budgets[0]?.id || ''
                            : current.budgetId,
                        debtAccountId:
                          mode.id === 'debt'
                            ? current.debtAccountId ||
                              accounts.find(isDebtTargetAccount)?.id ||
                              ''
                            : current.debtAccountId,
                        mode: mode.id,
                      }))
                    }
                    type="button"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
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
                  <ExpenseSelect
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        accountId: event.target.value,
                      }))
                    }
                    value={expenseForm.accountId}
                  >
                    <option value="">Wallet</option>
                    {accounts
                      .filter((account) =>
                        expenseForm.mode === 'debt'
                          ? account.balance >= 0 && !isDebtTargetAccount(account)
                          : !isCreditLineAccount(account) ||
                            Number.isNaN(pendingExpenseAmount) ||
                            pendingExpenseAmount <= 0 ||
                            pendingExpenseAmount <= getCreditLineAvailable(account),
                      )
                      .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </ExpenseSelect>
                </Field>
                {expenseForm.mode === 'expense' ? (
                  <Field label="Budget">
                    <ExpenseSelect
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
                    </ExpenseSelect>
                  </Field>
                ) : (
                  <Field label="Debt">
                  <ExpenseSelect
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        debtAccountId: event.target.value,
                      }))
                    }
                    value={expenseForm.debtAccountId}
                  >
                    <option value="">Debt</option>
                    {accounts
                      .filter(isDebtTargetAccount)
                      .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </ExpenseSelect>
                </Field>
                )}
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
              <AnimatedSubmitButton isSaving={savingAction === expenseForm.mode}>
                {expenseForm.mode === 'debt' ? 'Settle debt' : 'Save expense'}
              </AnimatedSubmitButton>
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
                  {historyMonthOptions.map((month) => (
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
                            onPointerCancel={() => {
                              setDraggedExpense({ id: null, offset: 0 })
                              setTouchStartX(null)
                            }}
                            onPointerDown={(event) => {
                              if (!event.isPrimary) return
                              event.currentTarget.setPointerCapture(event.pointerId)
                              setTouchStartX(event.clientX)
                              setSwipedExpenseId(null)
                            }}
                            onPointerMove={(event) => {
                              if (touchStartX === null) return
                              const deltaX = event.clientX - touchStartX
                              const offset = Math.max(Math.min(deltaX, 0), -86)
                              setDraggedExpense({ id: expense.id, offset })
                            }}
                            onPointerUp={(event) => {
                              if (touchStartX === null) return
                              const deltaX = event.clientX - touchStartX
                              setSwipedExpenseId(deltaX < -42 ? expense.id : null)
                              setDraggedExpense({ id: null, offset: 0 })
                              if (deltaX > 42) setSwipedExpenseId(null)
                              setTouchStartX(null)
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
              <div className="h-[calc(7rem+env(safe-area-inset-bottom))]" aria-hidden="true" />
            </section>
          </section>
        )}

        {activeTab === 'pennymon' && (
          <section className="relative h-full overflow-hidden">
            <div
              className={`absolute inset-0 overflow-hidden ${equippedRoom.background || 'bg-[#241c46]'} shadow-xl shadow-slate-300/60`}
            >
              {equippedRoom.image ? (
                <img
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  src={equippedRoom.image}
                />
              ) : !equippedRoom.plain ? (
                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(135deg,rgba(255,255,255,.22)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.22)_50%,rgba(255,255,255,.22)_62%,transparent_62%,transparent)] [background-size:28px_28px]" />
              ) : null}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  <CoinsIcon />
                  {coins}
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#2f2e38] px-3 py-2 text-sm font-bold text-slate-100 shadow-md">
                  Mood: {pennyMonMood}
                </div>
              </div>
              <button
                className={`absolute right-4 top-[4.2rem] z-10 grid size-9 place-items-center rounded-full border border-white/15 bg-[#2f2e38] text-sm font-black text-white shadow-md ${
                  isPennyMonThinking ? 'pointer-events-none opacity-45' : ''
                }`}
                disabled={isPennyMonThinking}
                onClick={() => {
                  pennyMonLastTapRef.current = 0
                  setIsPennyMonPresetsOpen(false)
                  setPennyMonAnswer('')
                  setIsPennyMonHelpOpen(true)
                }}
                type="button"
              >
                ?
              </button>
              <div className="relative flex h-full flex-col items-center justify-start px-5 pb-24 pt-[5.05rem] text-center">
                <h2 className="text-lg font-black tracking-wide text-white [text-shadow:0_2px_0_rgba(0,0,0,.35)]">
                  PennyMon
                </h2>
                <div className="relative mt-3">
                  <button
                    className="rounded-[2rem] outline-none transition duration-300 active:scale-[0.98]"
                    onClick={handlePennyMonTap}
                    type="button"
                  >
                    <PennyMonPet
                      accessory={equipped.accessory}
                      color={equipped.color}
                      mood={pennyMonMood}
                      large
                    />
                    <span className="sr-only">Show PennyMon question ideas</span>
                  </button>
                  {isPennyMonPresetsOpen && (
                    <PennyMonPresetQuestions
                      onAsk={sendPennyMonMessage}
                      onClose={() => setIsPennyMonPresetsOpen(false)}
                      questions={pennyMonQuickQuestions}
                      trayClassName={pennyMonAskTrayClass}
                    />
                  )}
                </div>
                <div className="hidden">
                  <p className="text-sm font-semibold text-slate-950">
                    Equipped
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {equipped.accessory} · {equipped.color} · {equipped.room}
                  </p>
                </div>
              </div>

              {!isPennyMonShopOpen &&
                !isPennyMonHelpOpen &&
                !isPennyMonPresetsOpen &&
                !isPennyMonThinking &&
                !pennyMonAnswer && (
                <div className="fixed bottom-[calc(112px+env(safe-area-inset-bottom))] left-1/2 z-[110] grid w-full max-w-md -translate-x-1/2 grid-cols-3 px-8">
                  <PennyMonDockButton
                    icon={Glasses}
                    label="Accessories"
                    onClick={() => setIsAccessoryPickerOpen(true)}
                    tone="violet"
                  />
                  <PennyMonDockButton
                    icon={Home}
                    label="Room"
                    onClick={() => setIsRoomPickerOpen(true)}
                    tone="sky"
                  />
                  <PennyMonDockButton
                    icon={Palette}
                    label="Colour"
                    onClick={() => setIsColorPickerOpen(true)}
                    tone="gold"
                  />
                </div>
              )}
              {isRoomPickerOpen && (
                <RoomPickerModal
                  currentRoom={equipped.room}
                  coins={coins}
                  onClose={() => setIsRoomPickerOpen(false)}
                  onEquip={equipRoom}
                  onPurchase={(room) => requestPurchase('rooms', room)}
                  ownedItems={ownedItems.rooms}
                  rooms={roomOptions}
                />
              )}
              {isColorPickerOpen && (
                <ColorPickerModal
                  colors={colorOptions}
                  coins={coins}
                  currentColor={equipped.color}
                  onClose={() => setIsColorPickerOpen(false)}
                  onEquip={equipColor}
                  onPurchase={(color) => requestPurchase('colors', color)}
                  ownedItems={ownedItems.colors}
                />
              )}
              {isAccessoryPickerOpen && (
                <AccessoryPickerModal
                  accessories={accessoryOptions}
                  coins={coins}
                  color={equipped.color}
                  currentAccessory={equipped.accessory}
                  mood={pennyMonMood}
                  onClose={() => setIsAccessoryPickerOpen(false)}
                  onEquip={equipAccessory}
                  onPurchase={(accessory) => requestPurchase('accessories', accessory)}
                  ownedItems={ownedItems.accessories}
                />
              )}
              <PennyMonAnswerBubble
                answer={pennyMonAnswer}
                isThinking={isPennyMonThinking}
                onClose={() => setPennyMonAnswer('')}
                trayClassName={pennyMonAnswerTrayClass}
              />
              {isPennyMonHelpOpen && (
                <PennyMonHelpCard onClose={() => setIsPennyMonHelpOpen(false)} />
              )}
            </div>
          </section>
        )}
      </section>

      {!isModalOpen && (
        <nav
          className="fixed bottom-0 left-1/2 right-0 z-[100] h-[calc(88px+env(safe-area-inset-bottom))] w-full max-w-md -translate-x-1/2 border-t border-white/[0.06] bg-[rgba(30,27,46,0.92)] px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-18px_36px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
        >
          <div className="flex h-[88px] items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const selected = activeTab === tab.id
              const isAdd = tab.id === 'expense'
              const isLocked = ['expense', 'pennymon'].includes(tab.id) && !hasCompletedSetup
              return (
                <button
                className={`flex h-16 min-w-[62px] flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-[0.74rem] font-semibold ${
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
                    if (isMoodInfoOpen) return
                    setActiveForm(null)
                    setIsCalendarOpen(false)
                    setIsRoomPickerOpen(false)
                    setIsColorPickerOpen(false)
                    setIsAccessoryPickerOpen(false)
                    setIsPennyMonPresetsOpen(false)
                    setIsPennyMonHelpOpen(false)
                    setActiveTab(tab.id)
                  }}
                >
                  <span
                    className={
                      isLocked
                        ? 'opacity-45'
                        : isAdd
                        ? 'grid size-11 place-items-center rounded-full bg-[#6A4DF5] text-white shadow-lg shadow-[#6A4DF5]/30'
                        : ''
                    }
                  >
                    <Icon size={isAdd ? 27 : selected ? 23 : 21} strokeWidth={2.35} />
                  </span>
                  <span className="max-w-full truncate whitespace-nowrap leading-none">
                    {isLocked ? 'Locked' : tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

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
                    isPiggyBank: isPiggyBankEligibleType(event.target.value)
                      ? current.isPiggyBank
                      : false,
                  }))
                }
                value={walletForm.type}
              >
                <option>Bank</option>
                <option>Cash</option>
                <option>E-wallet</option>
                <option>Pay later</option>
                <option>Credit</option>
              </select>
            </Field>
            {isPiggyBankEligibleType(walletForm.type) && (
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#6A4DF5]/25 bg-[#6A4DF5]/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#d8d3ff]">
                    Mark as PiggyBank
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Keep this balance out of safe-to-spend.
                  </p>
                </div>
                <input
                  checked={walletForm.isPiggyBank}
                  className="size-5 accent-[#6A4DF5]"
                  onChange={(event) =>
                    setWalletForm((current) => ({
                      ...current,
                      isPiggyBank: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
              </label>
            )}
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
            <AnimatedSubmitButton isSaving={savingAction === 'wallet'}>
              {editingId ? 'Update wallet' : 'Save wallet'}
            </AnimatedSubmitButton>
          </form>
        </FormSheet>
      )}

      {activeForm === 'walletAmount' && (
        <FormSheet
          title="Add Amount"
          onClose={closeForm}
        >
          <form className="space-y-4" onSubmit={addWalletAmount}>
            <Field label="Amount to add">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                inputMode="decimal"
                onChange={(event) =>
                  setWalletAmountForm({ amount: event.target.value })
                }
                placeholder="100"
                type="number"
                value={walletAmountForm.amount}
              />
            </Field>
            <AnimatedSubmitButton isSaving={savingAction === 'walletAmount'}>
              Add amount
            </AnimatedSubmitButton>
          </form>
        </FormSheet>
      )}

      {activeForm === 'budgetLimit' && (
        <FormSheet
          title="Add Limit"
          onClose={closeForm}
        >
          <form className="space-y-4" onSubmit={addBudgetLimit}>
            <Field label="Limit to add">
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#202020] px-4 py-3 text-slate-100 outline-none focus:border-[#6A4DF5]"
                inputMode="decimal"
                onChange={(event) =>
                  setWalletAmountForm({ amount: event.target.value })
                }
                placeholder="100"
                type="number"
                value={walletAmountForm.amount}
              />
            </Field>
            <AnimatedSubmitButton isSaving={savingAction === 'budgetLimit'}>
              Add limit
            </AnimatedSubmitButton>
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
            <AnimatedSubmitButton isSaving={savingAction === 'budget'}>
              {editingId ? 'Update budget' : 'Save budget'}
            </AnimatedSubmitButton>
          </form>
        </FormSheet>
      )}

      {pendingPurchase && (
        <ConfirmPurchaseModal
          item={pendingPurchase.item}
          onCancel={() => setPendingPurchase(null)}
          onConfirm={confirmPurchase}
        />
      )}

      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

    </main>
  )
}

function PennyMonAnswerBubble({ answer, isThinking, onClose, trayClassName }) {
  if (!answer && !isThinking) return null

  return (
    <div className={trayClassName}>
      <button
        className="w-full rounded-[1.75rem] border border-white/12 bg-[#202020]/88 p-4 text-left shadow-2xl shadow-black/45 ring-1 ring-white/10 backdrop-blur-2xl disabled:opacity-100"
        disabled={isThinking}
        onClick={onClose}
        type="button"
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a99cff]">
            PennyMon says
          </p>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300">
            {isThinking ? 'Thinking' : 'Tap to close'}
          </span>
        </div>
        <p className="text-sm font-bold leading-snug text-white">
          {isThinking ? (
            <PennyMonThinkingDots />
          ) : (
            <TypewriterText key={answer} text={answer} />
          )}
        </p>
      </button>
    </div>
  )
}

function PennyMonThinkingDots() {
  return (
    <span className="flex items-center gap-2">
      <span className="text-slate-300">PennyMon is checking your money</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            className="size-1.5 animate-[pennyThinkingDot_1s_ease-in-out_infinite] rounded-full bg-[#a99cff]"
            key={dot}
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </span>
    </span>
  )
}

function TypewriterText({ text }) {
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTypedLength((current) => {
        const next = current + 1

        if (next >= text.length) {
          window.clearInterval(intervalId)
        }

        return next
      })
    }, 18)

    return () => window.clearInterval(intervalId)
  }, [text])

  const isTyping = typedLength < text.length

  return (
    <>
      {text.slice(0, typedLength)}
      {isTyping && (
        <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-[#a99cff]" />
      )}
    </>
  )
}

function PennyMonHelpCard({ onClose }) {
  return (
    <div className="absolute inset-0 z-[65] grid place-items-center bg-black/45 px-6 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-[2rem] border border-white/10 bg-[#202020] p-5 text-center text-slate-100 shadow-2xl shadow-black/45">
        <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#6A4DF5] text-lg font-black text-white">
          ?
        </div>
        <h3 className="mt-4 text-lg font-black text-white">Ask PennyMon</h3>
        <p className="mt-2 text-sm font-medium leading-snug text-slate-400">
          Double tap PennyMon to open the Ask PennyMon card. Pick a quick question, and PennyMon will explain your spending, budget, wallet, debt, or mood.
        </p>
        <button
          className="mt-5 w-full rounded-2xl bg-[#6A4DF5] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#6A4DF5]/20"
          onClick={onClose}
          type="button"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

function PennyMonPresetQuestions({ onAsk, onClose, questions, trayClassName }) {
  return (
    <div className={trayClassName}>
      <div className="animate-[pennyTrayIn_1.5s_cubic-bezier(.2,.8,.2,1)_both] rounded-[1.75rem] border border-white/12 bg-[#202020]/88 p-2.5 text-left shadow-2xl shadow-black/45 ring-1 ring-white/10 backdrop-blur-2xl">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a99cff]">
              Ask PennyMon
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              Pick a quick finance question
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300">
              AI
            </span>
            <button
              aria-label="Close Ask PennyMon"
              className="grid size-7 place-items-center rounded-full bg-white/10 text-xs font-black text-slate-300 transition active:scale-95"
              onClick={onClose}
              type="button"
            >
              x
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {questions.map((question, index) => (
            <button
              className="animate-[pennyChipIn_380ms_cubic-bezier(.2,.8,.2,1)_both] rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-2 text-left text-[0.72rem] font-extrabold leading-tight text-white shadow-sm transition active:scale-[0.98] active:bg-[#6A4DF5]/45"
              key={question}
              onClick={() => onAsk(question)}
              style={{ animationDelay: `${120 + index * 46}ms` }}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfirmPurchaseModal({ item, onCancel, onConfirm }) {
  return (
    <div className="absolute inset-0 z-[70] grid place-items-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#202020] p-5 text-center text-slate-100 shadow-2xl shadow-black/45">
        <p className="text-lg font-bold text-white">Purchase item?</p>
        <p className="mt-2 text-sm leading-snug text-slate-400">
          Buy {item.name} for {item.price} Monny? This will spend your Monny.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-200"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-2xl bg-[#6A4DF5] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#6A4DF5]/20"
            onClick={onConfirm}
            type="button"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  )
}

function AnimatedSubmitButton({ children, isSaving }) {
  return (
    <button
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl border px-4 py-3 font-semibold text-white shadow-lg transition active:scale-[0.98] ${
        isSaving
          ? 'border-white/12 bg-[#202020]/88 shadow-black/35 ring-1 ring-white/10 backdrop-blur-2xl'
          : 'border-transparent bg-[#6A4DF5] shadow-[#6A4DF5]/20'
      }`}
      disabled={isSaving}
      type="submit"
    >
      <span className="flex items-center gap-2">
        <span>{isSaving ? 'Saving' : children}</span>
        {isSaving && <AnimatedSavingDots />}
      </span>
    </button>
  )
}

function AnimatedSavingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((dot) => (
        <span
          className="size-1.5 animate-[pennyThinkingDot_1s_ease-in-out_infinite] rounded-full bg-[#a99cff]"
          key={dot}
          style={{ animationDelay: `${dot * 140}ms` }}
        />
      ))}
    </span>
  )
}

function SuccessPopup({ message, onClose }) {
  return (
    <div className="absolute inset-0 z-[70] grid place-items-center bg-black/45 px-6 backdrop-blur-sm">
      <div className="animate-[pennyTrayIn_1.5s_cubic-bezier(.2,.8,.2,1)_both] w-full max-w-xs rounded-[2rem] border border-white/10 bg-[#202020]/88 p-5 text-center text-slate-100 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-2xl">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#6A4DF5] text-lg font-black text-white shadow-lg shadow-[#6A4DF5]/25">
          ✓
        </div>
        <p className="mt-4 text-lg font-bold text-white">Successful</p>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <button
          className="mt-5 w-full rounded-2xl bg-[#6A4DF5] px-4 py-3 text-sm font-bold text-white"
          onClick={onClose}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  )
}

function PennyMonNavIcon({ size = 19 }) {
  return (
    <img
      alt=""
      className="object-contain"
      src={happyPennyMon}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

function TodayInsight({ hasCompletedSetup, onAddExpense, stats }) {
  if (!stats.count) {
    return (
      <div className="flex h-[calc(100%-2.25rem)] flex-col">
        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-[1.75rem] bg-white/16 px-5 py-6 text-center ring-1 ring-white/25 backdrop-blur-md">
          <p className="text-lg font-bold text-white">
            {hasCompletedSetup ? 'No spending yet' : 'Setup needed first'}
          </p>
          <p className="mt-2 max-w-[14rem] text-sm font-medium leading-snug text-white/72">
            {hasCompletedSetup
              ? 'No expenses recorded for today.'
              : 'Add one wallet and one budget before logging expenses.'}
          </p>
          <button
            className="mt-5 rounded-full bg-[#a99cff] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#3e2aaf]/20 transition active:scale-[0.98] disabled:bg-white/18 disabled:text-white/55 disabled:shadow-none"
            disabled={!hasCompletedSetup}
            onClick={(event) => {
              event.stopPropagation()
              if (!hasCompletedSetup) return
              onAddExpense()
            }}
            type="button"
          >
            {hasCompletedSetup ? 'Add expense +' : 'Add wallet & budget first'}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-white/65">
          <span className="truncate">0 transactions</span>
          <span className="shrink-0">{formatExpenseDate(stats.date)}</span>
        </div>
      </div>
    )
  }

  const pieColors = ['#ffffff', '#c8c0ff', '#62d6c8', '#ffd166', '#ff8fab', '#9bf6ff']
  const rows = stats.topCategories.map((row, index) => ({
    ...row,
    color: pieColors[index % pieColors.length],
    exactPercent: stats.spent ? (row.amount / stats.spent) * 100 : 0,
    percent: stats.spent ? Math.round((row.amount / stats.spent) * 100) : 0,
  }))
  const pieGradient = rows
    .reduce(
      (segments, row) => {
        const start = segments.total
        const end = start + row.exactPercent

        return {
          total: end,
          values: [...segments.values, `${row.color} ${start}% ${end}%`],
        }
      },
      { total: 0, values: [] },
    )
    .values
    .join(', ')
  const isOverDailySafe = stats.spent > stats.safeSpend && stats.safeSpend > 0
  const statusLabel = isOverDailySafe
    ? 'Over safe spend'
    : stats.spent <= 20
      ? 'Under RM20'
      : stats.status

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl bg-[#202020]/25 p-3.5 ring-1 ring-white/15">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">
            Today's spending
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/70">
            RM{formatMoneyAmount(stats.spent)} spent today
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
            isOverDailySafe
              ? 'bg-red-500/20 text-red-100'
              : stats.spent <= 20
                ? 'bg-emerald-400/20 text-emerald-100'
                : 'bg-white/15 text-white'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 rounded-2xl bg-white/12 p-3 ring-1 ring-white/15">
        <div className="flex items-center gap-3">
          <div
            className="grid size-20 shrink-0 place-items-center rounded-full shadow-lg shadow-black/15"
            style={{ background: `conic-gradient(${pieGradient})` }}
          >
            <div className="grid size-10 place-items-center rounded-full bg-[#5b45e9] text-center text-xs font-black text-white">
              {stats.count}
            </div>
          </div>
          <div className="max-h-[5.5rem] min-w-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
            {rows.map((row) => (
              <div className="flex items-center gap-2" key={row.name}>
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-white/82">
                  {row.name}
                </p>
                <p className="shrink-0 text-xs font-bold text-white">
                  {row.percent}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center text-xs font-semibold text-white/60">
        <span>{stats.count} transactions</span>
      </div>
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

function CalendarPopover({ onClose, onSelect, selectedDate }) {
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="max-h-[88dvh] w-full max-w-sm overflow-y-auto rounded-[2rem] border border-white/10 bg-[#2f2e38] p-5 text-slate-100 shadow-2xl shadow-black/50">
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
            onClick={() => onSelect(getLocalDateKey(new Date()))}
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

function isOwnedItem(ownedItems, kind, itemId) {
  return Boolean(ownedItems?.[kind]?.includes(itemId))
}

function normalizeAccessory(accessory) {
  if (!accessory) return 'None'
  const normalized = accessory.toLowerCase().trim()
  const match = accessoryOptions.find(
    (item) => item.id.toLowerCase() === normalized || item.name.toLowerCase() === normalized,
  )

  if (normalized.includes('glass')) return 'Glasses'
  if (normalized.includes('headphone')) return 'Headphone'
  if (normalized.includes('flower')) return 'Flower Head'
  if (normalized.includes('space')) return 'Space Bowl'

  return match?.id || 'None'
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const updateField = (field, value) => {
    onChange((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-[#202020] shadow-2xl shadow-black/40 animate-[tabPageIn_700ms_cubic-bezier(.2,.8,.2,1)_both]">
      <section className="grid min-h-0 flex-1 place-items-center overflow-hidden bg-[#202020] px-7">
        <div
          className="w-full max-w-sm text-slate-100 animate-[tabPageIn_700ms_cubic-bezier(.2,.8,.2,1)_both]"
          key={authMode}
        >
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
              action={
                <button
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-slate-400 transition active:scale-95"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  type="button"
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              icon={Lock}
              label="Password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 6 characters"
              type={isPasswordVisible ? 'text' : 'password'}
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
  action,
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
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-slate-600"
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {action}
      </div>
    </label>
  )
}

function PennyMonPet({
  accessory = 'None',
  color = 'Default',
  large = false,
  mood = 'Happy',
  size = 'default',
}) {
  const imageSet = pennyMonColorSets[color] || pennyMonColorSets.Default
  const image = imageSet[mood] || imageSet.Happy || happyPennyMon
  const accessoryItem =
    accessoryOptions.find((item) => item.id === accessory) || accessoryOptions[0]
  const sizeClass = large
    ? 'h-[21rem] w-[21rem] max-h-[43dvh] max-w-[88vw]'
    : size === 'card'
      ? 'size-36'
    : size === 'home'
      ? 'size-48'
      : 'size-32'

  return (
    <div
      className={`relative mx-auto grid place-items-center overflow-hidden ${sizeClass}`}
      aria-label="PennyMon character"
    >
      <img
        alt={`${mood} PennyMon`}
        className="h-full w-full object-contain drop-shadow-xl"
        decoding="sync"
        fetchPriority="high"
        loading="eager"
        src={image}
      />
      {accessoryItem.image && (
        <img
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-md"
          decoding="sync"
          fetchPriority="high"
          loading="eager"
          src={accessoryItem.image}
        />
      )}
    </div>
  )
}

function CoinsIcon() {
  return (
    <span className="grid size-6 place-items-center rounded-full bg-[#6A4DF5] text-xs font-black text-white">
      M
    </span>
  )
}

function PennyMonDockButton({ icon: Icon, label, onClick, tone }) {
  const tones = {
    gold: 'from-amber-200 to-orange-300 text-amber-950 shadow-orange-950/25',
    sky: 'from-sky-200 to-cyan-300 text-sky-950 shadow-sky-950/25',
    violet: 'from-violet-200 to-[#b6a7ff] text-[#322070] shadow-violet-950/25',
  }

  return (
    <button
      className="group flex flex-col items-center gap-1 justify-self-center text-xs font-black text-white [text-shadow:0_2px_0_rgba(0,0,0,.35)]"
      onClick={onClick}
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

function RoomPickerModal({
  coins,
  currentRoom,
  onClose,
  onEquip,
  onPurchase,
  ownedItems,
  rooms,
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/45 px-5 py-6 backdrop-blur-sm">
      <div className="flex max-h-[82dvh] w-full max-w-sm flex-col rounded-[2rem] border border-white/10 bg-[#202020] p-4 shadow-2xl shadow-black/40">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8cff]">
              Room
            </p>
            <h3 className="text-xl font-bold text-white">Choose background</h3>
          </div>
          <button
            className="grid size-10 place-items-center rounded-2xl bg-white/10 text-slate-200"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {rooms.map((room) => {
            const isEquipped = currentRoom === room.id
            const isOwned = isOwnedItem({ rooms: ownedItems }, 'rooms', room.id)
            const canAfford = coins >= room.price

            return (
              <button
                className={`flex items-center gap-3 rounded-3xl border p-3 text-left transition ${
                  isEquipped
                    ? 'border-[#6A4DF5] bg-[#6A4DF5]/15'
                    : !isOwned && !canAfford
                      ? 'border-white/10 bg-white/[0.03] opacity-60'
                    : 'border-white/10 bg-white/[0.04] active:bg-white/10'
                }`}
                key={room.id}
                onClick={() => (isOwned ? onEquip(room) : onPurchase(room))}
                type="button"
              >
                <div
                  className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${room.preview} shadow-lg`}
                >
                  {room.image ? (
                    <img
                      alt=""
                      className="h-full w-full object-cover"
                      src={room.image}
                    />
                  ) : !room.plain ? (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.28),transparent_32%)]" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{room.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {isOwned ? 'Owned' : `${room.price} Monny`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isEquipped
                      ? 'bg-[#6A4DF5] text-white'
                      : !isOwned && canAfford
                        ? 'bg-[#eeeaff] text-[#6A4DF5]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {isEquipped ? 'Equipped' : isOwned ? 'Equip' : canAfford ? 'Buy' : 'Locked'}
                </span>
              </button>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorPickerModal({
  coins,
  colors,
  currentColor,
  onClose,
  onEquip,
  onPurchase,
  ownedItems,
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/45 px-5 backdrop-blur-sm">
      <div className="flex max-h-[84dvh] w-full max-w-sm flex-col rounded-[2rem] border border-white/10 bg-[#202020] p-4 shadow-2xl shadow-black/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8cff]">
              Colour
            </p>
            <h3 className="text-xl font-bold text-white">Choose PennyMon</h3>
          </div>
          <button
            className="grid size-10 place-items-center rounded-2xl bg-white/10 text-slate-200"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {colors.map((color) => {
            const isEquipped = currentColor === color.id
            const isOwned = isOwnedItem({ colors: ownedItems }, 'colors', color.id)
            const canAfford = coins >= color.price

            return (
              <button
                className={`rounded-3xl border p-3 text-center transition ${
                  isEquipped
                    ? 'border-[#6A4DF5] bg-[#6A4DF5]/15'
                    : !isOwned && !canAfford
                      ? 'border-white/10 bg-white/[0.03] opacity-60'
                    : 'border-white/10 bg-white/[0.04] active:bg-white/10'
                }`}
                key={color.id}
                onClick={() => (isOwned ? onEquip(color) : onPurchase(color))}
                type="button"
              >
                <div className="relative mx-auto grid size-20 place-items-center overflow-hidden rounded-2xl bg-white/10">
                  <span className={`absolute inset-x-3 bottom-2 h-3 rounded-full ${color.swatch}`} />
                  <img
                    alt=""
                    className="relative h-full w-full object-contain drop-shadow-lg"
                    src={color.preview}
                  />
                </div>
                <p className="mt-2 text-sm font-bold text-white">{color.name}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  {isEquipped
                    ? 'Equipped'
                    : isOwned
                      ? 'Owned'
                      : canAfford
                        ? `${color.price} Monny`
                        : `Need ${color.price} Monny`}
                </p>
              </button>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessoryPickerModal({
  accessories,
  coins,
  color,
  currentAccessory,
  mood,
  onClose,
  onEquip,
  onPurchase,
  ownedItems,
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/45 px-5 py-6 backdrop-blur-sm">
      <div className="flex max-h-[84dvh] w-full max-w-sm flex-col rounded-[2rem] border border-white/10 bg-[#202020] p-4 shadow-2xl shadow-black/40">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8cff]">
              Accessories
            </p>
            <h3 className="text-xl font-bold text-white">Choose accessory</h3>
          </div>
          <button
            className="grid size-10 place-items-center rounded-2xl bg-white/10 text-slate-200"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {accessories.map((accessory) => {
            const isEquipped = currentAccessory === accessory.id
            const isOwned = isOwnedItem(
              { accessories: ownedItems },
              'accessories',
              accessory.id,
            )
            const canAfford = coins >= accessory.price

            return (
              <button
                className={`rounded-3xl border p-3 text-center transition ${
                  isEquipped
                    ? 'border-[#6A4DF5] bg-[#6A4DF5]/15'
                    : !isOwned && !canAfford
                      ? 'border-white/10 bg-white/[0.03] opacity-60'
                    : 'border-white/10 bg-white/[0.04] active:bg-white/10'
                }`}
                key={accessory.id}
                onClick={() =>
                  isOwned ? onEquip(accessory) : onPurchase(accessory)
                }
                type="button"
              >
                <div className={`mx-auto grid size-24 place-items-center overflow-hidden rounded-2xl ${accessory.previewClass}`}>
                  <PennyMonPet
                    accessory={accessory.id}
                    color={color}
                    mood={mood}
                    size="default"
                  />
                </div>
                <p className="mt-2 text-sm font-bold text-white">{accessory.name}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  {isEquipped
                    ? 'Equipped'
                    : isOwned
                      ? 'Owned'
                      : canAfford
                        ? `${accessory.price} Monny`
                        : `Need ${accessory.price} Monny`}
                </p>
              </button>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}

function SwipeActionCard({
  actionWidth = 216,
  addLabel = 'Add',
  cardId,
  children,
  className,
  draggedCard,
  onAdd,
  onDelete,
  onEdit,
  setDraggedCard,
  setSwipedCardId,
  setTouchStartX,
  swipedCardId,
  touchStartX,
}) {
  const isDragging = draggedCard.id === cardId
  const isOpen = swipedCardId === cardId
  const translateX = isDragging
    ? draggedCard.offset
    : isOpen
      ? -actionWidth
      : 0

  const closeActions = () => {
    setSwipedCardId(null)
    setDraggedCard({ id: null, offset: 0 })
    setTouchStartX(null)
  }

  const runAction = (action) => {
    closeActions()
    action()
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-transparent">
      <div
        className="absolute inset-y-0 right-0 grid grid-cols-3 gap-1 py-1 pl-1 text-[10px] font-black text-white"
        style={{ width: actionWidth }}
      >
        <button
          className="grid place-items-center rounded-2xl bg-[#6A4DF5] shadow-sm shadow-[#6A4DF5]/20"
          onClick={() => runAction(onAdd)}
          type="button"
        >
          <span className="flex flex-col items-center gap-1 leading-none">
            <span className="grid size-7 place-items-center rounded-full bg-white/18">
              <Plus size={15} />
            </span>
            {addLabel}
          </span>
        </button>
        <button
          className="grid place-items-center rounded-2xl bg-[#3a3a44]"
          onClick={() => runAction(onEdit)}
          type="button"
        >
          <span className="flex flex-col items-center gap-1 leading-none">
            <span className="grid size-7 place-items-center rounded-full bg-white/14">
              <Edit3 size={15} />
            </span>
            Edit
          </span>
        </button>
        <button
          className="grid place-items-center rounded-2xl bg-[#b91c1c]"
          onClick={() => runAction(onDelete)}
          type="button"
        >
          <span className="flex flex-col items-center gap-1 leading-none">
            <span className="grid size-7 place-items-center rounded-full bg-white/16">
              <Trash2 size={15} />
            </span>
            Delete
          </span>
        </button>
      </div>
      <div
        className={`touch-pan-y will-change-transform ${className}`}
        onPointerCancel={closeActions}
        onPointerDown={(event) => {
          if (!event.isPrimary) return
          event.currentTarget.setPointerCapture(event.pointerId)
          setTouchStartX(event.clientX)
          setSwipedCardId(null)
        }}
        onPointerMove={(event) => {
          if (touchStartX === null) return
          const deltaX = event.clientX - touchStartX
          const offset = Math.max(Math.min(deltaX, 0), -actionWidth)
          setDraggedCard({ id: cardId, offset })
        }}
        onPointerUp={(event) => {
          if (touchStartX === null) return
          const deltaX = event.clientX - touchStartX
          setSwipedCardId(deltaX < -52 ? cardId : null)
          setDraggedCard({ id: null, offset: 0 })
          if (deltaX > 42) setSwipedCardId(null)
          setTouchStartX(null)
        }}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(.22,1,.36,1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#2f2e38] p-3 text-slate-100 shadow-sm">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

function HomeLoadingState() {
  return (
    <div className="space-y-4 pt-3.5 animate-[homeContentIn_700ms_cubic-bezier(.2,.8,.2,1)_both]">
      <div className="grid h-[315px] place-items-center rounded-[2rem] bg-[#6A4DF5] bg-[radial-gradient(circle_at_24%_7%,rgba(255,255,255,.28),transparent_34%),linear-gradient(135deg,#8d63ff_0%,#6A4DF5_48%,#4f35df_100%)] p-5 text-center text-white shadow-xl shadow-[#6A4DF5]/20">
        <div className="rounded-[1.75rem] bg-white/18 px-5 py-4 ring-1 ring-white/25 backdrop-blur-md">
          <p className="text-sm font-bold text-white/75">Preparing PennyMon</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-lg font-black text-white">
            <span>Syncing your home</span>
            <AnimatedSavingDots />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((item) => (
          <div
            className="h-[74px] rounded-3xl border border-white/10 bg-[#2f2e38] opacity-70"
            key={item}
          />
        ))}
      </div>
    </div>
  )
}

function AppBootLoading() {
  return (
    <main className="relative mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-[#202020] px-5 pt-6 shadow-2xl shadow-black/40">
      <div className="pb-3.5">
        <p className="text-sm font-semibold text-[#6A4DF5]">PennyMon</p>
        <h1 className="text-2xl font-semibold text-white">Preparing home</h1>
      </div>
      <HomeLoadingState />
    </main>
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
    <div className="absolute inset-0 z-50 grid place-items-end bg-black/50">
      <section className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#2f2e38] p-5 text-slate-100 shadow-2xl">
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

function ExpenseSelect({ children, onChange, value }) {
  return (
    <div className="relative">
      <select
        className="min-h-[3.25rem] w-full appearance-none rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 pr-10 text-sm font-bold text-slate-100 shadow-inner shadow-black/20 outline-none transition focus:border-[#6A4DF5] focus:ring-2 focus:ring-[#6A4DF5]/20"
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/[0.06] text-slate-400">
        <ChevronDown size={16} strokeWidth={2.6} />
      </span>
    </div>
  )
}

function ActionHeader({ icon: Icon, title, subtitle, onAction }) {
  return (
    <div className="flex items-center justify-between rounded-[2rem] bg-[#171717] p-5 text-white shadow-lg shadow-black/30">
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
