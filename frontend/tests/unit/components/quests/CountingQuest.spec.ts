import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CountingQuest from '@/components/quests/CountingQuest.vue'
import type { Activity } from '@/types'

describe('CountingQuest', () => {
  const createActivity = (correctAnswer: string, objectsCount: number = 5): Activity => ({
    type: 'counting',
    instructions: 'Count the cookies',
    correctAnswer,
    objects: Array(objectsCount).fill('cookie')
  })

  const mountComponent = (activity: Activity, activityIndex: number = 0) => {
    return mount(CountingQuest, {
      props: {
        activity,
        activityIndex
      },
      global: {
        stubs: {
          TappableObject: true,
          TargetZone: true
        }
      }
    })
  }

  it('initializes with activity objects', async () => {
    const activity = createActivity('5', 5)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.availableItems).toHaveLength(5)
    expect(wrapper.vm.placedItems).toHaveLength(0)
    expect(wrapper.vm.selectedItemId).toBeNull()
    expect(wrapper.vm.currentAnswer).toBeNull()
  })

  it('handles tap-to-select and tap-to-place interaction', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    const itemId = wrapper.vm.availableItems[0]
    
    // Select the object
    wrapper.vm.handleObjectSelect(itemId)
    expect(wrapper.vm.selectedItemId).toBe(itemId)
    
    // Place it in the target
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.placedItems).toContain(itemId)
    expect(wrapper.vm.selectedItemId).toBeNull()
    expect(wrapper.vm.currentAnswer).toBe(1)
  })

  it('tracks current answer count', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    // Select and place first item
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.currentAnswer).toBe(1)

    // Select and place second item
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.currentAnswer).toBe(2)

    // Select and place third item
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[2])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.currentAnswer).toBe(3)
  })

  it('calculates remaining items', async () => {
    const activity = createActivity('5', 5)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.remainingItems).toHaveLength(5)

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.remainingItems).toHaveLength(4)

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.remainingItems).toHaveLength(3)
  })

  it('checks complete state when all items placed', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isComplete).toBe(false)

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.isComplete).toBe(false)

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.isComplete).toBe(false)

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[2])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.isComplete).toBe(true)
  })

  it('checks answer correctly', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[2])
    wrapper.vm.handleTargetTap()

    wrapper.vm.checkAnswer()

    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([true, 3])
  })

  it('checks answer incorrectly', async () => {
    const activity = createActivity('5', 5)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[2])
    wrapper.vm.handleTargetTap()

    wrapper.vm.checkAnswer()

    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([false, 3])
  })

  it('resets activity clears state', async () => {
    const activity = createActivity('5', 5)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[1])
    wrapper.vm.handleTargetTap()

    expect(wrapper.vm.placedItems).toHaveLength(2)
    expect(wrapper.vm.currentAnswer).toBe(2)

    wrapper.vm.resetActivity()

    expect(wrapper.vm.placedItems).toHaveLength(0)
    expect(wrapper.vm.selectedItemId).toBeNull()
    expect(wrapper.vm.currentAnswer).toBeNull()
  })

  it('prevents placing already placed item', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    const itemId = wrapper.vm.availableItems[0]
    
    // Place item once
    wrapper.vm.handleObjectSelect(itemId)
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.placedItems).toHaveLength(1)
    
    // Try to select already placed item (should be prevented)
    wrapper.vm.handleObjectSelect(itemId)
    expect(wrapper.vm.selectedItemId).toBeNull()
  })

  it('allows toggling selection', async () => {
    const activity = createActivity('3', 3)
    const wrapper = mountComponent(activity)

    await wrapper.vm.$nextTick()

    const itemId = wrapper.vm.availableItems[0]
    
    // Select item
    wrapper.vm.handleObjectSelect(itemId)
    expect(wrapper.vm.selectedItemId).toBe(itemId)
    
    // Toggle selection off
    wrapper.vm.handleObjectSelect(itemId)
    expect(wrapper.vm.selectedItemId).toBeNull()
  })

  it('reinitializes when activity changes', async () => {
    const activity1 = createActivity('3', 3)
    const wrapper = mountComponent(activity1)

    await wrapper.vm.$nextTick()

    wrapper.vm.handleObjectSelect(wrapper.vm.availableItems[0])
    wrapper.vm.handleTargetTap()
    expect(wrapper.vm.placedItems).toHaveLength(1)

    const activity2 = createActivity('5', 5)
    await wrapper.setProps({ activity: activity2 })

    expect(wrapper.vm.placedItems).toHaveLength(0)
    expect(wrapper.vm.selectedItemId).toBeNull()
    expect(wrapper.vm.availableItems).toHaveLength(5)
    expect(wrapper.vm.currentAnswer).toBeNull()
  })
})

