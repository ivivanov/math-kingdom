import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MultipleChoiceQuest from '@/components/quests/MultipleChoiceQuest.vue'
import type { Activity } from '@/types'

describe('MultipleChoiceQuest', () => {
  const createActivity = (): Activity => ({
    type: 'multiple_choice',
    instructions: 'What is 2 + 2?',
    correctAnswer: 'opt2',
    options: [
      { id: 'opt1', text: '3' },
      { id: 'opt2', text: '4' },
      { id: 'opt3', text: '5' },
      { id: 'opt4', text: '6' }
    ]
  })

  const mountComponent = (activity: Activity) => {
    return mount(MultipleChoiceQuest, {
      props: {
        activity
      }
    })
  }

  it('renders options from activity', () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    const buttons = wrapper.findAll('button.option-card')
    expect(buttons).toHaveLength(4)
    expect(buttons[0].text()).toContain('3')
    expect(buttons[1].text()).toContain('4')
    expect(buttons[2].text()).toContain('5')
    expect(buttons[3].text()).toContain('6')
  })

  it('selects option updates state', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    expect(wrapper.vm.selectedAnswer).toBeNull()

    const optionButtons = wrapper.findAll('button.option-card')
    await optionButtons[1].trigger('click')

    expect(wrapper.vm.selectedAnswer).toBe('opt2')
  })

  it('applies selected class to chosen option', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    const optionButtons = wrapper.findAll('button.option-card')
    
    expect(optionButtons[1].classes()).not.toContain('selected')
    
    await optionButtons[1].trigger('click')
    
    expect(optionButtons[1].classes()).toContain('selected')
  })

  it('checks answer emits correct event for correct answer', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    wrapper.vm.selectOption('opt2')
    wrapper.vm.checkAnswer()

    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([true, 'opt2'])
  })

  it('checks answer emits correct event for incorrect answer', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    wrapper.vm.selectOption('opt1')
    wrapper.vm.checkAnswer()

    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([false, 'opt1'])
  })

  it('check button disabled when no selection', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    const checkButton = wrapper.find('button.btn-primary')
    
    expect(checkButton.attributes('disabled')).toBeDefined()
  })

  it('check button enabled when option selected', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    wrapper.vm.selectOption('opt2')
    await wrapper.vm.$nextTick()

    const checkButton = wrapper.find('button.btn-primary')
    
    expect(checkButton.attributes('disabled')).toBeUndefined()
  })

  it('allows changing selection', async () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    wrapper.vm.selectOption('opt1')
    expect(wrapper.vm.selectedAnswer).toBe('opt1')

    wrapper.vm.selectOption('opt3')
    expect(wrapper.vm.selectedAnswer).toBe('opt3')
  })

  it('displays instructions', () => {
    const activity = createActivity()
    const wrapper = mountComponent(activity)

    const instructions = wrapper.find('.instructions h3')
    expect(instructions.text()).toBe('What is 2 + 2?')
  })
})

