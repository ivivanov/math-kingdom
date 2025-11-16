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
.dashboard {
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

.app-title {
  font-size: 1.5rem;
  color: #667eea;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.greeting {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
}

.level-progress-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
}

.progress-text {
  color: #667eea;
}

.progress-bar {
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
}

.section-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 20px;
}

.realms-section {
  margin-bottom: 40px;
}

.realm-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.realm-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.realm-card:not(.locked):hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.realm-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.realm-icon {
  font-size: 3rem;
}

.realm-info {
  flex: 1;
}

.realm-info h4 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
}

.realm-info p {
  color: #666;
  margin-bottom: 12px;
}

.realm-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
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
  margin-bottom: 40px;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-btn {
  background: white;
  border: none;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  .greeting {
    font-size: 1.8rem;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
