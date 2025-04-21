"use server"

import { createServerClient } from "@/lib/supabase"
import type { TrainingSessionWithAttendance, TrainingType, TrainingStatus } from "@/services/training"

export async function fetchTrainingSessions(options?: {
  limit?: number
  type?: TrainingType
  status?: TrainingStatus
  startDate?: Date
  endDate?: Date
}): Promise<TrainingSessionWithAttendance[]> {
  const supabase = createServerClient()

  let query = supabase.from("training_sessions").select(`
      *,
      attendance:training_attendance(count)
    `)

  if (options?.type) {
    query = query.eq("type", options.type)
  }

  if (options?.status) {
    query = query.eq("status", options.status)
  }

  if (options?.startDate) {
    query = query.gte("start_time", options.startDate.toISOString())
  }

  if (options?.endDate) {
    query = query.lte("end_time", options.endDate.toISOString())
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order("start_time", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching training sessions:", error)
    throw new Error(`Failed to fetch training sessions: ${error.message}`)
  }

  // Get total members count for attendance percentage calculation
  const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })

  return data.map((session) => ({
    ...session,
    total_members: totalMembers || 0,
    attendance_count: session.attendance?.[0]?.count || 0,
  }))
}

export async function fetchTrainingStatistics(): Promise<{
  total: number
  completed: number
  scheduled: number
  cancelled: number
  attendanceRate: number
}> {
  const supabase = createServerClient()

  // Get training counts by status
  const { data: trainings, error: trainingsError } = await supabase.from("training_sessions").select("status")

  if (trainingsError) {
    console.error("Error fetching training statistics:", trainingsError)
    throw new Error(`Failed to fetch training statistics: ${trainingsError.message}`)
  }

  const total = trainings.length
  const completed = trainings.filter((t) => t.status === "completed").length
  const scheduled = trainings.filter((t) => t.status === "scheduled").length
  const cancelled = trainings.filter((t) => t.status === "cancelled").length

  // Calculate attendance rate for completed trainings
  const { data: attendance, error: attendanceError } = await supabase
    .from("training_attendance")
    .select(`
      training_id,
      status
    `)
    .in("status", ["present", "late"])

  if (attendanceError) {
    console.error("Error fetching attendance statistics:", attendanceError)
    throw new Error(`Failed to fetch attendance statistics: ${attendanceError.message}`)
  }

  // Get total members count
  const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })

  // Calculate attendance rate
  const attendanceRate = completed > 0 && totalMembers ? (attendance.length / (completed * totalMembers)) * 100 : 0

  return {
    total,
    completed,
    scheduled,
    cancelled,
    attendanceRate,
  }
}
