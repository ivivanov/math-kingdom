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

const items = ref<Item[]>([])
const selectedCategory = ref<string>('all')

onMounted(() => {
  items.value = (itemsData as Item[]).filter(item => 
    item.type === 'clothing' || item.type === 'pet' || item.type === 'accessory'
  )
  rewardsStore.loadRewards()
})

const categories = computed(() => {
  const cats = new Set<string>()
  cats.add('all')
  items.value.forEach(item => {
    if (item.type) cats.add(item.type)
  })
  return Array.from(cats)
})

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return items.value
  }
  return items.value.filter(item => item.type === selectedCategory.value)
})

const purchaseItem = (item: Item) => {
  const success = rewardsStore.purchaseItem(item)
  if (success) {
    alert(`✨ You purchased ${item.name}!`)
  } else {
    alert(`❌ Not enough gems to purchase ${item.name}`)
  }
}

const toggleEquip = (itemId: string) => {
  rewardsStore.equipItem(itemId)
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="avatar-customization">
    <header class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1 class="page-title">👤 Avatar Customization</h1>
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

      <div class="preview-section">
        <div class="avatar-preview">
          <div class="preview-character">👤</div>
          <div class="equipped-items">
            <p v-if="rewardsStore.equippedItems.length === 0" class="no-items">
              No items equipped
            </p>
            <div v-else class="item-list">
              <span v-for="itemId in rewardsStore.equippedItems" :key="itemId" class="equipped-badge">
                ✓ Item {{ itemId.slice(-5) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="shop-section">
        <div class="section-header">
          <h2>Item Shop</h2>
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="['category-btn', { active: selectedCategory === category }]"
            >
              {{ category === 'all' ? 'All Items' : category }}
            </button>
          </div>
        </div>

        <div class="items-grid">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            :class="['item-card', { owned: rewardsStore.ownsItem(item.id) }]"
          >
            <div class="item-icon">
              <span v-if="item.type === 'clothing'">👕</span>
              <span v-else-if="item.type === 'pet'">🐾</span>
              <span v-else-if="item.type === 'accessory'">🎒</span>
            </div>
            <h4 class="item-name">{{ item.name }}</h4>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-cost">
              <span class="cost-icon">💎</span>
              <span class="cost-value">{{ item.costGems }}</span>
            </div>
            
            <button
              v-if="!rewardsStore.ownsItem(item.id)"
              @click="purchaseItem(item)"
              class="item-btn purchase"
              :disabled="!userStatsStore.canPurchase(item.costGems)"
            >
              Purchase
            </button>
            <button
              v-else
              @click="toggleEquip(item.id)"
              :class="['item-btn', rewardsStore.isItemEquipped(item.id) ? 'unequip' : 'equip']"
            >
              {{ rewardsStore.isItemEquipped(item.id) ? 'Unequip' : 'Equip' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.avatar-customization {
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
  gap: 40px;
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

.preview-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.avatar-preview {
  text-align: center;
}

.preview-character {
  font-size: 8rem;
  margin-bottom: 20px;
}

.equipped-items {
  min-height: 60px;
}

.no-items {
  color: #999;
  font-style: italic;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.equipped-badge {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.shop-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
  text-transform: capitalize;
}

.category-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.item-card {
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

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-card.owned {
  border-color: #4caf50;
  background: #f1f8f4;
}

.item-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.item-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.item-cost {
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

.item-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.item-btn.purchase {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.item-btn.purchase:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.item-btn.purchase:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-btn.equip {
  background: #4caf50;
  color: white;
}

.item-btn.equip:hover {
  background: #45a049;
}

.item-btn.unequip {
  background: #f44336;
  color: white;
}

.item-btn.unequip:hover {
  background: #da190b;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }

  .stats-bar {
    flex-direction: column;
    gap: 20px;
  }
}
</style>

