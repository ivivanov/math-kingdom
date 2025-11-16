<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  id: string
  label?: string
  count?: number
  maxCount?: number
}>()

const emit = defineEmits<{
  drop: [itemId: string]
}>()

const isDragOver = ref(false)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  if (e.dataTransfer) {
    const itemId = e.dataTransfer.getData('text/plain')
    emit('drop', itemId)
  }
}

// Touch support
const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleTouchEnd = () => {
  isDragOver.value = false
  // In a real implementation, you'd check touch coordinates
  // to see if the drop is within this zone
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
</script>

<template>
  <div
    :class="['drop-zone', { 'drag-over': isDragOver, 'full': isFull }]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="drop-zone-content">
      <div class="drop-icon">🧺</div>
      <div v-if="label" class="drop-label">{{ label }}</div>
      <div v-if="countDisplay" class="drop-count">{{ countDisplay }}</div>
    </div>
  </div>
</template>

<style scoped>
.drop-zone {
  min-width: 200px;
  min-height: 200px;
  background: #f5f5f5;
  border: 3px dashed #ccc;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  transition: all 0.3s;
}

.drop-zone.drag-over {
  background: #e3f2fd;
  border-color: #667eea;
  border-style: solid;
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.drop-zone.full {
  background: #d4edda;
  border-color: #28a745;
  border-style: solid;
}

.drop-zone-content {
  text-align: center;
  pointer-events: none;
}

.drop-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.drop-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.drop-count {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.drop-zone.full .drop-count {
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

@media (max-width: 768px) {
  .drop-zone {
    min-width: 150px;
    min-height: 150px;
    padding: 20px;
  }

  .drop-icon {
    font-size: 3rem;
  }

  .drop-label {
    font-size: 1rem;
  }

  .drop-count {
    font-size: 1.5rem;
  }
}
</style>

