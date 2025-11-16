export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'confirm'

export interface NotificationAction {
  label: string
  type: 'primary' | 'secondary'
  handler: () => void | Promise<void>
}

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  actions?: NotificationAction[]
  onDismiss?: () => void
}

