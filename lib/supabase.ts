import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// 使用模块级变量来存储浏览器客户端实例
let browserClient: SupabaseClient<Database> | null = null

// 获取浏览器端 Supabase 客户端（单例模式）
export function getSupabaseBrowserClient() {
  // 服务器端渲染时返回 null
  if (typeof window === "undefined") {
    return null
  }

  // 如果客户端实例已存在，则返回它
  if (browserClient) {
    return browserClient
  }

  // 创建新的客户端实例
  browserClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: "sports-team-management-auth",
      },
    },
  )

  return browserClient
}

// 创建服务器端 Supabase 客户端
export function createServerClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}
