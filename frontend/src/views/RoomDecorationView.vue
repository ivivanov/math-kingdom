<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStatsStore } from '@/stores/userStats'
import { useRewardsStore } from '@/stores/rewards'
import UserSwitcher from '@/components/auth/UserSwitcher.vue'
import itemsData from '@/data/items.json'
import type { Item } from '@/types'

const router = useRouter()
const userStatsStore = useUserStatsStore()
const rewardsStore = useRewardsStore()

const furnitureItems = ref<Item[]>([])

onMounted(() => {
  furnitureItems.value = (itemsData as Item[]).filter(item => item.type === 'furniture')
  rewardsStore.loadRewards()
})

const ownedFurniture = computed(() => {
  return furnitureItems.value.filter(item => rewardsStore.ownsItem(item.id))
})

const purchaseFurniture = (item: Item) => {
  const success = rewardsStore.purchaseItem(item)
  if (success) {
    alert(`✨ You purchased ${item.name}!`)
  } else {
    alert(`❌ Not enough gems to purchase ${item.name}`)
  }
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="room-decoration">
    <header class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1 class="page-title">🏠 Room Decoration</h1>
      <UserSwitcher />
    </header>

    <main class="main-content">
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-icon">💎</span>
          <span class="stat-value">{{ userStatsStore.totalGems }}</span>
          <span class="stat-label">Gems</span>
        </div>
      </div>

      <div class="room-preview">
        <div class="room-bg">
          <h3>Your Room</h3>
          <div class="furniture-display">
            <p v-if="ownedFurniture.length === 0" class="no-furniture">
              Your room is empty. Purchase furniture from the shop below!
            </p>
            <div v-else class="furniture-grid">
              <div v-for="item in ownedFurniture" :key="item.id" class="furniture-item">
                <div class="furniture-icon">
                  <span v-if="item.category === 'desk'">🪑</span>
                  <span v-else-if="item.category === 'shelf'">📚</span>
                  <span v-else-if="item.category === 'seating'">🛋️</span>
                  <span v-else-if="item.category === 'decoration'">🌱</span>
                  <span v-else-if="item.category === 'wall-art'">🖼️</span>
                  <span v-else>🪴</span>
                </div>
                <span class="furniture-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shop-section">
        <h2>Furniture Shop</h2>
        <div class="furniture-shop-grid">
          <div
            v-for="item in furnitureItems"
            :key="item.id"
            :class="['furniture-card', { owned: rewardsStore.ownsItem(item.id) }]"
          >
            <div class="furniture-card-icon">
              <span v-if="item.category === 'desk'">🪑</span>
              <span v-else-if="item.category === 'shelf'">📚</span>
              <span v-else-if="item.category === 'seating'">🛋️</span>
              <span v-else-if="item.category === 'decoration'">🌱</span>
              <span v-else-if="item.category === 'wall-art'">🖼️</span>
              <span v-else>🪴</span>
            </div>
            <h4 class="furniture-card-name">{{ item.name }}</h4>
            <p class="furniture-card-description">{{ item.description }}</p>
            <div class="furniture-cost">
              <span class="cost-icon">💎</span>
              <span class="cost-value">{{ item.costGems }}</span>
            </div>
            
            <button
              v-if="!rewardsStore.ownsItem(item.id)"
              @click="purchaseFurniture(item)"
              class="furniture-btn purchase"
              :disabled="!userStatsStore.canPurchase(item.costGems)"
            >
              Purchase
            </button>
            <div v-else class="owned-badge">
              ✓ Owned
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.room-decoration {
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

.page-title {
  font-size: 1.5rem;
  color: #667eea;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.stats-bar {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

.room-preview {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.room-bg {
  background: linear-gradient(to bottom, #e3f2fd 0%, #f5f5f5 100%);
  border: 3px solid #ccc;
  border-radius: 15px;
  padding: 40px;
  min-height: 300px;
}

.room-bg h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.furniture-display {
  min-height: 200px;
}

.no-furniture {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 60px 20px;
}

.furniture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.furniture-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.furniture-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.furniture-name {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.shop-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.shop-section h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.furniture-shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.furniture-card {
  background: #f9f9f9;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s;
}

.furniture-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.furniture-card.owned {
  border-color: #4caf50;
  background: #f1f8f4;
}

.furniture-card-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.furniture-card-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.furniture-card-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.furniture-cost {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 700;
}

.cost-icon {
  font-size: 1.5rem;
}

.cost-value {
  color: #667eea;
}

.furniture-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.furniture-btn.purchase {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.furniture-btn.purchase:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.furniture-btn.purchase:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.owned-badge {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .furniture-shop-grid {
    grid-template-columns: 1fr;
  }

  .furniture-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

