import {
  BadgeCheck,
  Banknote,
  Home,
  Moon,
  Plus,
  Shirt,
  ShoppingBag,
  Sun,
  Target,
  Trophy,
  WalletCards,
} from 'lucide-react'
import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [coins, setCoins] = useState(85)
  const [equipped] = useState({
    outfit: 'Mint hoodie',
    accessory: 'Round glasses',
    room: 'Cozy desk',
  })

  const accounts = [
    { name: 'Maybank', type: 'Bank', balance: 820, tone: 'bg-[#eeeaff]' },
    { name: 'CIMB', type: 'Bank', balance: 360, tone: 'bg-slate-100' },
    { name: 'Cash', type: 'Cash', balance: 90, tone: 'bg-zinc-100' },
    { name: 'TNG eWallet', type: 'E-wallet', balance: 74, tone: 'bg-[#f3f1ff]' },
    { name: 'SPayLater', type: 'Pay later', balance: -120, tone: 'bg-rose-50' },
    { name: 'GrabPay', type: 'E-wallet', balance: 48, tone: 'bg-[#eeeaff]' },
    { name: 'ShopeePay', type: 'E-wallet', balance: 32, tone: 'bg-zinc-100' },
    { name: 'Savings', type: 'Saving', balance: 500, tone: 'bg-[#f3f1ff]' },
    { name: 'Credit Card', type: 'Credit', balance: -280, tone: 'bg-rose-50' },
  ]

  const budgets = [
    { name: 'Food', spent: 310, limit: 500, color: 'bg-[#6A4DF5]' },
    { name: 'Transport', spent: 92, limit: 180, color: 'bg-slate-700' },
    { name: 'Shopping', spent: 210, limit: 260, color: 'bg-zinc-500' },
    { name: 'Bills', spent: 160, limit: 300, color: 'bg-[#9787ff]' },
    { name: 'Groceries', spent: 240, limit: 420, color: 'bg-[#6A4DF5]' },
    { name: 'Entertainment', spent: 85, limit: 150, color: 'bg-slate-700' },
    { name: 'Health', spent: 45, limit: 120, color: 'bg-zinc-500' },
    { name: 'Savings', spent: 180, limit: 300, color: 'bg-[#9787ff]' },
  ]

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

  const completeQuest = (coinReward) => {
    setCoins((current) => current + coinReward)
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallets', label: 'Wallets', icon: WalletCards },
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
            />
            <div className="grid grid-cols-2 gap-3 pb-6">
              {accounts.map((account) => (
                <div
                  className={`min-h-40 rounded-2xl border p-4 shadow-sm ${theme.card}`}
                  key={account.name}
                >
                  <div
                    className={`grid size-12 place-items-center rounded-xl ${account.tone} text-[#6A4DF5]`}
                  >
                    <Banknote size={21} />
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
                    key={budget.name}
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
                      <span className="rounded-full bg-[#eeeaff] px-2 py-1 text-xs font-semibold text-[#6A4DF5]">
                        {Math.round(progress)}%
                      </span>
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
        className={`fixed bottom-0 left-1/2 grid w-full max-w-md -translate-x-1/2 grid-cols-4 border-t px-3 pb-4 pt-2 ${theme.nav}`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium ${
                selected ? 'bg-[#eeeaff] text-[#6A4DF5]' : theme.navIdle
              }`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={19} />
              {tab.label}
            </button>
          )
        })}
      </nav>
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

function ActionHeader({ icon: Icon, title, subtitle, isDark }) {
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
      <button className="grid size-11 place-items-center rounded-full bg-white text-[#6A4DF5]">
        <Icon size={20} />
      </button>
    </div>
  )
}

export default App
