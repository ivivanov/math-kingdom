<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isCreatingAccount = ref(false)
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const existingUsers = ref(authStore.getAllUsers())

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter username and password'
    return
  }

  try {
    const success = await authStore.login(username.value, password.value)
    
    if (success) {
      await router.push('/dashboard')
    } else {
      errorMessage.value = 'Invalid username or password'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login'
    console.error('Login error:', error)
  }
}

const handleCreateAccount = async () => {
  errorMessage.value = ''
  
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter username and password'
    return
  }

  if (password.value.length < 4) {
    errorMessage.value = 'Password must be at least 4 characters'
    return
  }

  try {
    const success = await authStore.createUser(username.value, password.value)
    
    if (success) {
      await router.push('/dashboard')
    } else {
      errorMessage.value = 'Username already exists'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred while creating account'
    console.error('Create account error:', error)
  }
}

const switchToExistingUser = (userId: string) => {
  authStore.switchUser(userId)
  router.push('/dashboard')
}

const toggleMode = () => {
  isCreatingAccount.value = !isCreatingAccount.value
  errorMessage.value = ''
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">🎓 Math Kingdom</h1>
      <p class="subtitle">Welcome to your learning journey!</p>

      <div class="form-container">
        <h2>{{ isCreatingAccount ? 'Create Account' : 'Login' }}</h2>
        
        <form @submit.prevent="isCreatingAccount ? handleCreateAccount() : handleLogin()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              class="input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="input"
            />
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit" class="btn-primary">
            {{ isCreatingAccount ? 'Create Account' : 'Login' }}
          </button>
        </form>

        <button @click="toggleMode" class="btn-secondary">
          {{ isCreatingAccount ? 'Already have an account? Login' : 'Create New Account' }}
        </button>
      </div>

      <div v-if="existingUsers.length > 0 && !isCreatingAccount" class="existing-users">
        <h3>Or switch to existing user:</h3>
        <div class="user-list">
          <button
            v-for="user in existingUsers"
            :key="user.id"
            @click="switchToExistingUser(user.id)"
            class="user-button"
          >
            {{ user.username }} (Level {{ user.level }})
          </button>
        </div>
      </div>

      <div class="warning">
        ⚠️ Note: This is a demo app. Passwords are stored locally in your browser only.
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-only login */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 20px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 1.75rem;
  color: #667eea;
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

.form-container {
  margin-bottom: 24px;
}

.form-container h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

.input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.2s;
  touch-action: manipulation;
  min-height: 52px;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
  font-size: 0.9rem;
  text-align: center;
  padding: 12px;
  background: #fee;
  border-radius: 8px;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  margin-bottom: 12px;
  min-height: 56px;
  touch-action: manipulation;
}

.btn-primary:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-secondary {
  width: 100%;
  padding: 16px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s, color 0.2s;
  min-height: 56px;
  touch-action: manipulation;
}

.btn-secondary:active {
  transform: scale(0.98);
  background: rgba(102, 126, 234, 0.1);
}

.existing-users {
  margin-top: 28px;
  padding-top: 28px;
  border-top: 2px solid #e0e0e0;
}

.existing-users h3 {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 16px;
  text-align: center;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-button {
  padding: 16px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  min-height: 56px;
  touch-action: manipulation;
}

.user-button:active {
  transform: scale(0.98);
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.warning {
  margin-top: 20px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 12px;
  color: #856404;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.5;
}
</style>

