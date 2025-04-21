"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Trophy, User } from "lucide-react"
import Link from "next/link"
import { MatchLineup } from "@/components/match-lineup"
import { MatchEvents } from "@/components/match-events"
import { MatchStats } from "@/components/match-stats"

interface MatchQuickViewProps {
  match: any
}

export function MatchQuickView({ match }: MatchQuickViewProps) {
  // Get result badge variant
  const getResultBadgeVariant = (result?: string) => {
    if (!result) return "outline"
    if (result.startsWith("Win")) return "default"
    if (result.startsWith("Loss")) return "destructive"
    return "outline" // Draw
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold">vs {match.opponent}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="secondary">{match.competition}</Badge>
            {match.result ? (
              <Badge variant={getResultBadgeVariant(match.result)}>{match.result}</Badge>
            ) : (
              <Badge variant="outline">Upcoming</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {match.result ? (
            <Link href={`/dashboard/matches/${match.id}/report`}>
              <Button variant="outline" size="sm">
                Match Report
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/matches/${match.id}`}>
              <Button size="sm">Manage Lineup</Button>
            </Link>
          )}
          <Link href={`/dashboard/matches/${match.id}`}>
            <Button size="sm">View Full Details</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{match.location}</span>
        </div>
      </div>

      <Tabs defaultValue={match.result ? "events" : "lineup"}>
        <TabsList className="grid w-full grid-cols-3">
          {match.result ? (
            <TabsTrigger value="events">Events</TabsTrigger>
          ) : (
            <TabsTrigger value="lineup">Lineup</TabsTrigger>
          )}
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        {match.result ? (
          <TabsContent value="events">
            <Card>
              <CardContent className="pt-6">
                <MatchEvents match={match} />
              </CardContent>
            </Card>
          </TabsContent>
        ) : (
          <TabsContent value="lineup">
            <Card>
              <CardContent className="pt-6">
                <MatchLineup matchId={match.id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="stats">
          <Card>
            <CardContent className="pt-6">
              <MatchStats matchId={match.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="font-medium">Pre-match Notes</h4>
                <p className="text-sm text-muted-foreground">
                  {match.result
                    ? "The team prepared well for this match with a focus on defensive organization and quick transitions."
                    : "The team is preparing for this match with a focus on defensive organization and quick transitions."}
                </p>
                {match.result && (
                  <>
                    <h4 className="font-medium mt-4">Post-match Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      {match.result.startsWith("Win")
                        ? "The team performed well, showing good tactical discipline and taking their chances efficiently."
                        : match.result.startsWith("Loss")
                          ? "The team struggled to create clear chances and needs to improve defensive transitions."
                          : "The team showed good resilience but needs to be more clinical in front of goal."}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
