<script setup lang="ts">
import { ref, computed, watch } from "vue";
import TappableObject from "@/components/shared/TappableObject.vue";
import TargetZone from "@/components/shared/TargetZone.vue";
import type { Activity } from "@/types";

const props = defineProps<{
  activity: Activity;
  activityIndex: number;
}>();

const emit = defineEmits<{
  complete: [correct: boolean, answer: number];
}>();

const placedItems = ref<string[]>([]);
const availableItems = ref<string[]>([]);
const selectedItemId = ref<string | null>(null);
const currentAnswer = ref<number | null>(null);

// Initialize available items
watch(
  () => props.activity,
  (newActivity) => {
    if (newActivity.objects) {
      availableItems.value = newActivity.objects.map(
        (_, index) => `${props.activityIndex}-item-${index}`
      );
      placedItems.value = [];
      selectedItemId.value = null;
      currentAnswer.value = null;
    }
  },
  { immediate: true }
);

// Handle object selection - tap-to-select pattern
const handleObjectSelect = (itemId: string) => {
  // If item is already placed, don't allow selection
  if (placedItems.value.includes(itemId)) return;

  // Toggle selection
  if (selectedItemId.value === itemId) {
    selectedItemId.value = null;
  } else {
    selectedItemId.value = itemId;
  }
};

// Handle target zone tap - place selected item
const handleTargetTap = () => {
  if (!selectedItemId.value) return;
  if (placedItems.value.includes(selectedItemId.value)) return;

  placedItems.value.push(selectedItemId.value);
  currentAnswer.value = placedItems.value.length;
  selectedItemId.value = null;
};

const remainingItems = computed(() => {
  return availableItems.value.filter((id) => !placedItems.value.includes(id));
});

const objectType = computed(() => {
  return (index: number) => props.activity.objects?.[index] || "cookie";
});

const isComplete = computed(() => {
  return remainingItems.value.length === 0;
});

const checkAnswer = () => {
  const correctAnswer = Number(props.activity.correctAnswer);
  const userAnswer = placedItems.value.length;
  const isCorrect = userAnswer === correctAnswer;

  emit("complete", isCorrect, userAnswer);
};

const resetActivity = () => {
  placedItems.value = [];
  selectedItemId.value = null;
  currentAnswer.value = null;
};
</script>

<template>
  <div class="counting-quest">
    <!-- Mobile-friendly instructions -->
    <div class="instructions">
      <h3>{{ activity.instructions }}</h3>
      <p class="mobile-hint">
        👆 Tap an object to select it, then tap the basket!
      </p>
    </div>

    <div class="quest-area">
      <div class="objects-area">
        <h4>Tap these objects:</h4>
        <div class="objects-grid">
          <TappableObject
            v-for="itemId in remainingItems"
            :key="itemId"
            :id="itemId"
            :type="objectType(availableItems.indexOf(itemId))"
            :is-selected="selectedItemId === itemId"
            @select="handleObjectSelect"
          />
        </div>
        <p v-if="remainingItems.length === 0" class="all-placed">
          ✨ All objects placed! Now check your answer.
        </p>
        <p v-else-if="selectedItemId" class="selection-feedback">
          ✓ Object selected! Now tap the basket below.
        </p>
      </div>

      <div class="target-area">
        <TargetZone
          id="basket"
          label="Tap to place"
          :count="placedItems.length"
          :has-selected-item="selectedItemId !== null"
          @tap="handleTargetTap"
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
          :disabled="placedItems.length === 0"
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
  margin-bottom: 8px;
}

.mobile-hint {
  font-size: 1rem;
  color: #667eea;
  font-weight: 600;
  margin-top: 8px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.quest-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.objects-area,
.target-area {
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  max-width: 100%;
}

.all-placed {
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  animation: success-pulse 0.6s ease-out;
}

@keyframes success-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.selection-feedback {
  color: #667eea;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  margin-top: 12px;
  animation: feedback-slide 0.3s ease-out;
}

@keyframes feedback-slide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
