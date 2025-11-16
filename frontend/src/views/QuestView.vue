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
/* Mobile-only quest view */
.quest-view {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.back-btn {
  padding: 10px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  transition: transform 0.2s, background 0.2s;
  min-height: 44px;
  touch-action: manipulation;
  align-self: flex-start;
}

.back-btn:active {
  transform: scale(0.95);
  background: #667eea;
  color: white;
}

.quest-title {
  font-size: 1.1rem;
  color: #667eea;
  text-align: center;
  margin: 0;
  padding: 0 8px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.progress-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-container {
  margin: 20px 0;
}

.activity-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.activity-header {
  text-align: center;
  margin-bottom: 24px;
}

.activity-number {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}
</style>

