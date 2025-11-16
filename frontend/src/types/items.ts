export interface Item {
  id: string
  type: 'clothing' | 'pet' | 'accessory' | 'furniture'
  category: string
  name: string
  description: string
  costGems: number
  imageUrl: string
}

export interface Badge {
  id: string
  name: string
  description: string
  imageUrl: string
  unlockCriteria: UnlockCriteria
}

export interface UnlockCriteria {
  type: 'quest_complete' | 'quests_completed' | 'gems_earned' | 'stars_earned'
  value: number | string
}

