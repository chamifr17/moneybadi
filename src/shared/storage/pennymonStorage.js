import { getLocalDateKey } from '../utils/date'

export function getOwnedItemsStorageKey(userId) {
  return `pennymon-owned-items-${userId || 'guest'}`
}

export function getQuestStorageKey(userId) {
  return `pennymon-quests-${userId || 'guest'}-${getLocalDateKey(new Date())}`
}

export function getPurchaseStorageKey(userId) {
  return `pennymon-purchases-${userId || 'guest'}-${getLocalDateKey(new Date())}`
}

export function getPiggyBankStorageKey(userId) {
  return `pennymon-piggybank-wallets-${userId || 'guest'}`
}

export function getPiggyBankDepositStorageKey(userId) {
  return `pennymon-piggybank-deposits-${userId || 'guest'}-${getLocalDateKey(new Date())}`
}

export function loadOwnedItems(userId, defaultOwnedItems) {
  const storedItems = localStorage.getItem(getOwnedItemsStorageKey(userId))
  if (!storedItems) return defaultOwnedItems

  try {
    const parsedItems = JSON.parse(storedItems)
    return {
      accessories: [
        ...new Set([
          ...defaultOwnedItems.accessories,
          ...(parsedItems.accessories || []),
        ]),
      ],
      colors: [
        ...new Set([
          ...defaultOwnedItems.colors,
          ...(parsedItems.colors || []),
        ]),
      ],
      rooms: [
        ...new Set([
          ...defaultOwnedItems.rooms,
          ...(parsedItems.rooms || []),
        ]),
      ],
    }
  } catch {
    return defaultOwnedItems
  }
}

export function loadClaimedQuestIds(userId) {
  const storedQuestIds = localStorage.getItem(getQuestStorageKey(userId))
  if (!storedQuestIds) return []

  try {
    const parsedQuestIds = JSON.parse(storedQuestIds)
    return Array.isArray(parsedQuestIds) ? parsedQuestIds : []
  } catch {
    return []
  }
}

export function loadPurchasedTodayIds(userId) {
  const storedPurchaseIds = localStorage.getItem(getPurchaseStorageKey(userId))
  if (!storedPurchaseIds) return []

  try {
    const parsedPurchaseIds = JSON.parse(storedPurchaseIds)
    return Array.isArray(parsedPurchaseIds) ? parsedPurchaseIds : []
  } catch {
    return []
  }
}

export function loadPiggyBankWalletIds(userId) {
  const storedWalletIds = localStorage.getItem(getPiggyBankStorageKey(userId))
  if (!storedWalletIds) return []

  try {
    const parsedWalletIds = JSON.parse(storedWalletIds)
    return Array.isArray(parsedWalletIds) ? parsedWalletIds.map(String) : []
  } catch {
    return []
  }
}

export function loadPiggyBankDepositTodayIds(userId) {
  const storedDepositIds = localStorage.getItem(getPiggyBankDepositStorageKey(userId))
  if (!storedDepositIds) return []

  try {
    const parsedDepositIds = JSON.parse(storedDepositIds)
    return Array.isArray(parsedDepositIds) ? parsedDepositIds.map(String) : []
  } catch {
    return []
  }
}
