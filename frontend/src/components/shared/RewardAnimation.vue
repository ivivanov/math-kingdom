<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  gems?: number
  stars?: number
  badge?: string
  message?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const localShow = ref(props.show)
const timeoutId = ref<number | null>(null)

watch(() => props.show, (newVal) => {
  // Clear any existing timeout
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }
  
  localShow.value = newVal
  if (newVal) {
    timeoutId.value = window.setTimeout(() => {
      emit('close')
      timeoutId.value = null
    }, 3000)
  }
})

const handleClose = () => {
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }
  localShow.value = false
  emit('close')
}

onUnmounted(() => {
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="localShow" class="reward-overlay" @click="handleClose">
      <div class="reward-card" @click.stop>
        <div class="reward-icon">🎉</div>
        <h2 class="reward-title">{{ message || 'Congratulations!' }}</h2>
        
        <div class="rewards-list">
          <div v-if="gems" class="reward-item gems">
            <span class="reward-emoji">💎</span>
            <span class="reward-amount">+{{ gems }}</span>
            <span class="reward-label">Gems</span>
          </div>
          
          <div v-if="stars" class="reward-item stars">
            <span class="reward-emoji">⭐</span>
            <span class="reward-amount">+{{ stars }}</span>
            <span class="reward-label">Stars</span>
          </div>
          
          <div v-if="badge" class="reward-item badge">
            <span class="reward-emoji">🏆</span>
            <span class="reward-label">{{ badge }}</span>
          </div>
        </div>

        <button @click="handleClose" class="close-btn">
          Continue
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.reward-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding-bottom: env(safe-area-inset-bottom);
}

.reward-card {
  background: white;
  border-radius: 25px;
  padding: 30px 20px;
  max-width: 500px;
  max-height: 80vh;
  max-height: 80dvh;
  overflow-y: auto;
  text-align: center;
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 0 16px;
}

@media (min-width: 768px) {
  .reward-card {
    padding: 50px;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.reward-icon {
  font-size: 5rem;
  animation: rotate 1s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.reward-title {
  font-size: 2rem;
  color: #333;
  margin: 20px 0;
}

.rewards-list {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: popIn 0.5s ease-out forwards;
  opacity: 0;
}

.reward-item.gems {
  animation-delay: 0.2s;
}

.reward-item.stars {
  animation-delay: 0.4s;
}

.reward-item.badge {
  animation-delay: 0.6s;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.reward-emoji {
  font-size: 3rem;
}

.reward-amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.reward-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.close-btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  min-height: 48px;
  touch-action: manipulation;
}

.close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

