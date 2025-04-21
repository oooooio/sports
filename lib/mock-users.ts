import type { UserRole } from "@/types/user"

// Mock user data
export const mockUsers = [
  {
    id: "1",
    username: "admin",
    password: "password", // In real applications, should use hashed passwords
    name: "System Administrator",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    isActive: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    username: "coach",
    password: "password",
    name: "Coach Zhang",
    email: "coach@example.com",
    role: "coach",
    avatar: "/placeholder.svg?height=40&width=40",
    isActive: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "3",
    username: "medical",
    password: "password",
    name: "Dr. Li",
    email: "doctor@example.com",
    role: "medical",
    avatar: "/placeholder.svg?height=40&width=40",
    isActive: true,
    createdAt: new Date("2023-02-01"),
  },
  {
    id: "4",
    username: "player",
    password: "password",
    name: "Player Wang",
    email: "player1@example.com",
    role: "player",
    avatar: "/placeholder.svg?height=40&width=40",
    memberId: "101",
    isActive: true,
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "5",
    username: "player2",
    password: "password",
    name: "Player Liu",
    email: "player2@example.com",
    role: "player",
    avatar: "/placeholder.svg?height=40&width=40",
    memberId: "102",
    isActive: true,
    createdAt: new Date("2023-03-01"),
  },
  {
    id: "6",
    username: "parent",
    password: "password",
    name: "Parent Zhao",
    email: "parent1@example.com",
    role: "parent",
    avatar: "/placeholder.svg?height=40&width=40",
    memberId: "103", // Associated with child's member ID
    isActive: true,
    createdAt: new Date("2023-03-15"),
  },
]

// User authentication service
export const authenticateUser = (username: string, password: string) => {
  const user = mockUsers.find((u) => u.username === username && u.password === password && u.isActive)

  if (!user) return null

  // Return session information (excluding sensitive data like password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    memberId: user.memberId,
  }
}

// Add missing getRolePermissions function
export const getRolePermissions = (role: UserRole) => {
  // Define permissions for each role
  const permissions: Record<string, boolean> = {
    // Default: everyone can view the dashboard
    canViewDashboard: true,
  }

  switch (role) {
    case "admin":
      // Admin has all permissions
      permissions.canManageMembers = true
      permissions.canManageSkills = true
      permissions.canManageTraining = true
      permissions.canManageMatches = true
      permissions.canManageUsers = true
      permissions.canAccessSettings = true
      permissions.canViewReports = true
      permissions.canManageMedical = true
      break
    case "coach":
      // Coach can manage members, skills, training, and matches
      permissions.canManageMembers = true
      permissions.canManageSkills = true
      permissions.canManageTraining = true
      permissions.canManageMatches = true
      permissions.canViewReports = true
      break
    case "medical":
      // Medical staff can view members and manage medical records
      permissions.canViewMembers = true
      permissions.canManageMedical = true
      break
    case "player":
      // Players can only view their own profile and schedule
      permissions.canViewOwnProfile = true
      permissions.canViewSchedule = true
      break
    case "parent":
      // Parents can only view their child's profile and schedule
      permissions.canViewChildProfile = true
      permissions.canViewSchedule = true
      break
  }

  return permissions
}

export const findUserById = (id: string) => {
  return mockUsers.find((user) => user.id === id) || null
}

export const findUserByCredentials = (username: string, password: string) => {
  return mockUsers.find((u) => u.username === username && u.password === password) || null
}

export const PERMISSIONS = {
  VIEW_MEMBERS: "canManageMembers",
  MANAGE_MEMBERS: "canManageMembers",
  VIEW_TRAINING: "canManageTraining",
  VIEW_MATCHES: "canManageMatches",
  VIEW_SKILLS: "canManageSkills",
}
