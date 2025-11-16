<script setup lang="ts">
const props = defineProps<{
  id: string
  type: string
  emoji?: string
  isSelected?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const handleTap = () => {
  emit('select', props.id)
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
    :class="['tappable-object', { selected: isSelected }]"
    @click="handleTap"
    role="button"
    tabindex="0"
    :aria-label="`${type} - ${isSelected ? 'selected' : 'tap to select'}`"
  >
    <div class="object-content">
      <span class="object-emoji">{{ getEmoji() }}</span>
    </div>
    <div v-if="isSelected" class="selection-indicator">✓</div>
  </div>
</template>

<style scoped>
/* Mobile-first tappable object - replaces drag-and-drop for better touch experience */
.tappable-object {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  touch-action: manipulation;
  min-width: 80px;
  min-height: 80px;
  position: relative;
}

/* Touch feedback - scales up on tap */
.tappable-object:active {
  transform: scale(0.95);
}

/* Selected state - clear visual indicator */
.tappable-object.selected {
  border-color: #667eea;
  border-width: 4px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2),
              0 6px 20px rgba(102, 126, 234, 0.3);
  animation: pulse-select 0.6s ease-out;
}

@keyframes pulse-select {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.object-content {
  pointer-events: none;
}

.object-emoji {
  font-size: 3.5rem;
  display: block;
}

/* Selection checkmark indicator */
.selection-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes pop-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Hover state for desktop - subtle */
@media (hover: hover) {
  .tappable-object:hover:not(.selected) {
    border-color: #b0b0b0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* Focus state for keyboard navigation */
.tappable-object:focus {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}
</style>

