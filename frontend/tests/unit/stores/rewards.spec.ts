import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRewardsStore } from '@/stores/rewards'
import { useAuthStore } from '@/stores/auth'
import { useUserStatsStore } from '@/stores/userStats'
import { storageService } from '@/services/storage'
import type { Item, Badge } from '@/types'

describe('Rewards Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    storageService.clearAllData()
  })

  it('initializes with empty rewards when no user', () => {
    const store = useRewardsStore()
    expect(store.ownedItems).toEqual([])
    expect(store.equippedItems).toEqual([])
    expect(store.earnedBadges).toEqual([])
  })

  it('loads rewards for authenticated user', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    // Add some rewards manually
    storageService.purchaseItem(authStore.currentUser!.id, 'item1', 0)
    storageService.awardBadge(authStore.currentUser!.id, 'badge1')
    
    const store = useRewardsStore()
    store.loadRewards()
    
    expect(store.ownedItems).toContain('item1')
    expect(store.earnedBadges).toContain('badge1')
  })

  it('checks item ownership', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    expect(store.ownsItem('item1')).toBe(false)
    
    storageService.purchaseItem(authStore.currentUser!.id, 'item1', 0)
    store.loadRewards()
    
    expect(store.ownsItem('item1')).toBe(true)
  })

  it('purchases item with sufficient gems', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(100)
    
    const store = useRewardsStore()
    
    const item: Item = {
      id: 'item1',
      name: 'Test Item',
      type: 'hat',
      costGems: 50,
      imageUrl: 'test.png'
    }
    
    const success = store.purchaseItem(item)
    
    expect(success).toBe(true)
    expect(store.ownsItem('item1')).toBe(true)
    expect(userStatsStore.totalGems).toBe(50)
  })

  it('fails to purchase item with insufficient gems', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(30)
    
    const store = useRewardsStore()
    
    const item: Item = {
      id: 'item1',
      name: 'Test Item',
      type: 'hat',
      costGems: 50,
      imageUrl: 'test.png'
    }
    
    const success = store.purchaseItem(item)
    
    expect(success).toBe(false)
    expect(store.ownsItem('item1')).toBe(false)
    expect(userStatsStore.totalGems).toBe(30)
  })

  it('fails to purchase already owned item', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(100)
    
    const store = useRewardsStore()
    
    const item: Item = {
      id: 'item1',
      name: 'Test Item',
      type: 'hat',
      costGems: 50,
      imageUrl: 'test.png'
    }
    
    store.purchaseItem(item)
    const initialGems = userStatsStore.totalGems
    
    const success = store.purchaseItem(item)
    
    expect(success).toBe(false)
    expect(userStatsStore.totalGems).toBe(initialGems)
  })

  it('equips owned item', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    // Give user the item
    storageService.purchaseItem(authStore.currentUser!.id, 'item1', 0)
    store.loadRewards()
    
    expect(store.isItemEquipped('item1')).toBe(false)
    
    store.equipItem('item1')
    store.loadRewards()
    
    expect(store.isItemEquipped('item1')).toBe(true)
    expect(store.equippedItems).toContain('item1')
  })

  it('unequips equipped item', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    // Give user the item and equip it
    storageService.purchaseItem(authStore.currentUser!.id, 'item1', 0)
    storageService.equipItem(authStore.currentUser!.id, 'item1')
    store.loadRewards()
    
    expect(store.isItemEquipped('item1')).toBe(true)
    
    store.equipItem('item1')
    
    expect(store.isItemEquipped('item1')).toBe(false)
    expect(store.equippedItems).not.toContain('item1')
  })

  it('does not equip unowned item', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    store.equipItem('item1')
    
    expect(store.isItemEquipped('item1')).toBe(false)
    expect(store.equippedItems).not.toContain('item1')
  })

  it('awards new badge', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    expect(store.hasBadge('badge1')).toBe(false)
    
    store.awardBadge('badge1')
    
    expect(store.hasBadge('badge1')).toBe(true)
    expect(store.earnedBadges).toContain('badge1')
  })

  it('prevents duplicate badge awards', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useRewardsStore()
    
    store.awardBadge('badge1')
    store.loadRewards()
    store.awardBadge('badge1')
    store.loadRewards()
    
    expect(store.earnedBadges.filter(b => b === 'badge1').length).toBe(1)
  })

  it('checks badge unlock criteria for gems', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(50)
    
    const store = useRewardsStore()
    
    const badge: Badge = {
      id: 'badge1',
      name: 'Gem Collector',
      description: 'Collect 100 gems',
      imageUrl: 'badge.png',
      unlockCriteria: {
        type: 'gems_earned',
        value: '100'
      }
    }
    
    expect(store.checkBadgeUnlock(badge)).toBe(false)
    
    userStatsStore.addGems(50)
    
    expect(store.checkBadgeUnlock(badge)).toBe(true)
  })

  it('checks badge unlock criteria for stars', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addStars(15)
    
    const store = useRewardsStore()
    
    const badge: Badge = {
      id: 'badge2',
      name: 'Star Collector',
      description: 'Collect 20 stars',
      imageUrl: 'badge.png',
      unlockCriteria: {
        type: 'stars_earned',
        value: '20'
      }
    }
    
    expect(store.checkBadgeUnlock(badge)).toBe(false)
    
    userStatsStore.addStars(5)
    
    expect(store.checkBadgeUnlock(badge)).toBe(true)
  })

  it('does not unlock already earned badge', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(100)
    
    const store = useRewardsStore()
    store.awardBadge('badge1')
    
    const badge: Badge = {
      id: 'badge1',
      name: 'Gem Collector',
      description: 'Collect 100 gems',
      imageUrl: 'badge.png',
      unlockCriteria: {
        type: 'gems_earned',
        value: '100'
      }
    }
    
    expect(store.checkBadgeUnlock(badge)).toBe(false)
  })

  it('does not purchase when no user authenticated', () => {
    const store = useRewardsStore()
    
    const item: Item = {
      id: 'item1',
      name: 'Test Item',
      type: 'hat',
      costGems: 50,
      imageUrl: 'test.png'
    }
    
    const success = store.purchaseItem(item)
    
    expect(success).toBe(false)
  })

  it('does not award badge when no user authenticated', () => {
    const store = useRewardsStore()
    
    store.awardBadge('badge1')
    
    expect(store.earnedBadges).toEqual([])
  })
})

