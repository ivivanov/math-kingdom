import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUserStatsStore } from '@/stores/userStats'
import { useProgressStore } from '@/stores/progress'
import { useRewardsStore } from '@/stores/rewards'
import { storageService } from '@/services/storage'
import DashboardView from '@/views/DashboardView.vue'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('DashboardView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    storageService.clearAllData()
    mockPush.mockClear()
    vi.useRealTimers()
  })

  const mountComponent = async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')

    return mount(DashboardView, {
      global: {
        stubs: {
          UserSwitcher: true
        }
      }
    })
  }

  it('displays user level', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const userStatsStore = useUserStatsStore()
    expect(wrapper.text()).toContain(userStatsStore.level.toString())
  })

  it('displays user gems', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const userStatsStore = useUserStatsStore()
    userStatsStore.addGems(50)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('50')
  })

  it('displays user stars', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const userStatsStore = useUserStatsStore()
    userStatsStore.addStars(15)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('15')
  })

  it('displays completed quests count', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const progressStore = useProgressStore()
    progressStore.startQuest('quest1')
    progressStore.completeQuest('quest1', 5, 5)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('1')
  })

  it('displays morning greeting', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T08:00:00'))

    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.greeting).toBe('Good Morning')
    expect(wrapper.text()).toContain('Good Morning')

    vi.useRealTimers()
  })

  it('displays afternoon greeting', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T14:00:00'))

    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.greeting).toBe('Good Afternoon')
    expect(wrapper.text()).toContain('Good Afternoon')

    vi.useRealTimers()
  })

  it('displays evening greeting', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T20:00:00'))

    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.greeting).toBe('Good Evening')
    expect(wrapper.text()).toContain('Good Evening')

    vi.useRealTimers()
  })

  it('displays username in greeting', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('testuser')
  })

  it('displays level progress bar', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const userStatsStore = useUserStatsStore()
    userStatsStore.addStars(5)
    await wrapper.vm.$nextTick()

    const progressFill = wrapper.find('.progress-fill')
    expect(progressFill.exists()).toBe(true)
    expect(progressFill.attributes('style')).toContain('width: 50%')
  })

  it('displays stars to next level', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const userStatsStore = useUserStatsStore()
    userStatsStore.addStars(3)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('7 stars to Level 2')
  })

  it('navigates to realm on button click', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    wrapper.vm.goToRealm()

    expect(mockPush).toHaveBeenCalledWith('/realm/number-village')
  })

  it('navigates to avatar customization', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    wrapper.vm.goToAvatar()

    expect(mockPush).toHaveBeenCalledWith('/avatar')
  })

  it('navigates to room decoration', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    wrapper.vm.goToRoom()

    expect(mockPush).toHaveBeenCalledWith('/room')
  })

  it('loads progress on mount', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')

    const progressStore = useProgressStore()
    const loadProgressSpy = vi.spyOn(progressStore, 'loadProgress')

    mount(DashboardView, {
      global: {
        stubs: {
          UserSwitcher: true
        }
      }
    })

    await vi.waitFor(() => {
      expect(loadProgressSpy).toHaveBeenCalled()
    })
  })

  it('loads rewards on mount', async () => {
    const authStore = useAuthStore()
    await authStore.createUser('testuser', 'password123')

    const rewardsStore = useRewardsStore()
    const loadRewardsSpy = vi.spyOn(rewardsStore, 'loadRewards')

    mount(DashboardView, {
      global: {
        stubs: {
          UserSwitcher: true
        }
      }
    })

    await vi.waitFor(() => {
      expect(loadRewardsSpy).toHaveBeenCalled()
    })
  })

  it('displays realm card as available', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Number Village')
    expect(wrapper.text()).toContain('Available')
  })

  it('displays locked realm', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Operation Castle')
    expect(wrapper.text()).toContain('Locked')
  })

  it('handles realm card click', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const realmCard = wrapper.find('.realm-card')
    await realmCard.trigger('click')

    expect(mockPush).toHaveBeenCalledWith('/realm/number-village')
  })

  it('displays quick action buttons', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Customize Avatar')
    expect(wrapper.text()).toContain('Decorate Room')
  })

  it('handles avatar button click', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const avatarButton = wrapper.find('.avatar-btn')
    await avatarButton.trigger('click')

    expect(mockPush).toHaveBeenCalledWith('/avatar')
  })

  it('handles room button click', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    const roomButton = wrapper.find('.room-btn')
    await roomButton.trigger('click')

    expect(mockPush).toHaveBeenCalledWith('/room')
  })

  it('displays app title', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Math Kingdom')
  })

  it('displays subtitle', async () => {
    const wrapper = await mountComponent()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Ready for your next adventure?')
  })
})

