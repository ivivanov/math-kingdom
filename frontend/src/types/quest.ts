export interface Quest {
  id: string
  name: string
  description: string
  questType: 'discovery' | 'practice' | 'master' | 'teaching'
  vocabularyTerms: string[]
  rewardsGems: number
  rewardsStars: number
  content: QuestContent
}

export interface QuestContent {
  activities: Activity[]
}

export interface Activity {
  type: string
  instructions: string
  instructions_bg: string
  correctAnswer: number | string
  objects?: string[]
  options?: MultipleChoiceOption[]
  hint_bg?: string
}

export interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean
}

