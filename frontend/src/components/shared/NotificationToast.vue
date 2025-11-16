<script setup lang="ts">
import { computed } from 'vue'
import type { Notification } from '@/types'

const props = defineProps<{
  notification: Notification | null
}>()

const emit = defineEmits<{
  dismiss: [id: string]
  action: [handler: () => void | Promise<void>]
}>()

const typeColors = computed(() => {
  if (!props.notification) return {}
  
  switch (props.notification.type) {
    case 'success':
      return {
        background: '#e8f5e9',
        border: '#4caf50',
        icon: '✓',
      }
    case 'error':
      return {
        background: '#ffebee',
        border: '#f44336',
        icon: '✕',
      }
    case 'info':
      return {
        background: '#e8eaf6',
        border: '#667eea',
        icon: 'ℹ',
      }
    case 'warning':
      return {
        background: '#fff3e0',
        border: '#ff9800',
        icon: '⚠',
      }
    case 'confirm':
      return {
        background: '#ffffff',
        border: '#e0e0e0',
        icon: '?',
      }
    default:
      return {
        background: '#f5f5f5',
        border: '#ccc',
        icon: '',
      }
  }
})

const handleAction = async (handler: () => void | Promise<void>) => {
  emit('action', handler)
}

const handleDismiss = () => {
  if (props.notification) {
    emit('dismiss', props.notification.id)
  }
}

const handleBackdropClick = () => {
  // Only dismiss on backdrop click for confirm type
  if (props.notification?.type === 'confirm') {
    handleDismiss()
  }
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="notification" class="notification-container">
      <!-- Backdrop for confirm dialogs -->
      <div
        v-if="notification.type === 'confirm'"
        class="notification-backdrop"
        @click="handleBackdropClick"
      ></div>

      <!-- Toast card -->
      <div
        class="notification-toast"
        :style="{
          background: typeColors.background,
          borderColor: typeColors.border,
        }"
        @click.stop
      >
        <!-- Icon (non-confirm types) -->
        <div
          v-if="notification.type !== 'confirm'"
          class="notification-icon"
          :style="{ color: typeColors.border }"
        >
          {{ typeColors.icon }}
        </div>

        <!-- Message -->
        <div class="notification-content">
          <p class="notification-message">{{ notification.message }}</p>

          <!-- Actions (if present) -->
          <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
            <button
              v-for="(action, index) in notification.actions"
              :key="index"
              :class="['action-btn', `action-btn-${action.type}`]"
              @click="handleAction(action.handler)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Close button for non-action toasts -->
        <button
          v-if="!notification.actions || notification.actions.length === 0"
          class="close-btn"
          @click="handleDismiss"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.notification-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  pointer-events: all;
  z-index: 1;
}

.notification-toast {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  margin: 0 16px;
  margin-bottom: max(20px, env(safe-area-inset-bottom));
  padding: 20px;
  border-radius: 20px 20px 0 0;
  border: 3px solid;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  pointer-events: all;
  touch-action: manipulation;
}

.notification-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.8);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
}

.notification-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  min-height: 48px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn-primary:hover {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.action-btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn-secondary:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.close-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  color: #666;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  min-width: 48px;
  min-height: 48px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.close-btn:active {
  transform: scale(0.9);
}

/* Slide up animation */
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .notification-toast {
    border-radius: 20px;
    margin-bottom: 20px;
  }
}
</style>

