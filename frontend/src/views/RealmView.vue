<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import UserSwitcher from '@/components/auth/UserSwitcher.vue'
import questsData from '@/data/quests.json'
import type { Quest } from '@/types'

const router = useRouter()
const progressStore = useProgressStore()

const quests = ref<Quest[]>([])

onMounted(() => {
  quests.value = questsData as Quest[]
})

const getQuestStatus = (questId: string) => {
  const progress = progressStore.getQuestProgress(questId)
  if (!progress) return 'not_started'
  return progress.status
}

const getQuestIcon = (status: string) => {
  if (status === 'completed') return '✅'
  if (status === 'in_progress') return '⏳'
  return '📝'
}

const getQuestClass = (status: string) => {
  if (status === 'completed') return 'completed'
  if (status === 'in_progress') return 'in-progress'
  return 'available'
}

const startQuest = (questId: string) => {
  router.push(`/quest/${questId}`)
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="realm-view">
    <header class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1 class="app-title">🏘️ Number Village</h1>
      <UserSwitcher />
    </header>

    <main class="main-content">
      <div class="realm-intro">
        <div class="cat-character">🐱</div>
        <div class="intro-text">
          <h2>Welcome to Number Village!</h2>
          <p>Hi there! I'm Count Cat, and I'll be your guide through this wonderful village. 
             Here you'll learn all about numbers, counting, and the amazing world of mathematics!</p>
        </div>
      </div>

      <div class="quests-section">
        <h3 class="section-title">Available Quests</h3>
        <div class="quests-grid">
          <div
            v-for="quest in quests"
            :key="quest.id"
            :class="['quest-card', getQuestClass(getQuestStatus(quest.id))]"
            @click="startQuest(quest.id)"
          >
            <div class="quest-header">
              <div class="quest-icon">{{ getQuestIcon(getQuestStatus(quest.id)) }}</div>
              <div class="quest-type">{{ quest.questType }}</div>
            </div>
            <h4 class="quest-name">{{ quest.name }}</h4>
            <p class="quest-description">{{ quest.description }}</p>
            <div class="quest-rewards">
              <span class="reward">💎 {{ quest.rewardsGems }}</span>
              <span class="reward">⭐ {{ quest.rewardsStars }}</span>
            </div>
            <div class="quest-vocab">
              <strong>Learn:</strong> {{ quest.vocabularyTerms.join(', ') }}
            </div>
            <button class="quest-btn">
              {{ getQuestStatus(quest.id) === 'completed' ? 'Review' : 'Start Quest' }}
            </button>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <h3>💡 Tips from Count Cat</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">🎯</div>
            <p>Complete all quests to unlock the next realm!</p>
          </div>
          <div class="tip-card">
            <div class="tip-icon">💎</div>
            <p>Earn gems to buy cool items for your avatar!</p>
          </div>
          <div class="tip-card">
            <div class="tip-icon">⭐</div>
            <p>Collect stars to level up faster!</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Mobile-only realm view */
.realm-view {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.back-btn {
  padding: 12px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  transition: transform 0.2s, background 0.2s;
  min-height: 44px;
  touch-action: manipulation;
}

.back-btn:active {
  transform: scale(0.95);
  background: #667eea;
  color: white;
}

.app-title {
  font-size: 1.25rem;
  color: #667eea;
  margin: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px 16px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.realm-intro {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.cat-character {
  font-size: 4.5rem;
  animation: bounce 2s infinite;
  margin-bottom: 16px;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.intro-text h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 12px;
}

.intro-text p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

.section-title {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 16px;
  font-weight: 600;
}

.quests-section {
  margin-bottom: 24px;
}

.quests-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quest-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
}

.quest-card:active {
  transform: scale(0.98);
}

.quest-card.completed {
  border: 3px solid #28a745;
}

.quest-card.in-progress {
  border: 3px solid #ffc107;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.quest-icon {
  font-size: 2.5rem;
}

.quest-type {
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.quest-name {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 8px;
}

.quest-description {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  font-size: 0.9rem;
}

.quest-rewards {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.reward {
  background: #f5f5f5;
  padding: 8px 14px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.9rem;
}

.quest-vocab {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
  line-height: 1.4;
}

.quest-vocab strong {
  color: #333;
}

.quest-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  min-height: 52px;
  touch-action: manipulation;
}

.quest-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.tips-section {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.tips-section h3 {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.tips-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.tip-card p {
  color: #666;
  font-size: 0.9rem;
  text-align: left;
  line-height: 1.4;
}
</style>

