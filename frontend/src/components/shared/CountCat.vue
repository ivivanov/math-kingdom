<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  message: string
  mood?: 'happy' | 'encouraging' | 'celebrating' | 'thinking'
}>()

const catEmoji = computed(() => {
  switch (props.mood) {
    case 'celebrating':
      return '😺'
    case 'thinking':
      return '🤔'
    case 'encouraging':
      return '😸'
    case 'happy':
    default:
      return '😊'
  }
})

const catClass = computed(() => {
  return `cat-${props.mood || 'happy'}`
})
</script>

<template>
  <div class="count-cat" :class="catClass">
    <div class="cat-avatar">
      <div class="cat-face">🐱</div>
      <div class="cat-emotion">{{ catEmoji }}</div>
    </div>
    <div class="cat-speech-bubble">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.count-cat {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin: 20px 0;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cat-avatar {
  position: relative;
  flex-shrink: 0;
}

.cat-face {
  font-size: 4rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.cat-celebrating .cat-face {
  animation: spin 1s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.cat-thinking .cat-face {
  animation: think 2s infinite;
}

@keyframes think {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.cat-emotion {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.cat-speech-bubble {
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 20px;
  position: relative;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 3px solid #667eea;
}

.cat-speech-bubble::before {
  content: '';
  position: absolute;
  left: -15px;
  top: 20px;
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 15px solid #667eea;
}

.cat-speech-bubble::after {
  content: '';
  position: absolute;
  left: -12px;
  top: 22px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
  border-right: 13px solid white;
}

.cat-speech-bubble p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
}

.cat-celebrating .cat-speech-bubble {
  border-color: #4caf50;
  animation: wiggle 0.5s ease-in-out 3;
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.cat-celebrating .cat-speech-bubble::before {
  border-right-color: #4caf50;
}

@media (max-width: 768px) {
  .count-cat {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cat-speech-bubble::before,
  .cat-speech-bubble::after {
    left: 50%;
    top: -15px;
    transform: translateX(-50%) rotate(90deg);
  }
}
</style>

