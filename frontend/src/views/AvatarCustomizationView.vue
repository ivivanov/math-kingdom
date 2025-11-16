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
/* Mobile-only avatar customization */
.avatar-customization {
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

.page-title {
  font-size: 1.25rem;
  color: #667eea;
  margin: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.stats-bar {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  font-size: 1.75rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.preview-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar-preview {
  text-align: center;
}

.preview-character {
  font-size: 6rem;
  margin-bottom: 16px;
}

.equipped-items {
  min-height: 50px;
}

.no-items {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.equipped-badge {
  background: #667eea;
  color: white;
  padding: 8px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.shop-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 16px;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  padding: 10px 18px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: transform 0.2s, background 0.2s, color 0.2s;
  text-transform: capitalize;
  min-height: 44px;
  touch-action: manipulation;
}

.category-btn:active {
  transform: scale(0.95);
}

.category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.item-card {
  background: #f9f9f9;
  border: 3px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s;
  touch-action: manipulation;
}

.item-card:active {
  transform: scale(0.98);
}

.item-card.owned {
  border-color: #4caf50;
  background: #f1f8f4;
}

.item-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}

.item-name {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 6px;
  font-weight: 600;
}

.item-description {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 10px;
  line-height: 1.3;
}

.item-cost {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 700;
}

.cost-icon {
  font-size: 1.25rem;
}

.cost-value {
  color: #667eea;
}

.item-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  font-size: 0.9rem;
  min-height: 44px;
  touch-action: manipulation;
}

.item-btn:active {
  transform: scale(0.95);
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

