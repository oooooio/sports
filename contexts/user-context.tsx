"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserSession, UserRole } from "@/types/user"
import { authenticateUser, getRolePermissions } from "@/lib/mock-users"

interface UserContextType {
  user: UserSession | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  permissions: Record<string, boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // 从本地存储中恢复用户会话
    const storedUser = localStorage.getItem("userSession")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setPermissions(getRolePermissions(parsedUser.role as UserRole))
      } catch (error) {
        console.error("Failed to parse stored user session:", error)
        localStorage.removeItem("userSession")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const authenticatedUser = authenticateUser(username, password)

    if (authenticatedUser) {
      setUser(authenticatedUser)
      setPermissions(getRolePermissions(authenticatedUser.role))
      // 保存到本地存储
      localStorage.setItem("userSession", JSON.stringify(authenticatedUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setPermissions({})
    localStorage.removeItem("userSession")
  }

  return <UserContext.Provider value={{ user, login, logout, isLoading, permissions }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
