"use client"

import { useRouter } from "next/navigation"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserSession, UserRole } from "@/types/user"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: UserSession | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permission mapping
const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  admin: {
    MANAGE_MEMBERS: true,
    MANAGE_TRAINING: true,
    MANAGE_MATCHES: true,
    MANAGE_MEDICAL: true,
    MANAGE_USERS: true,
    VIEW_REPORTS: true,
    MANAGE_SETTINGS: true,
    MANAGE_SKILLS: true,
    VIEW_MEMBERS: true,
    VIEW_TRAINING: true,
    VIEW_MATCHES: true,
    VIEW_MEDICAL: true,
    VIEW_SKILLS: true,
  },
  coach: {
    MANAGE_MEMBERS: true,
    MANAGE_TRAINING: true,
    MANAGE_MATCHES: true,
    VIEW_MEDICAL: true,
    VIEW_REPORTS: true,
    MANAGE_SKILLS: true,
    VIEW_MEMBERS: true,
    VIEW_TRAINING: true,
    VIEW_MATCHES: true,
    VIEW_SKILLS: true,
  },
  medical: {
    VIEW_MEMBERS: true,
    MANAGE_MEDICAL: true,
    VIEW_TRAINING: true,
    VIEW_MATCHES: true,
    VIEW_MEDICAL: true,
  },
  player: {
    VIEW_MEMBERS: true,
    VIEW_TRAINING: true,
    VIEW_MATCHES: true,
    VIEW_OWN_MEDICAL: true,
  },
  parent: {
    VIEW_CHILD_INFO: true,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Using singleton pattern to get Supabase client
  const supabase = typeof window !== "undefined" ? getSupabaseBrowserClient() : null

  // Create UserSession object from Supabase user
  const createUserSession = async (supabaseUser: User): Promise<UserSession | null> => {
    if (!supabase) return null

    try {
      // Get additional information from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (userError) {
        console.error("Error getting user data:", userError)
        return null
      }

      // Get role from user metadata or database
      const role = (userData?.role || supabaseUser.user_metadata?.role || "player") as UserRole

      return {
        id: supabaseUser.id,
        name: userData?.full_name || supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        role: role,
        avatar: userData?.avatar_url || "",
        memberId: null, // Can associate member ID here
      }
    } catch (error) {
      console.error("Error creating user session:", error)
      return null
    }
  }

  useEffect(() => {
    // If on server side, return directly
    if (typeof window === "undefined" || !supabase) {
      setIsLoading(false)
      return
    }

    // Check current session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
          setIsLoading(false)
          return
        }

        if (session?.user) {
          const userSession = await createUserSession(session.user)
          setUser(userSession)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for Supabase authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Authentication state change:", event, session?.user?.id)

      if (event === "SIGNED_IN" && session?.user) {
        const userSession = await createUserSession(session.user)
        setUser(userSession)
      } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    if (!supabase) return false

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error.message)
        return false
      }

      if (data.user) {
        const userSession = await createUserSession(data.user)
        if (userSession) {
          setUser(userSession)
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error during login process:", error)
      return false
    }
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }

    setUser(null)
    router.push("/login")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const rolePermissions = ROLE_PERMISSIONS[user.role] || {}
    return !!rolePermissions[permission]
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const supabase = getSupabaseBrowserClient()

  if (!supabase) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) return null

  try {
    const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (!userData) return null

    return {
      id: session.user.id,
      name: userData.full_name || session.user.email || "User",
      email: session.user.email || "",
      role: (userData.role || "player") as UserRole,
      avatar: userData.avatar_url || "",
      memberId: null,
    }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}
