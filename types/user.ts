export type UserRole = "admin" | "coach" | "medical" | "player" | "parent"

export interface User {
  id: string
  username: string
  password: string // 注意：实际应用中应该存储哈希值而非明文密码
  name: string
  email: string
  role: UserRole
  avatar?: string
  memberId?: string // 如果是球员，关联到会员ID
  lastLogin?: Date
  isActive: boolean
  createdAt: Date
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  memberId?: string
}
