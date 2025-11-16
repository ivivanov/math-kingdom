<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRewardsStore } from '@/stores/rewards'
import badgesData from '@/data/badges.json'
import type { Badge } from '@/types'

const rewardsStore = useRewardsStore()
const badges = ref<Badge[]>([])

onMounted(() => {
  badges.value = badgesData as Badge[]
  rewardsStore.loadRewards()
})

const hasBadge = (badgeId: string): boolean => {
  return rewardsStore.hasBadge(badgeId)
}
</script>

<template>
  <div class="badge-display">
    <h3 class="section-title">🏆 Your Badges</h3>
    <div class="badges-grid">
      <div
        v-for="badge in badges"
        :key="badge.id"
        :class="['badge-card', { earned: hasBadge(badge.id), locked: !hasBadge(badge.id) }]"
      >
        <div class="badge-icon">
          <span v-if="hasBadge(badge.id)">🏆</span>
          <span v-else>🔒</span>
        </div>
        <h4 class="badge-name">{{ badge.name }}</h4>
        <p class="badge-description">{{ badge.description }}</p>
        <div v-if="hasBadge(badge.id)" class="earned-indicator">
          ✓ Earned
        </div>
        <div v-else class="locked-indicator">
          Not yet earned
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge-display {
  width: 100%;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.badge-card {
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s;
}

.badge-card.earned {
  border-color: #ffc107;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.badge-card.earned:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
}

.badge-card.locked {
  opacity: 0.6;
}

.badge-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.badge-name {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.badge-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
  flex: 1;
}

.earned-indicator {
  background: #4caf50;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.locked-indicator {
  background: #f5f5f5;
  color: #999;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .badges-grid {
    grid-template-columns: 1fr;
  }
}
</style>

