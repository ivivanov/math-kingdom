import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storageService } from '@/services/storage'
import { useAuthStore } from './auth'
import { useUserStatsStore } from './userStats'
import type { Item, Badge } from '@/types'

export const useRewardsStore = defineStore('rewards', () => {
  const authStore = useAuthStore()
  const userStatsStore = useUserStatsStore()

  const ownedItems = ref<string[]>([])
  const equippedItems = ref<string[]>([])
  const earnedBadges = ref<string[]>([])

  const loadRewards = () => {
    if (!authStore.currentUser) return

    const userProgress = storageService.getUserProgress(authStore.currentUser.id)
    ownedItems.value = userProgress.ownedItems
    equippedItems.value = userProgress.equippedItems
    earnedBadges.value = userProgress.earnedBadges
  }

  const ownsItem = (itemId: string): boolean => {
    return ownedItems.value.includes(itemId)
  }

  const isItemEquipped = (itemId: string): boolean => {
    return equippedItems.value.includes(itemId)
  }

  const purchaseItem = (item: Item): boolean => {
    if (!authStore.currentUser) return false
    
    if (ownsItem(item.id)) return false
    if (!userStatsStore.canPurchase(item.costGems)) return false

    const success = storageService.purchaseItem(
      authStore.currentUser.id,
      item.id,
      item.costGems
    )

    if (success) {
      ownedItems.value.push(item.id)
      authStore.refreshUser()
    }

    return success
  }

  const equipItem = (itemId: string) => {
    if (!authStore.currentUser) return
    if (!ownsItem(itemId)) return

    storageService.equipItem(authStore.currentUser.id, itemId)
    
    // Toggle equip state
    if (isItemEquipped(itemId)) {
      equippedItems.value = equippedItems.value.filter(id => id !== itemId)
    } else {
      equippedItems.value.push(itemId)
    }
  }

  const awardBadge = (badgeId: string) => {
    if (!authStore.currentUser) return
    if (earnedBadges.value.includes(badgeId)) return

    storageService.awardBadge(authStore.currentUser.id, badgeId)
    earnedBadges.value.push(badgeId)
  }

  const hasBadge = (badgeId: string): boolean => {
    return earnedBadges.value.includes(badgeId)
  }

  const checkBadgeUnlock = (badge: Badge): boolean => {
    if (hasBadge(badge.id)) return false

    const { type, value } = badge.unlockCriteria

    switch (type) {
      case 'quest_complete':
        // Check if specific quest is completed (handled by caller)
        return false
      case 'quests_completed':
        // Check total quests completed (handled by caller)
        return false
      case 'gems_earned':
        return userStatsStore.totalGems >= Number(value)
      case 'stars_earned':
        return userStatsStore.totalStars >= Number(value)
      default:
        return false
    }
  }

  const getEquippedItemsByType = (_type: string) => {
    // This will need to be cross-referenced with the items catalog
    // For now, return all equipped items
    return equippedItems.value
  }

  // Initialize on store creation
  if (authStore.currentUser) {
    loadRewards()
  }

  return {
    ownedItems,
    equippedItems,
    earnedBadges,
    loadRewards,
    ownsItem,
    isItemEquipped,
    purchaseItem,
    equipItem,
    awardBadge,
    hasBadge,
    checkBadgeUnlock,
    getEquippedItemsByType,
  }
})

