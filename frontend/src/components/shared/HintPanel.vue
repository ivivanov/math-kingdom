<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  hint: string
  hintBg?: string
  vocabularyTerms?: string[]
}>()

const showBulgarianHint = ref(false)
const showVocabulary = ref(false)

const toggleBulgarianHint = () => {
  showBulgarianHint.value = !showBulgarianHint.value
}

const toggleVocabulary = () => {
  showVocabulary.value = !showVocabulary.value
}
</script>

<template>
  <div class="hint-panel">
    <div class="hint-header">
      <h4>💡 Need Help?</h4>
    </div>

    <div class="hint-content">
      <div class="hint-section">
        <div class="hint-text">
          <p>{{ hint }}</p>
        </div>
        
        <button 
          v-if="hintBg" 
          @click="toggleBulgarianHint" 
          class="toggle-btn"
        >
          {{ showBulgarianHint ? 'Hide' : 'Show' }} Bulgarian Translation
        </button>
        
        <Transition name="slide">
          <div v-if="showBulgarianHint && hintBg" class="bulgarian-hint">
            <span class="flag">🇧🇬</span>
            <p>{{ hintBg }}</p>
          </div>
        </Transition>
      </div>

      <div v-if="vocabularyTerms && vocabularyTerms.length > 0" class="vocab-section">
        <button @click="toggleVocabulary" class="toggle-btn vocab-btn">
          {{ showVocabulary ? 'Hide' : 'Show' }} Vocabulary ({{ vocabularyTerms.length }})
        </button>
        
        <Transition name="slide">
          <div v-if="showVocabulary" class="vocabulary-list">
            <div 
              v-for="term in vocabularyTerms" 
              :key="term" 
              class="vocab-item"
            >
              <strong>{{ term }}</strong>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hint-panel {
  background: #fff9e6;
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.hint-header {
  margin-bottom: 15px;
}

.hint-header h4 {
  font-size: 1.2rem;
  color: #f57c00;
  margin: 0;
}

.hint-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hint-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hint-text p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.toggle-btn {
  align-self: flex-start;
  padding: 8px 16px;
  background: white;
  border: 2px solid #ffc107;
  border-radius: 8px;
  color: #f57c00;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.toggle-btn:hover {
  background: #ffc107;
  color: white;
}

.bulgarian-hint {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.flag {
  font-size: 1.5rem;
}

.bulgarian-hint p {
  margin: 0;
  color: #333;
  flex: 1;
}

.vocab-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vocab-btn {
  border-color: #667eea;
  color: #667eea;
}

.vocab-btn:hover {
  background: #667eea;
  color: white;
}

.vocabulary-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vocab-item {
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #667eea;
  color: #667eea;
  font-size: 0.9rem;
}

.vocab-item strong {
  font-weight: 600;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>

