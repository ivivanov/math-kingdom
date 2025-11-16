import type { User, UserProgress, QuestProgress } from '@/types'

const STORAGE_VERSION = '1.0.0'
const STORAGE_KEYS = {
  VERSION: 'math_adventure_version',
  USERS: 'math_adventure_users',
  CURRENT_USER: 'math_adventure_current_user',
  PROGRESS: 'math_adventure_progress',
}

class StorageService {
  private usersCache: User[] | null = null
  private progressCache: Record<string, UserProgress> | null = null

  constructor() {
    this.initializeStorage()
  }

  private invalidateUsersCache(): void {
    this.usersCache = null
  }

  private invalidateProgressCache(): void {
    this.progressCache = null
  }

  private initializeStorage(): void {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION)
    if (!version) {
      localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({}))
    }
  }

  // Password hashing using Web Crypto API
  // WARNING: This is for DEMO purposes only. Client-side password hashing and localStorage
  // storage is NOT secure for production use. Passwords and credentials should be handled
  // by a proper backend authentication system with secure storage.
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  // User management
  getUsers(): User[] {
    if (this.usersCache !== null) {
      return this.usersCache
    }
    
    try {
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS)
      const users = usersJson ? JSON.parse(usersJson) : []
      this.usersCache = users
      return users
    } catch (error) {
      console.error('Error reading users:', error)
      const emptyUsers: User[] = []
      this.usersCache = emptyUsers
      return emptyUsers
    }
  }

  async createUser(username: string, password: string): Promise<User> {
    const users = this.getUsers()
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      throw new Error('Username already exists')
    }

    const passwordHash = await this.hashPassword(password)
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      createdAt: Date.now(),
      level: 1,
      totalGems: 0,
      totalStars: 0,
      avatarData: {
        clothing: [],
        pet: null,
        accessories: [],
      },
      roomData: {
        furniture: [],
      },
    }

    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    this.invalidateUsersCache()
    
    // Initialize progress for new user
    const allProgress = this.getAllProgress()
    allProgress[newUser.id] = {
      userId: newUser.id,
      questProgress: {},
      earnedBadges: [],
      ownedItems: [],
      equippedItems: [],
    }
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
    this.invalidateProgressCache()

    return newUser
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const users = this.getUsers()
    const passwordHash = await this.hashPassword(password)
    
    const user = users.find(u => u.username === username && u.passwordHash === passwordHash)
    return user || null
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  }

  getCurrentUser(): User | null {
    const userId = this.getCurrentUserId()
    if (!userId) return null

    const users = this.getUsers()
    return users.find(u => u.id === userId) || null
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId)
  }

  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'username' | 'passwordHash' | 'createdAt'>>): void {
    const users = this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const currentUser = users[userIndex]
    if (!currentUser) {
      throw new Error('User not found')
    }
    
    users[userIndex] = { 
      id: currentUser.id,
      username: currentUser.username,
      passwordHash: currentUser.passwordHash,
      createdAt: currentUser.createdAt,
      level: updates.level ?? currentUser.level,
      totalGems: updates.totalGems ?? currentUser.totalGems,
      totalStars: updates.totalStars ?? currentUser.totalStars,
      avatarData: updates.avatarData ?? currentUser.avatarData,
      roomData: updates.roomData ?? currentUser.roomData,
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    this.invalidateUsersCache()
  }

  // Progress tracking
  private getAllProgress(): Record<string, UserProgress> {
    if (this.progressCache !== null) {
      return this.progressCache
    }
    
    try {
      const progressJson = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      const progress = progressJson ? JSON.parse(progressJson) : {}
      this.progressCache = progress
      return progress
    } catch (error) {
      console.error('Error reading progress:', error)
      const emptyProgress: Record<string, UserProgress> = {}
      this.progressCache = emptyProgress
      return emptyProgress
    }
  }

  getUserProgress(userId: string): UserProgress {
    const allProgress = this.getAllProgress()
    
    if (!allProgress[userId]) {
      allProgress[userId] = {
        userId,
        questProgress: {},
        earnedBadges: [],
        ownedItems: [],
        equippedItems: [],
      }
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
      this.invalidateProgressCache()
    }

    return allProgress[userId]
  }

  updateQuestProgress(userId: string, questId: string, progress: QuestProgress): void {
    const allProgress = this.getAllProgress()
    
    if (!allProgress[userId]) {
      allProgress[userId] = {
        userId,
        questProgress: {},
        earnedBadges: [],
        ownedItems: [],
        equippedItems: [],
      }
    }

    allProgress[userId].questProgress[questId] = progress
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
    this.invalidateProgressCache()
  }

  getQuestProgress(userId: string, questId: string): QuestProgress | null {
    const userProgress = this.getUserProgress(userId)
    return userProgress.questProgress[questId] || null
  }

  // User stats
  addGems(userId: string, amount: number): void {
    const users = this.getUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return

    this.updateUser(userId, {
      totalGems: user.totalGems + amount,
    })
  }

  addStars(userId: string, amount: number): void {
    const users = this.getUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return

    this.updateUser(userId, {
      totalStars: user.totalStars + amount,
    })
    
    // Check for level up
    this.checkLevelUp(userId)
  }

  checkLevelUp(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return false

    // Simple level-up formula: 10 stars per level
    const newLevel = Math.floor(user.totalStars / 10) + 1
    
    if (newLevel > user.level) {
      this.updateUser(userId, { level: newLevel })
      return true
    }

    return false
  }

  // Items and rewards
  purchaseItem(userId: string, itemId: string, cost: number): boolean {
    const users = this.getUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return false

    if (user.totalGems < cost) {
      return false
    }

    const userProgress = this.getUserProgress(userId)
    
    // Check if already owned
    if (userProgress.ownedItems.includes(itemId)) {
      return false
    }

    // Deduct gems
    this.updateUser(userId, {
      totalGems: user.totalGems - cost,
    })

    // Add item to owned items
    const allProgress = this.getAllProgress()
    if (allProgress[userId]) {
      allProgress[userId].ownedItems.push(itemId)
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
      this.invalidateProgressCache()
    }

    return true
  }

  equipItem(userId: string, itemId: string): void {
    const userProgress = this.getUserProgress(userId)
    
    if (!userProgress.ownedItems.includes(itemId)) {
      throw new Error('Item not owned')
    }

    const allProgress = this.getAllProgress()
    
    if (!allProgress[userId]) return
    
    // Toggle equip/unequip
    if (allProgress[userId].equippedItems.includes(itemId)) {
      allProgress[userId].equippedItems = allProgress[userId].equippedItems.filter(id => id !== itemId)
    } else {
      allProgress[userId].equippedItems.push(itemId)
    }

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
    this.invalidateProgressCache()
  }

  awardBadge(userId: string, badgeId: string): void {
    const userProgress = this.getUserProgress(userId)
    
    if (userProgress.earnedBadges.includes(badgeId)) {
      return
    }

    const allProgress = this.getAllProgress()
    if (!allProgress[userId]) return
    
    allProgress[userId].earnedBadges.push(badgeId)
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
    this.invalidateProgressCache()
  }

  // Utility methods
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    this.invalidateUsersCache()
    this.invalidateProgressCache()
    this.initializeStorage()
  }

  exportData(): string {
    return JSON.stringify({
      version: STORAGE_VERSION,
      users: this.getUsers(),
      progress: this.getAllProgress(),
    })
  }

  importData(dataJson: string): void {
    try {
      const data = JSON.parse(dataJson)
      localStorage.setItem(STORAGE_KEYS.VERSION, data.version || STORAGE_VERSION)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users || []))
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress || {}))
      this.invalidateUsersCache()
      this.invalidateProgressCache()
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('Invalid data format')
    }
  }
}

// Export singleton instance
export const storageService = new StorageService()

