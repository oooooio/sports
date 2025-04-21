"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Download, MapPin, Printer, Trophy, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@/components/ui/timeline"

export default function MatchReportPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  // Mock data for a match
  const match = {
    id: Number.parseInt(params.id),
    opponent: "Beijing FC",
    date: "2023-04-10",
    time: "15:00",
    location: "Home Stadium",
    venue: "Home",
    competition: "League",
    result: "Win 3-1",
    score: { home: 3, away: 1 },
    status: "Completed",
    attendance: "18,245",
    referee: "John Smith",
    weather: "Sunny, 22°C",
    teamFormation: "4-3-3",
    opponentFormation: "4-4-2",
    scorers: ["John Smith (23')", "Michael Johnson (45+2')", "David Williams (78')"],
    assisters: ["Robert Davis (23')", "Thomas Wilson (45+2')", "John Smith (78')"],
    yellowCards: ["Richard Moore (34')", "James Brown (67')"],
    redCards: [],
    notes: "Strong performance overall with good defensive organization and clinical finishing.",
  }

  // Mock data for match statistics
  const matchStats = {
    possession: { home: 58, away: 42 },
    shots: { home: 15, away: 8 },
    shotsOnTarget: { home: 7, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 10, away: 14 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 3, away: 2 },
    passes: { home: 487, away: 352 },
    passAccuracy: { home: 86, away: 78 },
  }

  // Mock data for player ratings
  const playerRatings = [
    {
      id: 1,
      name: "John Smith",
      position: "Forward",
      rating: 8.5,
      goals: 1,
      assists: 1,
      minutesPlayed: 90,
      notes: "Excellent performance with a goal and an assist. Good movement and link-up play.",
    },
    {
      id: 2,
      name: "Michael Johnson",
      position: "Midfielder",
      rating: 8.2,
      goals: 1,
      assists: 0,
      minutesPlayed: 90,
      notes: "Controlled the midfield well and scored a crucial goal before halftime.",
    },
    {
      id: 3,
      name: "David Williams",
      position: "Defender",
      rating: 7.8,
      goals: 1,
      assists: 0,
      minutesPlayed: 90,
      notes: "Solid defensively and contributed with a goal from a set piece.",
    },
    {
      id: 4,
      name: "James Brown",
      position: "Goalkeeper",
      rating: 7.5,
      goals: 0,
      assists: 0,
      minutesPlayed: 90,
      notes: "Made several important saves and distributed the ball well.",
    },
    {
      id: 5,
      name: "Robert Davis",
      position: "Midfielder",
      rating: 7.9,
      goals: 0,
      assists: 1,
      minutesPlayed: 90,
      notes: "Good passing and movement, provided an assist for the first goal.",
    },
  ]

  // Combine all events and sort by time
  const allEvents = [
    ...match.scorers.map((scorer: string) => {
      const [player, time] = scorer.split(" (")
      return {
        type: "goal",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
    ...match.yellowCards.map((card: string) => {
      const [player, time] = card.split(" (")
      return {
        type: "yellowCard",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
    ...match.redCards.map((card: string) => {
      const [player, time] = card.split(" (")
      return {
        type: "redCard",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
  ].sort((a, b) => {
    const timeA = Number.parseInt(a.time)
    const timeB = Number.parseInt(b.time)
    return timeA - timeB
  })

  // Get result badge variant
  const getResultBadgeVariant = (result?: string) => {
    if (!result) return "outline"
    if (result.startsWith("Win")) return "default"
    if (result.startsWith("Loss")) return "destructive"
    return "outline" // Draw
  }

  // Format time string
  const formatTime = (time: string) => {
    if (time.includes("+")) {
      const [minute, added] = time.split("+")
      return `${minute}'+${added}'`
    }
    return `${time}'`
  }

  // Get icon for event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "yellowCard":
        return "🟨"
      case "redCard":
        return "🟥"
      default:
        return "•"
    }
  }

  // Get event description
  const getEventDescription = (event: any) => {
    switch (event.type) {
      case "goal":
        return `Goal scored by ${event.player}`
      case "yellowCard":
        return `Yellow card for ${event.player}`
      case "redCard":
        return `Red card for ${event.player}`
      default:
        return ""
    }
  }

  // Handle print report
  const handlePrint = () => {
    toast({
      title: "Printing Report",
      description: "The match report is being sent to the printer.",
    })
    window.print()
  }

  // Handle download report
  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "The match report is being downloaded as a PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/matches/${params.id}`}>
            <Button variant="outline" size="icon" className="print:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Match Report</h1>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-2xl">vs {match.opponent}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{match.competition}</Badge>
              <Badge variant={getResultBadgeVariant(match.result)}>{match.result}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{match.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>{match.competition}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{match.referee}</span>
            </div>
            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{match.location}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center justify-center gap-8 text-4xl font-bold">
              <div className="text-right">{match.score.home}</div>
              <div className="text-muted-foreground">-</div>
              <div className="text-left">{match.score.away}</div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-8">
              <div className="text-right">Our Team</div>
              <div className="text-left">{match.opponent}</div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Match Timeline</h3>
            <Timeline>
              {allEvents.map((event, index) => (
                <TimelineItem key={index}>
                  {index !== allEvents.length - 1 && <TimelineConnector />}
                  <TimelineHeader>
                    <TimelineIcon className="p-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                        <span>{getEventIcon(event.type)}</span>
                      </div>
                    </TimelineIcon>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatTime(event.time)}</Badge>
                      <span className="font-medium">{getEventDescription(event)}</span>
                    </div>
                  </TimelineHeader>
                  <TimelineBody className="pl-10">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{event.player.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{event.player}</span>
                    </div>
                  </TimelineBody>
                </TimelineItem>
              ))}
            </Timeline>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Match Statistics</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Possession</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{matchStats.possession.home}%</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="font-medium">{matchStats.possession.away}%</span>
                  </div>
                </div>
                <div className="flex w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary" style={{ width: `${matchStats.possession.home}%` }}></div>
                  <div className="bg-destructive" style={{ width: `${matchStats.possession.away}%` }}></div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Shots</span>
                    <div className="flex gap-4">
                      <span className="font-medium">{matchStats.shots.home}</span>
                      <span className="font-medium">{matchStats.shots.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress
                      value={(matchStats.shots.home / (matchStats.shots.home + matchStats.shots.away)) * 100}
                      className="h-2"
                    />
                    <Progress
                      value={(matchStats.shots.away / (matchStats.shots.home + matchStats.shots.away)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Shots on Target</span>
                    <div className="flex gap-4">
                      <span className="font-medium">{matchStats.shotsOnTarget.home}</span>
                      <span className="font-medium">{matchStats.shotsOnTarget.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress
                      value={
                        (matchStats.shotsOnTarget.home /
                          (matchStats.shotsOnTarget.home + matchStats.shotsOnTarget.away)) *
                        100
                      }
                      className="h-2"
                    />
                    <Progress
                      value={
                        (matchStats.shotsOnTarget.away /
                          (matchStats.shotsOnTarget.home + matchStats.shotsOnTarget.away)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Corners</span>
                    <div className="flex gap-4">
                      <span className="font-medium">{matchStats.corners.home}</span>
                      <span className="font-medium">{matchStats.corners.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress
                      value={(matchStats.corners.home / (matchStats.corners.home + matchStats.corners.away)) * 100}
                      className="h-2"
                    />
                    <Progress
                      value={(matchStats.corners.away / (matchStats.corners.home + matchStats.corners.away)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Fouls</span>
                    <div className="flex gap-4">
                      <span className="font-medium">{matchStats.fouls.home}</span>
                      <span className="font-medium">{matchStats.fouls.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress
                      value={(matchStats.fouls.home / (matchStats.fouls.home + matchStats.fouls.away)) * 100}
                      className="h-2"
                    />
                    <Progress
                      value={(matchStats.fouls.away / (matchStats.fouls.home + matchStats.fouls.away)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Player Ratings</h3>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium">Player</th>
                    <th className="px-4 py-2 text-left font-medium">Position</th>
                    <th className="px-4 py-2 text-left font-medium">Minutes</th>
                    <th className="px-4 py-2 text-left font-medium">Goals</th>
                    <th className="px-4 py-2 text-left font-medium">Assists</th>
                    <th className="px-4 py-2 text-left font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {playerRatings.map((player) => (
                    <tr key={player.id} className="border-b">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{player.position}</td>
                      <td className="px-4 py-2">{player.minutesPlayed}</td>
                      <td className="px-4 py-2">{player.goals}</td>
                      <td className="px-4 py-2">{player.assists}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <span className="font-medium">{player.rating}</span>
                          <span className="text-muted-foreground">/10</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Coach's Summary</h3>
            <p className="text-muted-foreground">
              Overall, this was a strong performance from the team. We controlled the game well with good possession and
              created numerous scoring opportunities. The defensive organization was solid, limiting the opponent to few
              clear chances. The team showed good character to maintain the lead and add to it in the second half. Areas
              for improvement include being more clinical in front of goal and maintaining concentration during
              transitions. Special mention to John Smith and Michael Johnson for their excellent performances.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
