export function formatMoneyAmount(amount) {
  const value = Number(amount)

  return value.toLocaleString('en-MY', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}
