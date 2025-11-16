<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DraggableObject from '@/components/shared/DraggableObject.vue'
import DropZone from '@/components/shared/DropZone.vue'
import type { Activity } from '@/types'

const props = defineProps<{
  activity: Activity
  activityIndex: number
}>()

const emit = defineEmits<{
  complete: [correct: boolean, answer: number]
}>()

const droppedItems = ref<string[]>([])
const availableItems = ref<string[]>([])
const currentAnswer = ref<number | null>(null)

// Initialize available items
watch(() => props.activity, (newActivity) => {
  if (newActivity.objects) {
    availableItems.value = newActivity.objects.map((_, index) => `${props.activityIndex}-item-${index}`)
    droppedItems.value = []
    currentAnswer.value = null
  }
}, { immediate: true })

const handleDrop = (itemId: string) => {
  if (!droppedItems.value.includes(itemId)) {
    droppedItems.value.push(itemId)
    currentAnswer.value = droppedItems.value.length
  }
}

const remainingItems = computed(() => {
  return availableItems.value.filter(id => !droppedItems.value.includes(id))
})

const objectType = computed(() => {
  return (index: number) => props.activity.objects?.[index] || 'cookie'
})

const isComplete = computed(() => {
  return remainingItems.value.length === 0
})

const checkAnswer = () => {
  const correctAnswer = Number(props.activity.correctAnswer)
  const userAnswer = droppedItems.value.length
  const isCorrect = userAnswer === correctAnswer
  
  emit('complete', isCorrect, userAnswer)
}

const resetActivity = () => {
  droppedItems.value = []
  currentAnswer.value = null
}
</script>

<template>
  <div class="counting-quest">
    <div class="instructions">
      <h3>{{ activity.instructions }}</h3>
    </div>

    <div class="quest-area">
      <div class="objects-area">
        <h4>Drag these objects:</h4>
        <div class="objects-grid">
          <DraggableObject
            v-for="(itemId, index) in remainingItems"
            :key="itemId"
            :id="itemId"
            :type="objectType(index)"
          />
        </div>
        <p v-if="remainingItems.length === 0" class="all-dragged">
          ✨ All objects moved! Now check your answer.
        </p>
      </div>

      <div class="drop-area">
        <DropZone
          id="basket"
          label="Drop here to count"
          :count="droppedItems.length"
          @drop="handleDrop"
        />
      </div>
    </div>

    <div class="answer-section">
      <div v-if="currentAnswer !== null" class="current-count">
        <span class="count-label">Your count:</span>
        <span class="count-value">{{ currentAnswer }}</span>
      </div>
      
      <div class="action-buttons">
        <button 
          @click="resetActivity" 
          class="btn-secondary"
          :disabled="droppedItems.length === 0"
        >
          🔄 Reset
        </button>
        <button 
          @click="checkAnswer" 
          class="btn-primary"
          :disabled="!isComplete"
        >
          ✓ Check Answer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.counting-quest {
  width: 100%;
}

.instructions {
  text-align: center;
  margin-bottom: 30px;
}

.instructions h3 {
  font-size: 1.5rem;
  color: #333;
}

.quest-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.objects-area,
.drop-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.objects-area h4 {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.objects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  justify-items: center;
  margin-bottom: 20px;
}

.all-dragged {
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
}

.answer-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.current-count {
  display: flex;
  align-items: center;
  gap: 15px;
}

.count-label {
  font-size: 1.2rem;
  color: #666;
  font-weight: 600;
}

.count-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  background: #f0f0f0;
  padding: 10px 25px;
  border-radius: 15px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .quest-area {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .answer-section {
    flex-direction: column;
    gap: 20px;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

