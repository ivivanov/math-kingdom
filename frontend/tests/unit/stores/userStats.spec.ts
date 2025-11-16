import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStatsStore } from '@/stores/userStats'
import { useAuthStore } from '@/stores/auth'
import { storageService } from '@/services/storage'

describe('UserStats Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    storageService.clearAllData()
  })

  it('computes level from current user', async () => {
    const authStore = useAuthStore()
    const store = useUserStatsStore()
    
    expect(store.level).toBe(1)
    
    await authStore.createUser('testuser', 'password123')
    
    expect(store.level).toBe(1)
    
    // Add stars to level up
    store.addStars(10)
    
    expect(store.level).toBe(2)
  })

  it('computes totalGems from current user', async () => {
    const authStore = useAuthStore()
    const store = useUserStatsStore()
    
    expect(store.totalGems).toBe(0)
    
    await authStore.createUser('testuser', 'password123')
    
    expect(store.totalGems).toBe(0)
    
    store.addGems(50)
    
    expect(store.totalGems).toBe(50)
  })

  it('computes totalStars from current user', async () => {
    const authStore = useAuthStore()
    const store = useUserStatsStore()
    
    expect(store.totalStars).toBe(0)
    
    await authStore.createUser('testuser', 'password123')
    
    expect(store.totalStars).toBe(0)
    
    store.addStars(5)
    
    expect(store.totalStars).toBe(5)
  })

  it('calculates stars to next level', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    
    expect(store.starsToNextLevel).toBe(10)
    
    store.addStars(3)
    expect(store.starsToNextLevel).toBe(7)
    
    store.addStars(5)
    expect(store.starsToNextLevel).toBe(2)
    
    store.addStars(2)
    expect(store.starsToNextLevel).toBe(10)
  })

  it('calculates level progress percentage', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    
    expect(store.levelProgress).toBe(0)
    
    store.addStars(5)
    expect(store.levelProgress).toBe(50)
    
    store.addStars(3)
    expect(store.levelProgress).toBe(80)
    
    store.addStars(2)
    expect(store.levelProgress).toBe(0)
  })

  it('adds gems and refreshes user', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    const initialGems = store.totalGems
    
    store.addGems(25)
    
    expect(store.totalGems).toBe(initialGems + 25)
    expect(authStore.currentUser?.totalGems).toBe(initialGems + 25)
  })

  it('adds stars and detects level-up', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    
    expect(store.level).toBe(1)
    
    const result = store.addStars(10)
    
    expect(result?.leveledUp).toBe(true)
    expect(result?.newLevel).toBe(2)
    expect(store.level).toBe(2)
    expect(authStore.currentUser?.level).toBe(2)
  })

  it('adds stars without level-up', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    
    const result = store.addStars(5)
    
    expect(result?.leveledUp).toBe(false)
    expect(result?.newLevel).toBe(1)
    expect(store.level).toBe(1)
  })

  it('checks purchase capability with sufficient gems', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    store.addGems(100)
    
    expect(store.canPurchase(50)).toBe(true)
    expect(store.canPurchase(100)).toBe(true)
  })

  it('checks purchase capability with insufficient gems', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    store.addGems(30)
    
    expect(store.canPurchase(50)).toBe(false)
    expect(store.canPurchase(100)).toBe(false)
  })

  it('spends gems successfully', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    store.addGems(100)
    
    const success = store.spendGems(50)
    
    expect(success).toBe(true)
    expect(store.totalGems).toBe(50)
    expect(authStore.currentUser?.totalGems).toBe(50)
  })

  it('fails to spend gems with insufficient balance', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useUserStatsStore()
    store.addGems(30)
    
    const success = store.spendGems(50)
    
    expect(success).toBe(false)
    expect(store.totalGems).toBe(30)
  })

  it('does not add gems when no user authenticated', () => {
    const store = useUserStatsStore()
    
    store.addGems(50)
    
    expect(store.totalGems).toBe(0)
  })

  it('does not add stars when no user authenticated', () => {
    const store = useUserStatsStore()
    
    const result = store.addStars(10)
    
    expect(result).toBeUndefined()
    expect(store.totalStars).toBe(0)
  })

  it('does not spend gems when no user authenticated', () => {
    const store = useUserStatsStore()
    
    const success = store.spendGems(50)
    
    expect(success).toBe(false)
  })
})

