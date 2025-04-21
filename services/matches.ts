import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type Match = Database["public"]["Tables"]["matches"]["Row"]
export type MatchLineup = Database["public"]["Tables"]["match_lineup"]["Row"]
export type MatchEvent = Database["public"]["Tables"]["match_events"]["Row"]

export type MatchWithDetails = Match & {
  lineup_count?: number
  events?: MatchEvent[]
  lineup?: MatchLineup[]
}

export type MatchInput = Omit<Database["public"]["Tables"]["matches"]["Insert"], "id" | "created_at" | "updated_at">

export type MatchLineupInput = Omit<
  Database["public"]["Tables"]["match_lineup"]["Insert"],
  "id" | "created_at" | "updated_at"
>

export type MatchEventInput = Omit<
  Database["public"]["Tables"]["match_events"]["Insert"],
  "id" | "created_at" | "updated_at"
>

export type MatchType = "friendly" | "league" | "cup" | "tournament" | "other"
export type MatchResult = "win" | "loss" | "draw" | "pending"
export type HomeAway = "home" | "away" | "neutral"
export type EventType =
  | "goal"
  | "assist"
  | "yellow_card"
  | "red_card"
  | "substitution_in"
  | "substitution_out"
  | "injury"
  | "other"

export async function getMatches(options?: {
  limit?: number
  type?: MatchType
  result?: MatchResult
  homeAway?: HomeAway
  upcoming?: boolean
  past?: boolean
}): Promise<MatchWithDetails[]> {
  const supabase = createServerClient()

  let query = supabase.from("matches").select(`
      *,
      lineup:match_lineup(count)
    `)

  if (options?.type) {
    query = query.eq("match_type", options.type)
  }

  if (options?.result) {
    query = query.eq("result", options.result)
  }

  if (options?.homeAway) {
    query = query.eq("home_away", options.homeAway)
  }

  if (options?.upcoming) {
    query = query.gte("match_date", new Date().toISOString())
  }

  if (options?.past) {
    query = query.lt("match_date", new Date().toISOString())
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order("match_date", { ascending: options?.upcoming ? true : false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching matches:", error)
    throw new Error(`Failed to fetch matches: ${error.message}`)
  }

  return data.map((match) => ({
    ...match,
    lineup_count: match.lineup?.[0]?.count || 0,
  }))
}

export async function getMatchById(id: string): Promise<MatchWithDetails | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      lineup:match_lineup(*),
      events:match_events(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      return null
    }
    console.error(`Error fetching match with ID ${id}:`, error)
    throw new Error(`Failed to fetch match: ${error.message}`)
  }

  return data
}

export async function createMatch(matchData: MatchInput, userId: string): Promise<Match> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("matches")
    .insert({
      ...matchData,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating match:", error)
    throw new Error(`Failed to create match: ${error.message}`)
  }

  return data
}

export async function updateMatch(id: string, matchData: Partial<MatchInput>): Promise<Match> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("matches")
    .update({
      ...matchData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating match with ID ${id}:`, error)
    throw new Error(`Failed to update match: ${error.message}`)
  }

  return data
}

export async function deleteMatch(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("matches").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting match with ID ${id}:`, error)
    throw new Error(`Failed to delete match: ${error.message}`)
  }
}

export async function getMatchLineup(matchId: string): Promise<MatchLineup[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("match_lineup")
    .select(`
      *,
      member:members(id, name, position, jersey_number)
    `)
    .eq("match_id", matchId)

  if (error) {
    console.error(`Error fetching lineup for match ID ${matchId}:`, error)
    throw new Error(`Failed to fetch match lineup: ${error.message}`)
  }

  return data
}

export async function updateMatchLineup(
  matchId: string,
  memberId: string,
  lineupData: Partial<MatchLineupInput>,
): Promise<MatchLineup> {
  const supabase = createServerClient()

  // Check if lineup record already exists
  const { data: existingRecord } = await supabase
    .from("match_lineup")
    .select()
    .eq("match_id", matchId)
    .eq("member_id", memberId)
    .maybeSingle()

  if (existingRecord) {
    // Update existing record
    const { data, error } = await supabase
      .from("match_lineup")
      .update({
        ...lineupData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRecord.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating lineup for match ID ${matchId}, member ID ${memberId}:`, error)
      throw new Error(`Failed to update match lineup: ${error.message}`)
    }

    return data
  } else {
    // Create new record
    const { data, error } = await supabase
      .from("match_lineup")
      .insert({
        match_id: matchId,
        member_id: memberId,
        ...lineupData,
      })
      .select()
      .single()

    if (error) {
      console.error(`Error creating lineup for match ID ${matchId}, member ID ${memberId}:`, error)
      throw new Error(`Failed to create match lineup: ${error.message}`)
    }

    return data
  }
}

export async function getMatchEvents(matchId: string): Promise<MatchEvent[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("match_events")
    .select(`
      *,
      member:members(id, name, position, jersey_number)
    `)
    .eq("match_id", matchId)
    .order("minute", { ascending: true })

  if (error) {
    console.error(`Error fetching events for match ID ${matchId}:`, error)
    throw new Error(`Failed to fetch match events: ${error.message}`)
  }

  return data
}

export async function createMatchEvent(eventData: MatchEventInput): Promise<MatchEvent> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("match_events").insert(eventData).select().single()

  if (error) {
    console.error("Error creating match event:", error)
    throw new Error(`Failed to create match event: ${error.message}`)
  }

  return data
}

export async function updateMatchEvent(id: string, eventData: Partial<MatchEventInput>): Promise<MatchEvent> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("match_events")
    .update({
      ...eventData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating match event with ID ${id}:`, error)
    throw new Error(`Failed to update match event: ${error.message}`)
  }

  return data
}

export async function deleteMatchEvent(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("match_events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting match event with ID ${id}:`, error)
    throw new Error(`Failed to delete match event: ${error.message}`)
  }
}

export async function getMatchesByDateRange(startDate: Date, endDate: Date): Promise<MatchWithDetails[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      lineup:match_lineup(count),
      events:match_events(count)
    `)
    .gte("match_date", startDate.toISOString())
    .lte("match_date", endDate.toISOString())
    .order("match_date", { ascending: true })

  if (error) {
    console.error("Error fetching matches by date range:", error)
    throw new Error(`Failed to fetch matches: ${error.message}`)
  }

  return data.map((match) => ({
    ...match,
    lineup_count: match.lineup?.[0]?.count || 0,
    events_count: match.events?.[0]?.count || 0,
  }))
}

export async function getMatchStatistics(): Promise<{
  total: number
  wins: number
  losses: number
  draws: number
  upcoming: number
  winRate: number
  goalsFor: number
  goalsAgainst: number
}> {
  const supabase = createServerClient()

  // Get all matches
  const { data: matches, error: matchesError } = await supabase.from("matches").select("*")

  if (matchesError) {
    console.error("Error fetching match statistics:", matchesError)
    throw new Error(`Failed to fetch match statistics: ${matchesError.message}`)
  }

  const now = new Date()

  const total = matches.length
  const wins = matches.filter((m) => m.result === "win").length
  const losses = matches.filter((m) => m.result === "loss").length
  const draws = matches.filter((m) => m.result === "draw").length
  const upcoming = matches.filter((m) => new Date(m.match_date) > now).length

  const completedMatches = matches.filter((m) => m.result !== "pending")
  const winRate = completedMatches.length > 0 ? (wins / completedMatches.length) * 100 : 0

  const goalsFor = matches.reduce((sum, match) => sum + (match.score_for || 0), 0)
  const goalsAgainst = matches.reduce((sum, match) => sum + (match.score_against || 0), 0)

  return {
    total,
    wins,
    losses,
    draws,
    upcoming,
    winRate,
    goalsFor,
    goalsAgainst,
  }
}
