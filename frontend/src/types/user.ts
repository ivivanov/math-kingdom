export interface User {
  id: string
  username: string
  passwordHash: string
  createdAt: number
  level: number
  totalGems: number
  totalStars: number
  avatarData: AvatarConfig
  roomData: RoomConfig
}

export interface AvatarConfig {
  clothing: string[]
  pet: string | null
  accessories: string[]
}

export interface RoomConfig {
  furniture: RoomItem[]
}

export interface RoomItem {
  itemId: string
  position: { x: number; y: number }
}

