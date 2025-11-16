import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { storageService } from '@/services/storage'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    storageService.clearAllData()
  })

  it('initializes with no current user', () => {
    const store = useAuthStore()
    expect(store.currentUser).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('creates a new user successfully', async () => {
    const store = useAuthStore()
    const success = await store.createUser('testuser', 'password123')
    
    expect(success).toBe(true)
    expect(store.currentUser).not.toBeNull()
    expect(store.currentUser?.username).toBe('testuser')
    expect(store.isAuthenticated).toBe(true)
  })

  it('prevents duplicate usernames', async () => {
    const store = useAuthStore()
    
    await store.createUser('testuser', 'password123')
    const success = await store.createUser('testuser', 'different')
    
    expect(success).toBe(false)
  })

  it('authenticates existing user with correct password', async () => {
    const store = useAuthStore()
    
    await store.createUser('testuser', 'password123')
    store.logout()
    
    const success = await store.login('testuser', 'password123')
    
    expect(success).toBe(true)
    expect(store.currentUser?.username).toBe('testuser')
  })

  it('rejects login with wrong password', async () => {
    const store = useAuthStore()
    
    await store.createUser('testuser', 'password123')
    store.logout()
    
    const success = await store.login('testuser', 'wrongpassword')
    
    expect(success).toBe(false)
    expect(store.currentUser).toBeNull()
  })

  it('logs out successfully', async () => {
    const store = useAuthStore()
    
    await store.createUser('testuser', 'password123')
    store.logout()
    
    expect(store.currentUser).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('switches between users', async () => {
    const store = useAuthStore()
    
    await store.createUser('user1', 'password1')
    const user1Id = store.currentUser!.id
    
    await store.createUser('user2', 'password2')
    const user2Id = store.currentUser!.id
    
    store.switchUser(user1Id)
    
    expect(store.currentUser?.username).toBe('user1')
  })

  it('retrieves all users', async () => {
    const store = useAuthStore()
    
    await store.createUser('user1', 'password1')
    await store.createUser('user2', 'password2')
    
    const users = store.getAllUsers()
    
    expect(users.length).toBe(2)
    expect(users.map(u => u.username)).toContain('user1')
    expect(users.map(u => u.username)).toContain('user2')
  })
})

