<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  id: string
  label?: string
  count?: number
  maxCount?: number
  hasSelectedItem?: boolean
}>()

const emit = defineEmits<{
  tap: []
}>()

const isAnimating = ref(false)

const handleTap = () => {
  if (!props.hasSelectedItem) return
  
  isAnimating.value = true
  emit('tap')
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const isFull = computed(() => {
  if (!props.maxCount) return false
  return (props.count || 0) >= props.maxCount
})

const countDisplay = computed(() => {
  if (props.count === undefined) return ''
  if (props.maxCount) return `${props.count} / ${props.maxCount}`
  return `${props.count}`
})

const promptText = computed(() => {
  if (props.hasSelectedItem) return 'Tap here!'
  return props.label || 'Target Zone'
})
</script>

<template>
  <div
    :class="['target-zone', { 
      'has-selected': hasSelectedItem, 
      'full': isFull,
      'animating': isAnimating
    }]"
    @click="handleTap"
    role="button"
    :tabindex="hasSelectedItem ? 0 : -1"
    :aria-label="hasSelectedItem ? 'Tap to place selected item' : 'Target zone'"
  >
    <div class="target-zone-content">
      <div class="drop-icon">🧺</div>
      <div class="target-prompt">{{ promptText }}</div>
      <div v-if="countDisplay" class="target-count">{{ countDisplay }}</div>
      
      <!-- Visual indicator when item is selected -->
      <div v-if="hasSelectedItem && !isFull" class="tap-indicator">
        <div class="tap-pulse"></div>
        <div class="arrow-down">↓</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first target zone - replaces drop zone for better touch experience */
.target-zone {
  min-width: 120px;
  min-height: 120px;
  background: #f5f5f5;
  border: 3px dashed #ccc;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  transition: all 0.3s ease;
  touch-action: manipulation;
  cursor: default;
  position: relative;
}

/* Active state when an item is selected - ready to receive */
.target-zone.has-selected {
  background: #e3f2fd;
  border-color: #667eea;
  border-style: solid;
  border-width: 4px;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2),
              0 5px 20px rgba(102, 126, 234, 0.3);
  animation: ready-pulse 1.5s ease-in-out infinite;
}

@keyframes ready-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Touch feedback */
.target-zone.has-selected:active {
  transform: scale(0.98);
}

/* Animation when item is placed */
.target-zone.animating {
  animation: place-success 0.3s ease-out;
}

@keyframes place-success {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    background: #d4edda;
  }
  100% {
    transform: scale(1);
  }
}

/* Full state - all items placed */
.target-zone.full {
  background: #d4edda;
  border-color: #28a745;
  border-style: solid;
}

.target-zone-content {
  text-align: center;
  pointer-events: none;
  position: relative;
}

.drop-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.target-prompt {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.target-zone.has-selected .target-prompt {
  color: #667eea;
  font-size: 1.3rem;
  animation: prompt-bounce 0.8s ease-in-out infinite;
}

@keyframes prompt-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.target-count {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.target-zone.full .target-count {
  color: #28a745;
  animation: celebrate 0.5s ease-in-out;
}

@keyframes celebrate {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Tap indicator - shows where to tap */
.tap-indicator {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.tap-pulse {
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  animation: pulse-tap 1s ease-in-out infinite;
}

@keyframes pulse-tap {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.arrow-down {
  font-size: 2rem;
  color: #667eea;
  animation: bounce-down 0.8s ease-in-out infinite;
}

@keyframes bounce-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

/* Hover state for desktop */
@media (hover: hover) {
  .target-zone.has-selected:hover {
    background: #d4e7fd;
  }
}

/* Focus state for keyboard navigation */
.target-zone:focus {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .target-zone {
    min-width: 150px;
    min-height: 150px;
    padding: 20px;
  }

  .drop-icon {
    font-size: 3rem;
  }

  .target-prompt {
    font-size: 1rem;
  }

  .target-count {
    font-size: 1.5rem;
  }
}
</style>

