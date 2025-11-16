import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService } from '@/services/storage'
import { useAuthStore } from './auth'
import type { QuestProgress } from '@/types'

export const useProgressStore = defineStore('progress', () => {
  const authStore = useAuthStore()
  
  const currentQuestId = ref<string | null>(null)
  const questProgressMap = ref<Record<string, QuestProgress>>({})

  const loadProgress = () => {
    if (!authStore.currentUser) return

    const userProgress = storageService.getUserProgress(authStore.currentUser.id)
    questProgressMap.value = userProgress.questProgress
  }

  const getQuestProgress = (questId: string): QuestProgress | null => {
    return questProgressMap.value[questId] || null
  }

  const startQuest = (questId: string) => {
    if (!authStore.currentUser) return

    const existingProgress = getQuestProgress(questId)
    
    if (!existingProgress) {
      const newProgress: QuestProgress = {
        questId,
        status: 'in_progress',
        attempts: 1,
        correctAnswers: 0,
        totalAnswers: 0,
      }
      
      storageService.updateQuestProgress(authStore.currentUser.id, questId, newProgress)
      questProgressMap.value[questId] = newProgress
    }

    currentQuestId.value = questId
  }

  const updateQuestProgress = (
    questId: string,
    correctAnswers: number,
    totalAnswers: number,
    isCompleted: boolean = false
  ) => {
    if (!authStore.currentUser) return

    const existingProgress = getQuestProgress(questId) || {
      questId,
      status: 'in_progress' as const,
      attempts: 1,
      correctAnswers: 0,
      totalAnswers: 0,
    }

    const updatedProgress: QuestProgress = {
      ...existingProgress,
      correctAnswers,
      totalAnswers,
      status: isCompleted ? 'completed' : 'in_progress',
      completedAt: isCompleted ? Date.now() : undefined,
    }

    storageService.updateQuestProgress(authStore.currentUser.id, questId, updatedProgress)
    questProgressMap.value[questId] = updatedProgress
  }

  const completeQuest = (questId: string, correctAnswers: number, totalAnswers: number) => {
    updateQuestProgress(questId, correctAnswers, totalAnswers, true)
  }

  const isQuestCompleted = (questId: string): boolean => {
    const progress = getQuestProgress(questId)
    return progress?.status === 'completed'
  }

  const getCompletedQuestsCount = computed(() => {
    return Object.values(questProgressMap.value).filter(p => p.status === 'completed').length
  })

  // Initialize on store creation
  if (authStore.currentUser) {
    loadProgress()
  }

  return {
    currentQuestId,
    questProgressMap,
    loadProgress,
    getQuestProgress,
    startQuest,
    updateQuestProgress,
    completeQuest,
    isQuestCompleted,
    getCompletedQuestsCount,
  }
})

