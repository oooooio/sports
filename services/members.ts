import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type Member = Database["public"]["Tables"]["members"]["Row"]
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"]
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"]

export async function getMembers() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("members").select("*").order("name")

  if (error) {
    console.error("Error fetching members:", error)
    throw new Error("Failed to fetch members")
  }

  return data
}

export async function getMemberById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("members").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching member with ID ${id}:`, error)
    throw new Error("Failed to fetch member")
  }

  return data
}

export async function createMember(member: MemberInsert) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("members").insert(member).select().single()

  if (error) {
    console.error("Error creating member:", error)
    throw new Error("Failed to create member")
  }

  return data
}

export async function updateMember(id: string, updates: MemberUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("members").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating member with ID ${id}:`, error)
    throw new Error("Failed to update member")
  }

  return data
}

export async function deleteMember(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("members").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting member with ID ${id}:`, error)
    throw new Error("Failed to delete member")
  }

  return true
}
