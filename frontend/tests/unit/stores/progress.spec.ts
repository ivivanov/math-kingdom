import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'
import { storageService } from '@/services/storage'

describe('Progress Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    storageService.clearAllData()
  })

  it('initializes with empty progress when no user', () => {
    const store = useProgressStore()
    expect(store.currentQuestId).toBeNull()
    expect(store.questProgressMap).toEqual({})
  })

  it('loads progress for authenticated user', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    // Create some progress
    storageService.updateQuestProgress(authStore.currentUser!.id, 'quest1', {
      questId: 'quest1',
      status: 'completed',
      attempts: 1,
      correctAnswers: 5,
      totalAnswers: 5,
      completedAt: Date.now()
    })
    
    const store = useProgressStore()
    store.loadProgress()
    
    expect(store.questProgressMap['quest1']).toBeDefined()
    expect(store.questProgressMap['quest1'].status).toBe('completed')
  })

  it('starts a new quest', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    
    expect(store.currentQuestId).toBe('quest1')
    expect(store.questProgressMap['quest1']).toBeDefined()
    expect(store.questProgressMap['quest1'].status).toBe('in_progress')
    expect(store.questProgressMap['quest1'].attempts).toBe(1)
    expect(store.questProgressMap['quest1'].correctAnswers).toBe(0)
    expect(store.questProgressMap['quest1'].totalAnswers).toBe(0)
  })

  it('starts existing quest without creating new progress', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    
    const firstProgress = store.questProgressMap['quest1']
    
    store.startQuest('quest1')
    
    expect(store.currentQuestId).toBe('quest1')
    expect(store.questProgressMap['quest1']).toEqual(firstProgress)
  })

  it('updates quest progress with in-progress state', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    store.updateQuestProgress('quest1', 3, 5, false)
    
    expect(store.questProgressMap['quest1'].correctAnswers).toBe(3)
    expect(store.questProgressMap['quest1'].totalAnswers).toBe(5)
    expect(store.questProgressMap['quest1'].status).toBe('in_progress')
    expect(store.questProgressMap['quest1'].completedAt).toBeUndefined()
  })

  it('updates quest progress with completed state', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    store.updateQuestProgress('quest1', 5, 5, true)
    
    expect(store.questProgressMap['quest1'].correctAnswers).toBe(5)
    expect(store.questProgressMap['quest1'].totalAnswers).toBe(5)
    expect(store.questProgressMap['quest1'].status).toBe('completed')
    expect(store.questProgressMap['quest1'].completedAt).toBeDefined()
  })

  it('completes quest with correct answers', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    store.completeQuest('quest1', 4, 5)
    
    expect(store.questProgressMap['quest1'].correctAnswers).toBe(4)
    expect(store.questProgressMap['quest1'].totalAnswers).toBe(5)
    expect(store.questProgressMap['quest1'].status).toBe('completed')
    expect(store.questProgressMap['quest1'].completedAt).toBeDefined()
  })

  it('checks if quest is completed', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    store.startQuest('quest1')
    
    expect(store.isQuestCompleted('quest1')).toBe(false)
    
    store.completeQuest('quest1', 5, 5)
    
    expect(store.isQuestCompleted('quest1')).toBe(true)
  })

  it('gets completed quests count', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    
    expect(store.getCompletedQuestsCount).toBe(0)
    
    store.startQuest('quest1')
    store.completeQuest('quest1', 5, 5)
    store.loadProgress()
    
    expect(store.getCompletedQuestsCount).toBe(1)
    
    store.startQuest('quest2')
    store.completeQuest('quest2', 4, 5)
    store.loadProgress()
    
    expect(store.getCompletedQuestsCount).toBe(2)
    
    store.startQuest('quest3')
    
    expect(store.getCompletedQuestsCount).toBe(2)
  })

  it('gets quest progress', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')
    
    const store = useProgressStore()
    
    expect(store.getQuestProgress('quest1')).toBeNull()
    
    store.startQuest('quest1')
    
    const progress = store.getQuestProgress('quest1')
    expect(progress).not.toBeNull()
    expect(progress?.questId).toBe('quest1')
  })

  it('does not start quest when no user authenticated', () => {
    const store = useProgressStore()
    store.startQuest('quest1')
    
    expect(store.currentQuestId).toBeNull()
    expect(store.questProgressMap).toEqual({})
  })

  it('does not update quest when no user authenticated', () => {
    const store = useProgressStore()
    store.updateQuestProgress('quest1', 5, 5, true)
    
    expect(store.questProgressMap).toEqual({})
  })
})

