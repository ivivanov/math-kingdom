<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  id: string
  type: string
  emoji?: string
}>()

const emit = defineEmits<{
  dragStart: [id: string]
  dragEnd: [id: string]
}>()

const isDragging = ref(false)

const handleDragStart = (e: DragEvent) => {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.id)
  }
  emit('dragStart', props.id)
}

const handleDragEnd = () => {
  isDragging.value = false
  emit('dragEnd', props.id)
}

// Touch support
const handleTouchStart = () => {
  isDragging.value = true
  emit('dragStart', props.id)
}

const handleTouchEnd = () => {
  isDragging.value = false
  emit('dragEnd', props.id)
}

const getEmoji = () => {
  if (props.emoji) return props.emoji
  
  const emojiMap: Record<string, string> = {
    cookie: '🍪',
    apple: '🍎',
    star: '⭐',
    gem: '💎',
    balloon: '🎈',
  }
  
  return emojiMap[props.type] || '📦'
}
</script>

<template>
  <div
    :class="['draggable-object', { dragging: isDragging }]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="object-content">
      <span class="object-emoji">{{ getEmoji() }}</span>
    </div>
  </div>
</template>

<style scoped>
.draggable-object {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  cursor: grab;
  transition: all 0.3s;
  user-select: none;
  touch-action: none;
}

.draggable-object:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: #667eea;
}

.draggable-object.dragging {
  opacity: 0.5;
  cursor: grabbing;
  transform: scale(0.9);
}

.object-content {
  pointer-events: none;
}

.object-emoji {
  font-size: 3rem;
  display: block;
}

@media (max-width: 768px) {
  .draggable-object {
    width: 70px;
    height: 70px;
  }

  .object-emoji {
    font-size: 2.5rem;
  }
}
</style>

