<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUserStatsStore } from "@/stores/userStats";
import { useProgressStore } from "@/stores/progress";
import { useRewardsStore } from "@/stores/rewards";
import UserSwitcher from "@/components/auth/UserSwitcher.vue";

const router = useRouter();
const authStore = useAuthStore();
const userStatsStore = useUserStatsStore();
const progressStore = useProgressStore();
const rewardsStore = useRewardsStore();

onMounted(() => {
  progressStore.loadProgress();
  rewardsStore.loadRewards();
});

const goToRealm = () => {
  router.push("/realm/number-village");
};

const goToAvatar = () => {
  router.push("/avatar");
};

const goToRoom = () => {
  router.push("/room");
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
});
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1 class="app-title">🎓 Math Kingdom</h1>
      <UserSwitcher />
    </header>

    <main class="main-content">
      <div class="welcome-section">
        <h2 class="greeting">
          {{ greeting }}, {{ authStore.currentUser?.username }}!
        </h2>
        <p class="subtitle">Ready for your next adventure?</p>
      </div>

      <div class="stats-cards">
        <div class="stat-card level">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ userStatsStore.level }}</div>
            <div class="stat-label">Level</div>
          </div>
        </div>

        <div class="stat-card gems">
          <div class="stat-icon">💎</div>
          <div class="stat-info">
            <div class="stat-value">{{ userStatsStore.totalGems }}</div>
            <div class="stat-label">Gems</div>
          </div>
        </div>

        <div class="stat-card stars">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ userStatsStore.totalStars }}</div>
            <div class="stat-label">Stars</div>
          </div>
        </div>

        <div class="stat-card quests">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">
              {{ progressStore.getCompletedQuestsCount }}
            </div>
            <div class="stat-label">Quests Done</div>
          </div>
        </div>
      </div>

      <div class="level-progress-section">
        <div class="progress-header">
          <span>Level Progress</span>
          <span class="progress-text"
            >{{ userStatsStore.starsToNextLevel }} stars to Level
            {{ userStatsStore.level + 1 }}</span
          >
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: userStatsStore.levelProgress + '%' }"
          ></div>
        </div>
      </div>

      <div class="realms-section">
        <h3 class="section-title">🗺️ Your Realms</h3>
        <div class="realm-cards">
          <div class="realm-card" @click="goToRealm">
            <div class="realm-icon">🏘️</div>
            <div class="realm-info">
              <h4>Number Village</h4>
              <p>Learn to count and understand numbers</p>
              <div class="realm-badge available">Available</div>
            </div>
          </div>

          <div class="realm-card locked">
            <div class="realm-icon">🏰</div>
            <div class="realm-info">
              <h4>Operation Castle</h4>
              <p>Master addition and subtraction</p>
              <div class="realm-badge locked-badge">🔒 Locked</div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3 class="section-title">⚡ Quick Actions</h3>
        <div class="action-buttons">
          <button @click="goToAvatar" class="action-btn avatar-btn">
            <span class="btn-icon">👤</span>
            <span>Customize Avatar</span>
          </button>
          <button @click="goToRoom" class="action-btn room-btn">
            <span class="btn-icon">🏠</span>
            <span>Decorate Room</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Mobile-only dashboard */
.dashboard {
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

.app-title {
  font-size: 1.25rem;
  color: #667eea;
  margin: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 24px 16px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.welcome-section {
  text-align: center;
  margin-bottom: 24px;
}

.greeting {
  font-size: 1.75rem;
  color: white;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  transition: transform 0.2s;
  touch-action: manipulation;
}

.stat-card:active {
  transform: scale(0.97);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.level-progress-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  gap: 8px;
}

.progress-text {
  color: #667eea;
  text-align: right;
  flex-shrink: 0;
}

.progress-bar {
  height: 32px;
  background: #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
}

.section-title {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 16px;
  font-weight: 600;
}

.realms-section {
  margin-bottom: 24px;
}

.realm-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.realm-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  touch-action: manipulation;
}

.realm-card:active {
  transform: scale(0.98);
}

.realm-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.realm-card.locked:active {
  transform: none;
}

.realm-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.realm-info {
  flex: 1;
  min-width: 0;
}

.realm-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 6px;
}

.realm-info p {
  color: #666;
  margin-bottom: 10px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.realm-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.realm-badge.available {
  background: #d4edda;
  color: #155724;
}

.realm-badge.locked-badge {
  background: #f8d7da;
  color: #721c24;
}

.quick-actions {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  background: white;
  border: none;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  min-height: 72px;
  touch-action: manipulation;
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 2rem;
  flex-shrink: 0;
}
</style>
