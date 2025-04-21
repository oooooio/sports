"use server"

import { revalidatePath } from "next/cache"
import {
  createMatch,
  updateMatch,
  deleteMatch,
  updateMatchLineup,
  createMatchEvent,
  updateMatchEvent,
  deleteMatchEvent,
  type MatchInput,
  type MatchLineupInput,
  type MatchEventInput,
} from "@/services/matches"
import { getCurrentUser } from "@/contexts/auth-context"

export async function createMatchRecord(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    const opponent = formData.get("opponent") as string
    const location = formData.get("location") as string
    const matchDateStr = formData.get("matchDate") as string
    const matchType = formData.get("matchType") as "friendly" | "league" | "cup" | "tournament" | "other"
    const homeAway = formData.get("homeAway") as "home" | "away" | "neutral"
    const notes = formData.get("notes") as string

    // Validate required fields
    if (!opponent || !matchDateStr) {
      return { success: false, message: "Please fill in all required fields" }
    }

    // Parse date
    const matchDate = new Date(matchDateStr).toISOString()

    const matchData: MatchInput = {
      opponent,
      location,
      match_date: matchDate,
      match_type: matchType || "friendly",
      home_away: homeAway || "home",
      notes,
      result: "pending",
      created_by: user.id,
    }

    await createMatch(matchData, user.id)

    revalidatePath("/dashboard/matches")
    return { success: true, message: "Match record created successfully" }
  } catch (error) {
    console.error("Failed to create match record:", error)
    return {
      success: false,
      message: `Failed to create match record: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function updateMatchRecord(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    const opponent = formData.get("opponent") as string
    const location = formData.get("location") as string
    const matchDateStr = formData.get("matchDate") as string
    const matchType = formData.get("matchType") as "friendly" | "league" | "cup" | "tournament" | "other"
    const homeAway = formData.get("homeAway") as "home" | "away" | "neutral"
    const result = formData.get("result") as "win" | "loss" | "draw" | "pending"
    const scoreFor = Number.parseInt(formData.get("scoreFor") as string) || null
    const scoreAgainst = Number.parseInt(formData.get("scoreAgainst") as string) || null
    const notes = formData.get("notes") as string

    // Validate required fields
    if (!opponent || !matchDateStr) {
      return { success: false, message: "Please fill in all required fields" }
    }

    // Parse date
    const matchDate = new Date(matchDateStr).toISOString()

    const matchData: Partial<MatchInput> = {
      opponent,
      location,
      match_date: matchDate,
      match_type: matchType,
      home_away: homeAway,
      result,
      score_for: scoreFor,
      score_against: scoreAgainst,
      notes,
    }

    await updateMatch(id, matchData)

    revalidatePath(`/dashboard/matches/${id}`)
    revalidatePath("/dashboard/matches")
    return { success: true, message: "Match record updated successfully" }
  } catch (error) {
    console.error("Failed to update match record:", error)
    return {
      success: false,
      message: `Failed to update match record: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function deleteMatchRecord(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    await deleteMatch(id)

    revalidatePath("/dashboard/matches")
    return { success: true, message: "Match record deleted successfully" }
  } catch (error) {
    console.error("Failed to delete match record:", error)
    return {
      success: false,
      message: `Failed to delete match record: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function updateLineup(matchId: string, memberId: string, lineupData: Partial<MatchLineupInput>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    await updateMatchLineup(matchId, memberId, lineupData)

    revalidatePath(`/dashboard/matches/${matchId}`)
    return { success: true, message: "Lineup updated successfully" }
  } catch (error) {
    console.error("Failed to update lineup:", error)
    return {
      success: false,
      message: `Failed to update lineup: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function addMatchEvent(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    const matchId = formData.get("matchId") as string
    const memberId = formData.get("memberId") as string
    const eventType = formData.get("eventType") as
      | "goal"
      | "assist"
      | "yellow_card"
      | "red_card"
      | "substitution_in"
      | "substitution_out"
      | "injury"
      | "other"
    const minute = Number.parseInt(formData.get("minute") as string) || 0
    const description = formData.get("description") as string

    // Validate required fields
    if (!matchId || !memberId || !eventType) {
      return { success: false, message: "Please fill in all required fields" }
    }
 
    const eventData: MatchEventInput = {
      match_id: matchId,
      member_id: memberId,
      event_type: eventType,
      minute,
      description,
    }

    await createMatchEvent(eventData)

    revalidatePath(`/dashboard/matches/${matchId}`)
    return { success: true, message: "Match event added successfully" }
  } catch (error) {
    console.error("Failed to add match event:", error)
    return {
      success: false,
      message: `Failed to add match event: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function updateMatchEventRecord(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    const matchId = formData.get("matchId") as string
    const eventType = formData.get("eventType") as
      | "goal"
      | "assist"
      | "yellow_card"
      | "red_card"
      | "substitution_in"
      | "substitution_out"
      | "injury"
      | "other"
    const minute = Number.parseInt(formData.get("minute") as string) || 0
    const description = formData.get("description") as string

    const eventData: Partial<MatchEventInput> = {
      event_type: eventType,
      minute,
      description,
    }

    await updateMatchEvent(id, eventData)

    revalidatePath(`/dashboard/matches/${matchId}`)
    return { success: true, message: "Match event updated successfully" }
  } catch (error) {
    console.error("Failed to update match event:", error)
    return {
      success: false,
      message: `Failed to update match event: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function deleteMatchEventRecord(id: string, matchId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Unauthorized, please login first" }
    }

    await deleteMatchEvent(id)

    revalidatePath(`/dashboard/matches/${matchId}`)
    return { success: true, message: "Match event deleted successfully" }
  } catch (error) {
    console.error("Failed to delete match event:", error)
    return {
      success: false,
      message: `Failed to delete match event: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
