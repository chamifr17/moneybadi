export function getLocalDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getExpenseMonthKey(dateString) {
  return dateString.slice(0, 7)
}

export function getWeekOfMonth(date) {
  return Math.min(Math.ceil(date.getDate() / 7), 4)
}

export function formatExpenseDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  })
}

export function formatHomeDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  })
}

export function formatCalendarTitle(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
}

export function getCalendarDays(dateString) {
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

export function formatExpenseMonth(monthKey) {
  const date = new Date(`${monthKey}-01T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatWeekRange(monthKey, week) {
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

  return `Week ${week} - ${startLabel} - ${endLabel}`
}
