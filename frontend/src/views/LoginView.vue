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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 2rem;
  color: #667eea;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-container {
  margin-bottom: 30px;
}

.form-container h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.existing-users {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.existing-users h3 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
  text-align: center;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-button {
  padding: 12px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.user-button:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateX(5px);
}

.warning {
  margin-top: 20px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.85rem;
  text-align: center;
}
</style>

