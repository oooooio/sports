"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MatchQuickView } from "@/components/match-quick-view"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MatchCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [month, setMonth] = useState<Date>(new Date())
  const [competitionFilter, setCompetitionFilter] = useState<string>("all")
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Mock data - match dates with more details
  const matchData = [
    {
      id: 1,
      opponent: "Beijing FC",
      date: new Date(2023, 3, 10),
      time: "15:00",
      location: "Home Stadium",
      venue: "Home",
      competition: "League",
      result: "Win 3-1",
      score: { home: 3, away: 1 },
      status: "Completed",
    },
    {
      id: 2,
      opponent: "Shanghai FC",
      date: new Date(2023, 3, 17),
      time: "19:30",
      location: "Shanghai Stadium",
      venue: "Away",
      competition: "League",
      result: "Loss 1-2",
      score: { home: 1, away: 2 },
      status: "Completed",
    },
    {
      id: 3,
      opponent: "Guangzhou FC",
      date: new Date(2023, 3, 24),
      time: "15:00",
      location: "Home Stadium",
      venue: "Home",
      competition: "Cup",
      result: "Draw 2-2",
      score: { home: 2, away: 2 },
      status: "Completed",
    },
    {
      id: 4,
      opponent: "Chongqing FC",
      date: new Date(2023, 4, 1),
      time: "15:00",
      location: "Chongqing Stadium",
      venue: "Away",
      competition: "League",
      status: "Scheduled",
    },
    {
      id: 5,
      opponent: "Wuhan FC",
      date: new Date(2023, 4, 8),
      time: "19:30",
      location: "Home Stadium",
      venue: "Home",
      competition: "League",
      status: "Scheduled",
    },
    {
      id: 6,
      opponent: "Xi'an FC",
      date: new Date(2023, 4, 15),
      time: "15:00",
      location: "Xi'an Stadium",
      venue: "Away",
      competition: "Cup",
      status: "Scheduled",
    },
    {
      id: 7,
      opponent: "Tianjin FC",
      date: new Date(2023, 4, 22),
      time: "19:30",
      location: "Home Stadium",
      venue: "Home",
      competition: "League",
      status: "Scheduled",
    },
    {
      id: 8,
      opponent: "Dalian FC",
      date: new Date(2023, 4, 29),
      time: "15:00",
      location: "Dalian Stadium",
      venue: "Away",
      competition: "League",
      status: "Scheduled",
    },
  ]

  // Filter matches based on selected competition
  const filteredMatches =
    competitionFilter === "all" ? matchData : matchData.filter((match) => match.competition === competitionFilter)

  // Get matches for the selected date
  const getMatchesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    return filteredMatches.filter(
      (match) =>
        match.date.getDate() === selectedDate.getDate() &&
        match.date.getMonth() === selectedDate.getMonth() &&
        match.date.getFullYear() === selectedDate.getFullYear(),
    )
  }

  const selectedDateMatches = getMatchesForDate(date)

  // Get all match dates for the calendar
  const matchDates = filteredMatches.map((match) => match.date)

  // Handle month navigation
  const handlePreviousMonth = () => {
    const previousMonth = new Date(month)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    setMonth(previousMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(month)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setMonth(nextMonth)
  }

  // Handle match selection for quick view
  const handleMatchClick = (match: any) => {
    setSelectedMatch(match)
    setIsQuickViewOpen(true)
  }

  // Get the month and year string
  const monthYearString = month.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Get result badge variant
  const getResultBadgeVariant = (result?: string) => {
    if (!result) return "outline"
    if (result.startsWith("Win")) return "default"
    if (result.startsWith("Loss")) return "destructive"
    return "outline" // Draw
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">{monthYearString}</h3>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitions</SelectItem>
              <SelectItem value="League">League</SelectItem>
              <SelectItem value="Cup">Cup</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
              modifiers={{
                match: matchDates,
              }}
              modifiersStyles={{
                match: {
                  backgroundColor: "#ef4444",
                  color: "white",
                  borderRadius: "9999px",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">
              {date ? (
                <>Matches on {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
              ) : (
                "Select a date"
              )}
            </h4>

            {date && selectedDateMatches.length > 0 ? (
              <div className="space-y-3">
                {selectedDateMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => handleMatchClick(match)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{match.competition}</Badge>
                        <span className="font-medium">vs {match.opponent}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {match.time} • {match.venue} • {match.location}
                      </div>
                    </div>
                    {match.result ? (
                      <Badge variant={getResultBadgeVariant(match.result)}>{match.result}</Badge>
                    ) : (
                      <Badge variant="outline">Upcoming</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {date ? "No matches scheduled for this date" : "Please select a date to view matches"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
            <DialogDescription>View match details and statistics</DialogDescription>
          </DialogHeader>
          {selectedMatch && <MatchQuickView match={selectedMatch} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
