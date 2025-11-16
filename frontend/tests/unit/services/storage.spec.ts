import { describe, it, expect, beforeEach } from 'vitest'
import { storageService } from '@/services/storage'

describe('Storage Service', () => {
  beforeEach(() => {
    storageService.clearAllData()
  })

  describe('User Management', () => {
    it('creates a new user', async () => {
      const user = await storageService.createUser('testuser', 'password')
      
      expect(user.username).toBe('testuser')
      expect(user.level).toBe(1)
      expect(user.totalGems).toBe(0)
      expect(user.totalStars).toBe(0)
    })

    it('throws error for duplicate username', async () => {
      await storageService.createUser('testuser', 'password')
      
      await expect(
        storageService.createUser('testuser', 'password')
      ).rejects.toThrow('Username already exists')
    })

    it('authenticates user with correct password', async () => {
      const created = await storageService.createUser('testuser', 'password')
      const authenticated = await storageService.authenticateUser('testuser', 'password')
      
      expect(authenticated).not.toBeNull()
      expect(authenticated?.id).toBe(created.id)
    })

    it('returns null for wrong password', async () => {
      await storageService.createUser('testuser', 'password')
      const authenticated = await storageService.authenticateUser('testuser', 'wrongpass')
      
      expect(authenticated).toBeNull()
    })

    it('gets all users', async () => {
      await storageService.createUser('user1', 'pass1')
      await storageService.createUser('user2', 'pass2')
      
      const users = storageService.getUsers()
      
      expect(users.length).toBe(2)
    })
  })

  describe('Progress Tracking', () => {
    it('initializes progress for new user', async () => {
      const user = await storageService.createUser('testuser', 'password')
      const progress = storageService.getUserProgress(user.id)
      
      expect(progress.userId).toBe(user.id)
      expect(progress.questProgress).toEqual({})
      expect(progress.earnedBadges).toEqual([])
      expect(progress.ownedItems).toEqual([])
    })

    it('updates quest progress', async () => {
      const user = await storageService.createUser('testuser', 'password')
      
      storageService.updateQuestProgress(user.id, 'quest-1', {
        questId: 'quest-1',
        status: 'completed',
        attempts: 1,
        correctAnswers: 5,
        totalAnswers: 5,
        completedAt: Date.now()
      })
      
      const progress = storageService.getUserProgress(user.id)
      
      expect(progress.questProgress['quest-1'].status).toBe('completed')
      expect(progress.questProgress['quest-1'].correctAnswers).toBe(5)
    })
  })

  describe('Rewards System', () => {
    it('adds gems to user', async () => {
      const user = await storageService.createUser('testuser', 'password')
      storageService.setCurrentUser(user.id)
      
      storageService.addGems(user.id, 10)
      
      const users = storageService.getUsers()
      const updatedUser = users.find(u => u.id === user.id)
      
      expect(updatedUser?.totalGems).toBe(10)
    })

    it('adds stars and checks level up', async () => {
      const user = await storageService.createUser('testuser', 'password')
      storageService.setCurrentUser(user.id)
      
      storageService.addStars(user.id, 10)
      
      const users = storageService.getUsers()
      const updatedUser = users.find(u => u.id === user.id)
      
      expect(updatedUser?.totalStars).toBe(10)
      expect(updatedUser?.level).toBe(2) // 10 stars = level 2
    })

    it('purchases item successfully', async () => {
      const user = await storageService.createUser('testuser', 'password')
      storageService.setCurrentUser(user.id)
      storageService.addGems(user.id, 50)
      
      const success = storageService.purchaseItem(user.id, 'item-1', 25)
      
      expect(success).toBe(true)
      
      const users = storageService.getUsers()
      const updatedUser = users.find(u => u.id === user.id)
      expect(updatedUser?.totalGems).toBe(25)
      
      const progress = storageService.getUserProgress(user.id)
      expect(progress.ownedItems).toContain('item-1')
    })

    it('fails to purchase with insufficient gems', async () => {
      const user = await storageService.createUser('testuser', 'password')
      storageService.setCurrentUser(user.id)
      
      const success = storageService.purchaseItem(user.id, 'item-1', 100)
      
      expect(success).toBe(false)
    })

    it('awards badge to user', async () => {
      const user = await storageService.createUser('testuser', 'password')
      
      storageService.awardBadge(user.id, 'badge-1')
      
      const progress = storageService.getUserProgress(user.id)
      
      expect(progress.earnedBadges).toContain('badge-1')
    })

    it('does not award duplicate badges', async () => {
      const user = await storageService.createUser('testuser', 'password')
      
      storageService.awardBadge(user.id, 'badge-1')
      storageService.awardBadge(user.id, 'badge-1')
      
      const progress = storageService.getUserProgress(user.id)
      
      expect(progress.earnedBadges.filter(b => b === 'badge-1').length).toBe(1)
    })
  })

  describe('Data Management', () => {
    it('exports data', async () => {
      await storageService.createUser('user1', 'pass1')
      await storageService.createUser('user2', 'pass2')
      
      const exported = storageService.exportData()
      const data = JSON.parse(exported)
      
      expect(data.users.length).toBe(2)
      expect(data.version).toBeDefined()
    })

    it('imports data', async () => {
      const testData = {
        version: '1.0.0',
        users: [
          {
            id: 'test-id',
            username: 'imported',
            passwordHash: 'hash',
            createdAt: Date.now(),
            level: 1,
            totalGems: 0,
            totalStars: 0,
            avatarData: { clothing: [], pet: null, accessories: [] },
            roomData: { furniture: [] }
          }
        ],
        progress: {}
      }
      
      storageService.importData(JSON.stringify(testData))
      
      const users = storageService.getUsers()
      
      expect(users.length).toBe(1)
      expect(users[0].username).toBe('imported')
    })

    it('clears all data', async () => {
      await storageService.createUser('user1', 'pass1')
      
      storageService.clearAllData()
      
      const users = storageService.getUsers()
      
      expect(users.length).toBe(0)
    })
  })
})

