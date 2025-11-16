import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService } from '@/services/storage'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  const loadCurrentUser = () => {
    currentUser.value = storageService.getCurrentUser()
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await storageService.authenticateUser(username, password)
      if (user) {
        storageService.setCurrentUser(user.id)
        currentUser.value = user
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const createUser = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await storageService.createUser(username, password)
      storageService.setCurrentUser(user.id)
      currentUser.value = user
      return true
    } catch (error) {
      console.error('Create user error:', error)
      return false
    }
  }

  const logout = () => {
    storageService.clearCurrentUser()
    currentUser.value = null
  }

  const switchUser = (userId: string) => {
    const users = storageService.getUsers()
    const user = users.find(u => u.id === userId)
    if (user) {
      storageService.setCurrentUser(userId)
      currentUser.value = user
    }
  }

  const refreshUser = () => {
    if (currentUser.value) {
      const users = storageService.getUsers()
      const user = users.find(u => u.id === currentUser.value?.id)
      if (user) {
        currentUser.value = user
      }
    }
  }

  const getAllUsers = () => {
    return storageService.getUsers()
  }

  // Initialize on store creation
  loadCurrentUser()

  return {
    currentUser,
    isAuthenticated,
    login,
    createUser,
    logout,
    switchUser,
    refreshUser,
    getAllUsers,
  }
})

