import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { User } from "@/types/user"

export interface UserWithAuth extends User {
  created_at: string
  last_sign_in_at?: string
}

// 获取所有用户
export async function getUsers(): Promise<UserWithAuth[]> {
  const supabase = getSupabaseBrowserClient()

  // 首先获取 auth.users 表中的用户
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error("获取认证用户列表失败:", authError)
    throw new Error("获取用户列表失败")
  }

  // 然后获取 public.users 表中的用户详情
  const { data: userDetails, error: userError } = await supabase.from("users").select("*")

  if (userError) {
    console.error("获取用户详情失败:", userError)
    throw new Error("获取用户详情失败")
  }

  // 合并两个数据源
  const users = authUsers.users.map((authUser) => {
    const userDetail = userDetails.find((u) => u.id === authUser.id) || {}

    return {
      id: authUser.id,
      username: userDetail.username || authUser.email?.split("@")[0] || "",
      name: userDetail.full_name || authUser.user_metadata?.full_name || "未命名用户",
      email: authUser.email || "",
      role: userDetail.role || authUser.user_metadata?.role || "player",
      avatar: userDetail.avatar_url || "",
      isActive: !authUser.banned_until,
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at,
    }
  })

  return users
}

// 更新用户状态（启用/禁用）
export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  if (isActive) {
    // 启用用户
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "0 seconds",
    })

    if (error) {
      console.error("启用用户失败:", error)
      throw new Error("启用用户失败")
    }
  } else {
    // 禁用用户 (禁用 100 年)
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "876000 hours",
    })

    if (error) {
      console.error("禁用用户失败:", error)
      throw new Error("禁用用户失败")
    }
  }
}

// 更新用户角色
export async function updateUserRole(userId: string, role: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  // 更新 auth.users 表中的用户元数据
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  })

  if (authError) {
    console.error("更新用户角色失败:", authError)
    throw new Error("更新用户角色失败")
  }

  // 更新 public.users 表中的角色
  const { error: userError } = await supabase.from("users").update({ role }).eq("id", userId)

  if (userError) {
    console.error("更新用户详情失败:", userError)
    throw new Error("更新用户详情失败")
  }
}

// 重置用户密码
export async function resetUserPassword(userId: string, password: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
  })

  if (error) {
    console.error("重置密码失败:", error)
    throw new Error("重置密码失败")
  }
}

// 创建新用户
export async function createUser(userData: {
  email: string
  password: string
  full_name: string
  role: string
  username?: string
}): Promise<string> {
  const supabase = getSupabaseBrowserClient()

  // 创建 auth 用户
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    user_metadata: {
      full_name: userData.full_name,
      role: userData.role,
    },
    email_confirm: true,
  })

  if (authError) {
    console.error("创建用户失败:", authError)
    throw new Error(`创建用户失败: ${authError.message}`)
  }

  const userId = authData.user.id

  // 创建用户详情
  const { error: userError } = await supabase.from("users").insert({
    id: userId,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role,
    username: userData.username || userData.email.split("@")[0],
  })

  if (userError) {
    console.error("创建用户详情失败:", userError)
    // 尝试删除已创建的认证用户
    await supabase.auth.admin.deleteUser(userId)
    throw new Error(`创建用户详情失败: ${userError.message}`)
  }

  return userId
}
