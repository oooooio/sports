import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type MedicalRecord = Database["public"]["Tables"]["medical_records"]["Row"]
export type MedicalRecordInsert = Database["public"]["Tables"]["medical_records"]["Insert"]
export type MedicalRecordUpdate = Database["public"]["Tables"]["medical_records"]["Update"]

export async function getMedicalRecords() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("medical_records")
    .select(`
      *,
      members (
        id,
        name
      )
    `)
    .order("record_date", { ascending: false })

  if (error) {
    console.error("Error fetching medical records:", error)
    throw new Error("Failed to fetch medical records")
  }

  return data
}

export async function getMedicalRecordById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("medical_records")
    .select(`
      *,
      members (
        id,
        name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching medical record with ID ${id}:`, error)
    throw new Error("Failed to fetch medical record")
  }

  return data
}

export async function getMedicalRecordsByMemberId(memberId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("medical_records")
    .select("*")
    .eq("member_id", memberId)
    .order("record_date", { ascending: false })

  if (error) {
    console.error(`Error fetching medical records for member ${memberId}:`, error)
    throw new Error("Failed to fetch medical records")
  }

  return data
}

export async function createMedicalRecord(record: MedicalRecordInsert) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("medical_records").insert(record).select().single()

  if (error) {
    console.error("Error creating medical record:", error)
    throw new Error("Failed to create medical record")
  }

  return data
}

export async function updateMedicalRecord(id: string, updates: MedicalRecordUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("medical_records").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating medical record with ID ${id}:`, error)
    throw new Error("Failed to update medical record")
  }

  return data
}

export async function deleteMedicalRecord(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("medical_records").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting medical record with ID ${id}:`, error)
    throw new Error("Failed to delete medical record")
  }

  return true
}
