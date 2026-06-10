export function getDailyQuests({
  claimedQuestIds,
  piggyBankDepositTodayIds,
  purchasedTodayIds,
  todayStats,
}) {
  const isAfterNinePm = new Date().getHours() >= 21
  const isUnderRm20 = todayStats.spent > 0 && todayStats.spent <= 20

  return [
    {
      id: 'log-one-expense',
      title: 'Log one expense',
      reward: 20,
      done: todayStats.count > 0,
      claimable: todayStats.count > 0,
    },
    {
      id: 'under-rm20-after-9pm',
      title: 'Keep expense under RM20',
      reward: 30,
      done: isUnderRm20,
      claimable: isUnderRm20 && isAfterNinePm,
    },
    {
      id: 'purchase-pennymon-item',
      title: 'Purchase anything for PennyMon',
      reward: 25,
      done: purchasedTodayIds.length > 0,
      claimable: purchasedTodayIds.length > 0,
    },
    {
      id: 'save-rm5-piggybank',
      title: 'Add RM5 to PiggyBank',
      reward: 20,
      done: piggyBankDepositTodayIds.length > 0,
      claimable: piggyBankDepositTodayIds.length > 0,
    },
  ].map((quest) => ({
    ...quest,
    claimed: claimedQuestIds.includes(quest.id),
  }))
}
