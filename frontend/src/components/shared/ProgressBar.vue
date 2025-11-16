<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
  label?: string
  showPercentage?: boolean
}>()

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.min(Math.round((props.current / props.total) * 100), 100)
})
</script>

<template>
  <div class="progress-bar-container">
    <div v-if="label" class="progress-label">
      <span>{{ label }}</span>
      <span v-if="showPercentage" class="percentage">{{ percentage }}%</span>
      <span v-else class="count">{{ current }} / {{ total }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: percentage + '%' }"
        :class="{ complete: percentage === 100 }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-container {
  width: 100%;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.percentage,
.count {
  color: #667eea;
}

.progress-bar {
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.progress-fill.complete {
  animation: celebration 0.5s ease-in-out;
}

@keyframes celebration {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2); }
}
</style>

