import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"]
export type TrainingAttendance = Database["public"]["Tables"]["training_attendance"]["Row"]

export type TrainingSessionWithAttendance = TrainingSession & {
  attendance_count?: number
  total_members?: number
  attendance?: TrainingAttendance[]
}

export type TrainingSessionInput = Omit<
  Database["public"]["Tables"]["training_sessions"]["Insert"],
  "id" | "created_at" | "updated_at"
>

export type TrainingAttendanceInput = Omit<
  Database["public"]["Tables"]["training_attendance"]["Insert"],
  "id" | "created_at" | "updated_at"
>

export type TrainingType = "regular" | "fitness" | "tactical" | "recovery" | "other"
export type TrainingStatus = "scheduled" | "completed" | "cancelled"

export async function getTrainingSessions(options?: {
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

export async function getTrainingSessionById(id: string): Promise<TrainingSessionWithAttendance | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("training_sessions")
    .select(`
      *,
      attendance:training_attendance(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      return null
    }
    console.error(`Error fetching training session with ID ${id}:`, error)
    throw new Error(`Failed to fetch training session: ${error.message}`)
  }

  // Get total members count for attendance percentage calculation
  const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })

  return {
    ...data,
    total_members: totalMembers || 0,
    attendance_count: data.attendance?.length || 0,
  }
}

export async function createTrainingSession(
  trainingData: TrainingSessionInput,
  userId: string,
): Promise<TrainingSession> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("training_sessions")
    .insert({
      ...trainingData,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating training session:", error)
    throw new Error(`Failed to create training session: ${error.message}`)
  }

  return data
}

export async function updateTrainingSession(
  id: string,
  trainingData: Partial<TrainingSessionInput>,
): Promise<TrainingSession> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("training_sessions")
    .update({
      ...trainingData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating training session with ID ${id}:`, error)
    throw new Error(`Failed to update training session: ${error.message}`)
  }

  return data
}

export async function deleteTrainingSession(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("training_sessions").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting training session with ID ${id}:`, error)
    throw new Error(`Failed to delete training session: ${error.message}`)
  }
}

export async function getTrainingAttendance(trainingId: string): Promise<TrainingAttendance[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("training_attendance")
    .select(`
      *,
      member:members(id, name, position, jersey_number)
    `)
    .eq("training_id", trainingId)

  if (error) {
    console.error(`Error fetching attendance for training ID ${trainingId}:`, error)
    throw new Error(`Failed to fetch training attendance: ${error.message}`)
  }

  return data
}

export async function updateTrainingAttendance(
  trainingId: string,
  memberId: string,
  status: "present" | "absent" | "late" | "excused",
  notes?: string,
): Promise<TrainingAttendance> {
  const supabase = createServerClient()

  // Check if attendance record already exists
  const { data: existingRecord } = await supabase
    .from("training_attendance")
    .select()
    .eq("training_id", trainingId)
    .eq("member_id", memberId)
    .maybeSingle()

  if (existingRecord) {
    // Update existing record
    const { data, error } = await supabase
      .from("training_attendance")
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRecord.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating attendance for training ID ${trainingId}, member ID ${memberId}:`, error)
      throw new Error(`Failed to update training attendance: ${error.message}`)
    }

    return data
  } else {
    // Create new record
    const { data, error } = await supabase
      .from("training_attendance")
      .insert({
        training_id: trainingId,
        member_id: memberId,
        status,
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error(`Error creating attendance for training ID ${trainingId}, member ID ${memberId}:`, error)
      throw new Error(`Failed to create training attendance: ${error.message}`)
    }

    return data
  }
}

export async function getTrainingSessionsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<TrainingSessionWithAttendance[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("training_sessions")
    .select(`
      *,
      attendance:training_attendance(count)
    `)
    .gte("start_time", startDate.toISOString())
    .lte("end_time", endDate.toISOString())
    .order("start_time", { ascending: true })

  if (error) {
    console.error("Error fetching training sessions by date range:", error)
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

export async function getTrainingStatistics(): Promise<{
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
