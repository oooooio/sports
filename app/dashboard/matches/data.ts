"use server"

import { getMatches, getMatchStatistics, type MatchWithDetails } from "@/services/matches"

export async function getMatchesData(): Promise<{
  upcomingMatches: MatchWithDetails[]
  pastMatches: MatchWithDetails[]
  statistics: {
    total: number
    wins: number
    losses: number
    draws: number
    upcoming: number
    winRate: number
    goalsFor: number
    goalsAgainst: number
  }
}> {
  try {
    const [upcoming, past, stats] = await Promise.all([
      getMatches({ upcoming: true }),
      getMatches({ past: true }),
      getMatchStatistics(),
    ])

    return {
      upcomingMatches: upcoming,
      pastMatches: past,
      statistics: stats,
    }
  } catch (error) {
    console.error("Error fetching match data:", error)
    throw new Error(`Failed to fetch match data: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
