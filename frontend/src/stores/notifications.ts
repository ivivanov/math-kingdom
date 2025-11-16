import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationAction } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const queue = ref<Notification[]>([])
  const timeoutIds = new Map<string, number>()

  const activeNotification = computed(() => {
    return queue.value.length > 0 ? queue.value[0] : null
  })

  const generateId = () => {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const showNotification = (options: Omit<Notification, 'id'>) => {
    const notification: Notification = {
      id: generateId(),
      ...options,
    }

    queue.value.push(notification)

    // Auto-dismiss if duration is set
    if (notification.duration && notification.duration > 0) {
      const timeoutId = window.setTimeout(() => {
        dismissNotification(notification.id)
      }, notification.duration)
      timeoutIds.set(notification.id, timeoutId)
    }

    return notification.id
  }

  const showSuccess = (message: string, duration: number = 3000) => {
    return showNotification({
      type: 'success',
      message,
      duration,
    })
  }

  const showError = (message: string, duration: number = 3000) => {
    return showNotification({
      type: 'error',
      message,
      duration,
    })
  }

  const showInfo = (message: string, duration: number = 3000) => {
    return showNotification({
      type: 'info',
      message,
      duration,
    })
  }

  const showWarning = (message: string, duration: number = 3000) => {
    return showNotification({
      type: 'warning',
      message,
      duration,
    })
  }

  const showConfirm = (message: string, actions: NotificationAction[]) => {
    return showNotification({
      type: 'confirm',
      message,
      actions,
      duration: 0, // Manual dismiss only
    })
  }

  const dismissNotification = (id: string) => {
    const notification = queue.value.find(n => n.id === id)
    
    // Clear timeout if exists
    const timeoutId = timeoutIds.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIds.delete(id)
    }

    // Call onDismiss callback if exists
    if (notification?.onDismiss) {
      notification.onDismiss()
    }

    // Remove from queue
    queue.value = queue.value.filter(n => n.id !== id)
  }

  const clearAll = () => {
    // Clear all timeouts
    timeoutIds.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    timeoutIds.clear()

    // Clear queue
    queue.value = []
  }

  return {
    activeNotification,
    queue,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showConfirm,
    dismissNotification,
    clearAll,
  }
})

