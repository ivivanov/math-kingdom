<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import { useUserStatsStore } from '@/stores/userStats'
import { useRewardsStore } from '@/stores/rewards'
import UserSwitcher from '@/components/auth/UserSwitcher.vue'
import CountCat from '@/components/shared/CountCat.vue'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import HintPanel from '@/components/shared/HintPanel.vue'
import RewardAnimation from '@/components/shared/RewardAnimation.vue'
import CountingQuest from '@/components/quests/CountingQuest.vue'
import MultipleChoiceQuest from '@/components/quests/MultipleChoiceQuest.vue'
import questsData from '@/data/quests.json'
import badgesData from '@/data/badges.json'
import type { Quest, Badge } from '@/types'

const router = useRouter()
const route = useRoute()
const progressStore = useProgressStore()
const userStatsStore = useUserStatsStore()
const rewardsStore = useRewardsStore()

const questId = route.params.questId as string
const quest = ref<Quest | null>(null)
const currentActivityIndex = ref(0)
const correctAnswers = ref(0)
const totalAnswers = ref(0)
const showReward = ref(false)
const rewardData = ref<{ gems: number; stars: number; badges: string[] }>({
  gems: 0,
  stars: 0,
  badges: []
})
const catMessage = ref('')
const catMood = ref<'happy' | 'encouraging' | 'celebrating' | 'thinking'>('happy')
const activityTimeoutId = ref<number | null>(null)

// Configurable delay for activity transition
const ACTIVITY_TRANSITION_DELAY = 2000

onMounted(() => {
  const foundQuest = questsData.find(q => q.id === questId) as Quest | undefined
  if (foundQuest) {
    quest.value = foundQuest
    progressStore.startQuest(questId)
    catMessage.value = `Welcome! Let's begin the ${foundQuest.name}. You've got this!`
    totalAnswers.value = foundQuest.content.activities.length
  } else {
    router.push('/realm/number-village')
  }
})

const currentActivity = computed(() => {
  if (!quest.value) return null
  return quest.value.content.activities[currentActivityIndex.value]
})

const handleActivityComplete = (isCorrect: boolean, _answer: number | string) => {
  if (isCorrect) {
    correctAnswers.value++
    catMessage.value = '🎉 Excellent work! That\'s correct!'
    catMood.value = 'celebrating'
  } else {
    catMessage.value = '💪 Not quite right, but don\'t worry! Let\'s try to understand it better.'
    catMood.value = 'encouraging'
  }

  // Clear any existing timeout
  if (activityTimeoutId.value !== null) {
    clearTimeout(activityTimeoutId.value)
  }

  // Move to next activity after a brief delay
  activityTimeoutId.value = window.setTimeout(() => {
    if (currentActivityIndex.value < (quest.value?.content.activities.length || 0) - 1) {
      currentActivityIndex.value++
      catMessage.value = 'Great! Let\'s move on to the next one!'
      catMood.value = 'happy'
    } else {
      completeQuest()
    }
    activityTimeoutId.value = null
  }, ACTIVITY_TRANSITION_DELAY)
}

const completeQuest = () => {
  if (!quest.value) return

  // Calculate rewards
  const gemsEarned = quest.value.rewardsGems
  const starsEarned = quest.value.rewardsStars
  
  // Update progress
  progressStore.completeQuest(questId, correctAnswers.value, totalAnswers.value)
  
  // Award gems and stars
  userStatsStore.addGems(gemsEarned)
  const levelUpResult = userStatsStore.addStars(starsEarned)
  
  // Check for badges
  const earnedBadges: string[] = []
  const badges = badgesData as Badge[]
  
  badges.forEach(badge => {
    if (rewardsStore.hasBadge(badge.id)) return
    
    const { type, value } = badge.unlockCriteria
    let shouldAward = false
    
    if (type === 'quest_complete' && value === questId) {
      shouldAward = true
    } else if (type === 'quests_completed') {
      shouldAward = progressStore.getCompletedQuestsCount >= Number(value)
    } else if (type === 'gems_earned') {
      shouldAward = userStatsStore.totalGems >= Number(value)
    } else if (type === 'stars_earned') {
      shouldAward = userStatsStore.totalStars >= Number(value)
    }
    
    if (shouldAward) {
      rewardsStore.awardBadge(badge.id)
      earnedBadges.push(badge.name)
    }
  })
  
  // Show reward animation
  rewardData.value = {
    gems: gemsEarned,
    stars: starsEarned,
    badges: earnedBadges
  }
  
  let message = `Amazing! You completed the ${quest.value.name}!`
  if (levelUpResult && levelUpResult.leveledUp) {
    message += ` You leveled up to Level ${levelUpResult.newLevel}!`
  }
  
  catMessage.value = message
  catMood.value = 'celebrating'
  showReward.value = true
}

const handleRewardClose = () => {
  showReward.value = false
  router.push('/realm/number-village')
}

const goBack = () => {
  // Clear any pending timeouts when leaving
  if (activityTimeoutId.value !== null) {
    clearTimeout(activityTimeoutId.value)
  }
  router.push('/realm/number-village')
}

onUnmounted(() => {
  if (activityTimeoutId.value !== null) {
    clearTimeout(activityTimeoutId.value)
  }
})
</script>

<template>
  <div class="quest-view">
    <header class="header">
      <button @click="goBack" class="back-btn">← Back to Realm</button>
      <h1 class="quest-title">{{ quest?.name }}</h1>
      <UserSwitcher />
    </header>

    <main v-if="quest" class="main-content">
      <div class="progress-section">
        <ProgressBar 
          :current="currentActivityIndex + 1" 
          :total="quest.content.activities.length"
          label="Quest Progress"
          :show-percentage="false"
        />
      </div>

      <CountCat :message="catMessage" :mood="catMood" />

      <div class="activity-container">
        <div v-if="currentActivity" class="activity-card">
          <div class="activity-header">
            <span class="activity-number">Activity {{ currentActivityIndex + 1 }} of {{ quest.content.activities.length }}</span>
          </div>

          <CountingQuest
            v-if="currentActivity.type === 'counting'"
            :activity="currentActivity"
            :activity-index="currentActivityIndex"
            @complete="handleActivityComplete"
          />

          <MultipleChoiceQuest
            v-else-if="currentActivity.type === 'multiple-choice'"
            :activity="currentActivity"
            @complete="handleActivityComplete"
          />
        </div>
      </div>

      <HintPanel
        v-if="currentActivity"
        :hint="currentActivity.instructions"
        :hint-bg="currentActivity.instructions_bg"
        :vocabulary-terms="quest.vocabularyTerms"
      />
    </main>

    <RewardAnimation
      :show="showReward"
      :gems="rewardData.gems"
      :stars="rewardData.stars"
      :badge="rewardData.badges[0]"
      message="Quest Complete!"
      @close="handleRewardClose"
    />
  </div>
</template>

<style scoped>
.quest-view {
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

.quest-title {
  font-size: 1.5rem;
  color: #667eea;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.progress-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.activity-container {
  margin: 30px 0;
}

.activity-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.activity-header {
  text-align: center;
  margin-bottom: 30px;
}

.activity-number {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }

  .quest-title {
    font-size: 1.2rem;
  }

  .activity-card {
    padding: 25px;
  }
}
</style>

