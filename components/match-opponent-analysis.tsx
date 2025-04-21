"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MatchOpponentAnalysisProps {
  matchId: number
}

export function MatchOpponentAnalysis({ matchId }: MatchOpponentAnalysisProps) {
  // Mock data for opponent analysis
  const opponentData = {
    name: "Beijing FC",
    formation: "4-4-2",
    coach: "Zhang Wei",
    recentForm: ["W", "W", "L", "D", "W"],
    keyPlayers: [
      {
        id: 1,
        name: "Li Wei",
        position: "Forward",
        number: 9,
        strengths: ["Finishing", "Heading", "Movement"],
        weaknesses: ["Defensive contribution", "Work rate"],
        stats: {
          matches: 15,
          goals: 12,
          assists: 4,
          yellowCards: 3,
          redCards: 0,
        },
      },
      {
        id: 2,
        name: "Wang Chen",
        position: "Midfielder",
        number: 8,
        strengths: ["Passing", "Vision", "Set pieces"],
        weaknesses: ["Tackling", "Pace"],
        stats: {
          matches: 16,
          goals: 5,
          assists: 10,
          yellowCards: 4,
          redCards: 0,
        },
      },
      {
        id: 3,
        name: "Zhang Min",
        position: "Defender",
        number: 4,
        strengths: ["Tackling", "Positioning", "Leadership"],
        weaknesses: ["Pace", "Aerial duels"],
        stats: {
          matches: 14,
          goals: 1,
          assists: 0,
          yellowCards: 5,
          redCards: 1,
        },
      },
    ],
    playingStyle: {
      attack: "Counter-attacking with quick transitions",
      defense: "Compact defensive block with organized pressing",
      strengths: ["Set pieces", "Counter-attacks", "Wide play"],
      weaknesses: ["High defensive line", "Vulnerability to quick transitions", "Defending crosses"],
    },
    recentMatches: [
      {
        opponent: "Shanghai FC",
        result: "Win 2-1",
        date: "2023-04-03",
      },
      {
        opponent: "Guangzhou FC",
        result: "Win 3-0",
        date: "2023-03-27",
      },
      {
        opponent: "Wuhan FC",
        result: "Loss 0-2",
        date: "2023-03-20",
      },
      {
        opponent: "Tianjin FC",
        result: "Draw 1-1",
        date: "2023-03-13",
      },
      {
        opponent: "Chongqing FC",
        result: "Win 2-0",
        date: "2023-03-06",
      },
    ],
  }

  // Get form badge color
  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500"
      case "D":
        return "bg-yellow-500"
      case "L":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Opponent Analysis: {opponentData.name}</h3>
        <div className="flex items-center gap-1">
          {opponentData.recentForm.map((result, index) => (
            <Badge key={index} className={getFormBadgeColor(result)} variant="secondary">
              {result}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keyPlayers">Key Players</TabsTrigger>
          <TabsTrigger value="tactics">Tactics</TabsTrigger>
          <TabsTrigger value="recentMatches">Recent Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Team Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Coach:</span>
                      <span>{opponentData.coach}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Formation:</span>
                      <span>{opponentData.formation}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Recent Form:</span>
                      <div className="flex items-center gap-1">
                        {opponentData.recentForm.map((result, index) => (
                          <Badge key={index} className={getFormBadgeColor(result)} variant="secondary">
                            {result}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Playing Style</h4>
                  <div className="space-y-1 text-sm">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Attack:</span>
                      <span>{opponentData.playingStyle.attack}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Defense:</span>
                      <span>{opponentData.playingStyle.defense}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Strengths</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {opponentData.playingStyle.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Weaknesses</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {opponentData.playingStyle.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="keyPlayers">
          <div className="space-y-4">
            {opponentData.keyPlayers.map((player) => (
              <Card key={player.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{player.number}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{player.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {player.position} • #{player.number}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="text-sm">
                        <span className="font-medium">{player.stats.matches}</span> matches
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{player.stats.goals}</span> goals
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{player.stats.assists}</span> assists
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Strengths</h5>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {player.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Weaknesses</h5>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {player.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tactics">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Formation: {opponentData.formation}</h4>
                <div className="aspect-[3/4] bg-green-100 dark:bg-green-900 rounded-md relative">
                  {/* This would be a visual representation of the formation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Formation visualization would appear here</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Attacking Patterns</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Quick transitions from defense to attack</li>
                    <li>Utilizes width with overlapping fullbacks</li>
                    <li>Strong aerial presence on set pieces</li>
                    <li>Central midfielders provide creative passing</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Defensive Setup</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Compact 4-4-2 block when defending</li>
                    <li>Presses aggressively in middle third</li>
                    <li>Fullbacks sometimes vulnerable to quick switches</li>
                    <li>Strong in aerial duels from crosses</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommended Approach</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Exploit space behind fullbacks with quick transitions</li>
                  <li>Press their central midfielders to disrupt build-up play</li>
                  <li>Be cautious of counter-attacks when committing players forward</li>
                  <li>Utilize quick combinations in the final third to break down their defensive block</li>
                  <li>Be alert on defensive set pieces</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recentMatches">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Opponent</th>
                  <th className="px-4 py-2 text-left font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {opponentData.recentMatches.map((match, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{match.date}</td>
                    <td className="px-4 py-2">vs {match.opponent}</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={
                          match.result.startsWith("Win")
                            ? "default"
                            : match.result.startsWith("Loss")
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {match.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
