<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const allUsers = computed(() => authStore.getAllUsers())

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const switchUser = (userId: string) => {
  authStore.switchUser(userId)
  showDropdown.value = false
  router.push('/dashboard')
}

const logout = () => {
  authStore.logout()
  showDropdown.value = false
  router.push('/login')
}

const addUser = () => {
  showDropdown.value = false
  router.push('/login')
}
</script>

<template>
  <div class="user-switcher">
    <button @click="toggleDropdown" class="user-button">
      <span class="user-icon">👤</span>
      <span class="username">{{ authStore.currentUser?.username }}</span>
      <span class="dropdown-arrow">▼</span>
    </button>

    <div v-if="showDropdown" class="dropdown">
      <div class="dropdown-section">
        <div class="current-user-info">
          <strong>{{ authStore.currentUser?.username }}</strong>
          <div class="user-stats">
            Level {{ authStore.currentUser?.level }} • 
            {{ authStore.currentUser?.totalGems }} 💎 • 
            {{ authStore.currentUser?.totalStars }} ⭐
          </div>
        </div>
      </div>

      <div v-if="allUsers.length > 1" class="dropdown-section">
        <div class="section-title">Switch User</div>
        <button
          v-for="user in allUsers.filter(u => u.id !== authStore.currentUser?.id)"
          :key="user.id"
          @click="switchUser(user.id)"
          class="dropdown-item"
        >
          <span>{{ user.username }}</span>
          <span class="user-level">Lvl {{ user.level }}</span>
        </button>
      </div>

      <div class="dropdown-section">
        <button @click="addUser" class="dropdown-item">
          <span>➕ Add New User</span>
        </button>
        <button @click="logout" class="dropdown-item logout">
          <span>🚪 Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-switcher {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  min-height: 44px;
  touch-action: manipulation;
}

.user-button:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.user-icon {
  font-size: 1.2rem;
}

.username {
  font-weight: 600;
  color: #333;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: #999;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-section {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-section:last-child {
  border-bottom: none;
}

.current-user-info {
  padding: 8px;
}

.current-user-info strong {
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
}

.user-stats {
  font-size: 0.85rem;
  color: #666;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding: 0 8px;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
  font-size: 0.95rem;
  color: #333;
  min-height: 44px;
  touch-action: manipulation;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.logout:hover {
  background: #fee;
  color: #e74c3c;
}

.user-level {
  font-size: 0.8rem;
  color: #999;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}
</style>

