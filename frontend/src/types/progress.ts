export interface UserProgress {
  userId: string
  questProgress: Record<string, QuestProgress>
  earnedBadges: string[]
  ownedItems: string[]
  equippedItems: string[]
}

export interface QuestProgress {
  questId: string
  status: 'not_started' | 'in_progress' | 'completed'
  attempts: number
  correctAnswers: number
  totalAnswers: number
  completedAt?: number
}

