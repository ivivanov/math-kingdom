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
.realm-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #667eea;
  color: white;
}

.app-title {
  font-size: 1.5rem;
  color: #667eea;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.realm-intro {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  display: flex;
  gap: 30px;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.cat-character {
  font-size: 6rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.intro-text h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
}

.intro-text p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.section-title {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 30px;
}

.quests-section {
  margin-bottom: 40px;
}

.quests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.quest-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quest-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  margin-bottom: 15px;
}

.quest-icon {
  font-size: 2.5rem;
}

.quest-type {
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.quest-name {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.quest-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.quest-rewards {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.reward {
  background: #f5f5f5;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
}

.quest-vocab {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.quest-vocab strong {
  color: #333;
}

.quest-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.quest-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.tips-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
}

.tips-section h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.tip-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.tip-card p {
  color: #666;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .realm-intro {
    flex-direction: column;
    text-align: center;
  }

  .quests-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>

