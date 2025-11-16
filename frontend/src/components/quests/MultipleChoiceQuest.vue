<script setup lang="ts">
import { ref } from 'vue'
import type { Activity } from '@/types'

const props = defineProps<{
  activity: Activity
}>()

const emit = defineEmits<{
  complete: [correct: boolean, answer: string]
}>()

const selectedAnswer = ref<string | null>(null)

const selectOption = (optionId: string) => {
  selectedAnswer.value = optionId
}

const checkAnswer = () => {
  const isCorrect = selectedAnswer.value === props.activity.correctAnswer
  emit('complete', isCorrect, selectedAnswer.value || '')
}
</script>

<template>
  <div class="multiple-choice-quest">
    <div class="instructions">
      <h3>{{ activity.instructions }}</h3>
    </div>

    <div class="options-grid">
      <button
        v-for="option in activity.options"
        :key="option.id"
        @click="selectOption(option.id)"
        :class="['option-card', { selected: selectedAnswer === option.id }]"
      >
        <div class="option-icon">
          {{ selectedAnswer === option.id ? '✓' : '○' }}
        </div>
        <div class="option-text">
          {{ option.text }}
        </div>
      </button>
    </div>

    <div class="action-section">
      <button 
        @click="checkAnswer" 
        class="btn-primary"
        :disabled="!selectedAnswer"
      >
        ✓ Check Answer
      </button>
    </div>
  </div>
</template>

<style scoped>
.multiple-choice-quest {
  width: 100%;
}

.instructions {
  text-align: center;
  margin-bottom: 40px;
}

.instructions h3 {
  font-size: 1.5rem;
  color: #333;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.option-card {
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  text-align: center;
}

.option-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: scale(1.05);
}

.option-icon {
  font-size: 2rem;
  color: #667eea;
  font-weight: 700;
}

.option-text {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.action-section {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 15px 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>

