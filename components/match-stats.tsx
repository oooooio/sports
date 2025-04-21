"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchStatsProps {
  matchId: number
}

export function MatchStats({ matchId }: MatchStatsProps) {
  const [viewType, setViewType] = useState("team")

  // Mock data for match statistics
  const teamStats = {
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
    tackles: { home: 18, away: 22 },
    clearances: { home: 15, away: 24 },
  }

  // Mock data for player statistics
  const playerStats = [
    {
      id: 1,
      name: "John Smith",
      position: "Forward",
      minutes: 90,
      goals: 1,
      assists: 1,
      shots: 4,
      shotsOnTarget: 3,
      passes: 35,
      passAccuracy: 82,
      tackles: 2,
      interceptions: 1,
      fouls: 2,
      rating: 8.5,
    },
    {
      id: 2,
      name: "Michael Johnson",
      position: "Midfielder",
      minutes: 90,
      goals: 1,
      assists: 0,
      shots: 3,
      shotsOnTarget: 2,
      passes: 65,
      passAccuracy: 90,
      tackles: 4,
      interceptions: 3,
      fouls: 1,
      rating: 8.2,
    },
    {
      id: 3,
      name: "David Williams",
      position: "Defender",
      minutes: 90,
      goals: 1,
      assists: 0,
      shots: 1,
      shotsOnTarget: 1,
      passes: 58,
      passAccuracy: 88,
      tackles: 5,
      interceptions: 4,
      fouls: 2,
      rating: 7.8,
    },
    {
      id: 4,
      name: "James Brown",
      position: "Goalkeeper",
      minutes: 90,
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      passes: 25,
      passAccuracy: 84,
      tackles: 0,
      interceptions: 0,
      fouls: 0,
      rating: 7.5,
    },
    {
      id: 5,
      name: "Robert Davis",
      position: "Midfielder",
      minutes: 90,
      goals: 0,
      assists: 1,
      shots: 2,
      shotsOnTarget: 0,
      passes: 72,
      passAccuracy: 92,
      tackles: 3,
      interceptions: 2,
      fouls: 1,
      rating: 7.9,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Match Statistics</h3>
        <Select value={viewType} onValueChange={setViewType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Team Stats</SelectItem>
            <SelectItem value="player">Player Stats</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewType === "team" ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Possession</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{teamStats.possession.home}%</span>
                    <span className="text-sm text-muted-foreground">-</span>
                    <span className="text-sm">{teamStats.possession.away}%</span>
                  </div>
                </div>
                <div className="flex w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary" style={{ width: `${teamStats.possession.home}%` }}></div>
                  <div className="bg-destructive" style={{ width: `${teamStats.possession.away}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Attacking</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Shots</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.shots.home}</span>
                        <span className="text-sm font-medium">{teamStats.shots.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={(teamStats.shots.home / (teamStats.shots.home + teamStats.shots.away)) * 100}
                        className="h-2"
                      />
                      <Progress
                        value={(teamStats.shots.away / (teamStats.shots.home + teamStats.shots.away)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Shots on Target</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.shotsOnTarget.home}</span>
                        <span className="text-sm font-medium">{teamStats.shotsOnTarget.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={
                          (teamStats.shotsOnTarget.home /
                            (teamStats.shotsOnTarget.home + teamStats.shotsOnTarget.away)) *
                          100
                        }
                        className="h-2"
                      />
                      <Progress
                        value={
                          (teamStats.shotsOnTarget.away /
                            (teamStats.shotsOnTarget.home + teamStats.shotsOnTarget.away)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Corners</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.corners.home}</span>
                        <span className="text-sm font-medium">{teamStats.corners.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={(teamStats.corners.home / (teamStats.corners.home + teamStats.corners.away)) * 100}
                        className="h-2"
                      />
                      <Progress
                        value={(teamStats.corners.away / (teamStats.corners.home + teamStats.corners.away)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Offsides</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.offsides.home}</span>
                        <span className="text-sm font-medium">{teamStats.offsides.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={
                          (teamStats.offsides.home / (teamStats.offsides.home + teamStats.offsides.away || 1)) * 100
                        }
                        className="h-2"
                      />
                      <Progress
                        value={
                          (teamStats.offsides.away / (teamStats.offsides.home + teamStats.offsides.away || 1)) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Defending</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tackles</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.tackles.home}</span>
                        <span className="text-sm font-medium">{teamStats.tackles.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={(teamStats.tackles.home / (teamStats.tackles.home + teamStats.tackles.away)) * 100}
                        className="h-2"
                      />
                      <Progress
                        value={(teamStats.tackles.away / (teamStats.tackles.home + teamStats.tackles.away)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Clearances</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.clearances.home}</span>
                        <span className="text-sm font-medium">{teamStats.clearances.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={
                          (teamStats.clearances.home / (teamStats.clearances.home + teamStats.clearances.away)) * 100
                        }
                        className="h-2"
                      />
                      <Progress
                        value={
                          (teamStats.clearances.away / (teamStats.clearances.home + teamStats.clearances.away)) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Fouls</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.fouls.home}</span>
                        <span className="text-sm font-medium">{teamStats.fouls.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={(teamStats.fouls.home / (teamStats.fouls.home + teamStats.fouls.away)) * 100}
                        className="h-2"
                      />
                      <Progress
                        value={(teamStats.fouls.away / (teamStats.fouls.home + teamStats.fouls.away)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Yellow Cards</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{teamStats.yellowCards.home}</span>
                        <span className="text-sm font-medium">{teamStats.yellowCards.away}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress
                        value={
                          (teamStats.yellowCards.home /
                            (teamStats.yellowCards.home + teamStats.yellowCards.away || 1)) *
                          100
                        }
                        className="h-2"
                      />
                      <Progress
                        value={
                          (teamStats.yellowCards.away /
                            (teamStats.yellowCards.home + teamStats.yellowCards.away || 1)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Passing</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Total Passes</span>
                    <div className="flex gap-4">
                      <span className="text-sm font-medium">{teamStats.passes.home}</span>
                      <span className="text-sm font-medium">{teamStats.passes.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress
                      value={(teamStats.passes.home / (teamStats.passes.home + teamStats.passes.away)) * 100}
                      className="h-2"
                    />
                    <Progress
                      value={(teamStats.passes.away / (teamStats.passes.home + teamStats.passes.away)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Pass Accuracy</span>
                    <div className="flex gap-4">
                      <span className="text-sm font-medium">{teamStats.passAccuracy.home}%</span>
                      <span className="text-sm font-medium">{teamStats.passAccuracy.away}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={teamStats.passAccuracy.home} className="h-2" />
                    <Progress value={teamStats.passAccuracy.away} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attacking">Attacking</TabsTrigger>
              <TabsTrigger value="defending">Defending</TabsTrigger>
              <TabsTrigger value="passing">Passing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="rounded-md border mt-4">
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
                    {playerStats.map((player) => (
                      <tr key={player.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{player.name}</td>
                        <td className="px-4 py-2">{player.position}</td>
                        <td className="px-4 py-2">{player.minutes}</td>
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
            </TabsContent>
            <TabsContent value="attacking">
              <div className="rounded-md border mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Player</th>
                      <th className="px-4 py-2 text-left font-medium">Goals</th>
                      <th className="px-4 py-2 text-left font-medium">Assists</th>
                      <th className="px-4 py-2 text-left font-medium">Shots</th>
                      <th className="px-4 py-2 text-left font-medium">On Target</th>
                      <th className="px-4 py-2 text-left font-medium">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player) => (
                      <tr key={player.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{player.name}</td>
                        <td className="px-4 py-2">{player.goals}</td>
                        <td className="px-4 py-2">{player.assists}</td>
                        <td className="px-4 py-2">{player.shots}</td>
                        <td className="px-4 py-2">{player.shotsOnTarget}</td>
                        <td className="px-4 py-2">
                          {player.shots > 0 ? `${Math.round((player.goals / player.shots) * 100)}%` : "0%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="defending">
              <div className="rounded-md border mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Player</th>
                      <th className="px-4 py-2 text-left font-medium">Tackles</th>
                      <th className="px-4 py-2 text-left font-medium">Interceptions</th>
                      <th className="px-4 py-2 text-left font-medium">Fouls</th>
                      <th className="px-4 py-2 text-left font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player) => (
                      <tr key={player.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{player.name}</td>
                        <td className="px-4 py-2">{player.tackles}</td>
                        <td className="px-4 py-2">{player.interceptions}</td>
                        <td className="px-4 py-2">{player.fouls}</td>
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
            </TabsContent>
            <TabsContent value="passing">
              <div className="rounded-md border mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Player</th>
                      <th className="px-4 py-2 text-left font-medium">Passes</th>
                      <th className="px-4 py-2 text-left font-medium">Accuracy</th>
                      <th className="px-4 py-2 text-left font-medium">Key Passes</th>
                      <th className="px-4 py-2 text-left font-medium">Assists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player) => (
                      <tr key={player.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{player.name}</td>
                        <td className="px-4 py-2">{player.passes}</td>
                        <td className="px-4 py-2">{player.passAccuracy}%</td>
                        <td className="px-4 py-2">{Math.round(player.passes * 0.05)}</td>
                        <td className="px-4 py-2">{player.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
