import { defineStore } from 'pinia'
import { computed } from 'vue'
import { storageService } from '@/services/storage'
import { useAuthStore } from './auth'

export const useUserStatsStore = defineStore('userStats', () => {
  const authStore = useAuthStore()

  const level = computed(() => authStore.currentUser?.level || 1)
  const totalGems = computed(() => authStore.currentUser?.totalGems || 0)
  const totalStars = computed(() => authStore.currentUser?.totalStars || 0)

  const starsToNextLevel = computed(() => {
    const starsInCurrentLevel = totalStars.value % 10
    return 10 - starsInCurrentLevel
  })

  const levelProgress = computed(() => {
    const starsInCurrentLevel = totalStars.value % 10
    return (starsInCurrentLevel / 10) * 100
  })

  const addGems = (amount: number) => {
    if (!authStore.currentUser) return

    storageService.addGems(authStore.currentUser.id, amount)
    authStore.refreshUser()
  }

  const addStars = (amount: number) => {
    if (!authStore.currentUser) return

    const oldLevel = level.value
    storageService.addStars(authStore.currentUser.id, amount)
    authStore.refreshUser()
    
    // Check if leveled up
    const newLevel = level.value
    if (newLevel > oldLevel) {
      return { leveledUp: true, newLevel }
    }
    
    return { leveledUp: false, newLevel }
  }

  const canPurchase = (cost: number): boolean => {
    return totalGems.value >= cost
  }

  const spendGems = (amount: number): boolean => {
    if (!canPurchase(amount)) return false

    if (!authStore.currentUser) return false

    storageService.updateUser(authStore.currentUser.id, {
      totalGems: totalGems.value - amount,
    })
    authStore.refreshUser()
    
    return true
  }

  return {
    level,
    totalGems,
    totalStars,
    starsToNextLevel,
    levelProgress,
    addGems,
    addStars,
    canPurchase,
    spendGems,
  }
})

