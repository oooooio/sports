"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { MatchList } from "@/components/match-list"
import { MatchCalendar } from "@/components/match-calendar"
import { MatchStats } from "@/components/match-stats"
import Link from "next/link"
import type { MatchWithDetails } from "@/services/matches"
import { useToast } from "@/components/ui/use-toast"
import { getMatchesData } from "./data"

export default function MatchesPage() {
  const { toast } = useToast()
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithDetails[]>([])
  const [pastMatches, setPastMatches] = useState<MatchWithDetails[]>([])
  const [allMatches, setAllMatches] = useState<MatchWithDetails[]>([])
  const [statistics, setStatistics] = useState({
    total: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    upcoming: 0,
    winRate: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getMatchesData()
        setUpcomingMatches(data.upcomingMatches)
        setPastMatches(data.pastMatches)
        setAllMatches([...data.upcomingMatches, ...data.pastMatches])
        setStatistics(data.statistics)
      } catch (error) {
        console.error("Error fetching match data:", error)
        toast({
          title: "Failed to fetch match data",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Match Management</h1>
        <Link href="/dashboard/matches/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Match Record
          </Button>
        </Link>
      </div>
 
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Goals For/Against</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.goalsFor} / {statistics.goalsAgainst}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.upcoming}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Matches</TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchList matches={upcomingMatches} type="upcoming" loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchList matches={pastMatches} type="past" loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchCalendar matches={allMatches} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchStats statistics={statistics} matches={pastMatches} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
