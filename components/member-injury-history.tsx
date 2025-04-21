"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemberInjuryHistoryProps {
  memberId: number
}

export function MemberInjuryHistory({ memberId }: MemberInjuryHistoryProps) {
  // Mock data
  const injuryData = [
    {
      id: 1,
      type: "Hamstring Strain",
      startDate: "2023-01-15",
      endDate: "2023-02-10",
      duration: "26 days",
      status: "Recovered",
      missedMatches: 5,
    },
    {
      id: 2,
      type: "Ankle Sprain",
      startDate: "2022-09-05",
      endDate: "2022-09-25",
      duration: "20 days",
      status: "Recovered",
      missedMatches: 4,
    },
    {
      id: 3,
      type: "Knee Contusion",
      startDate: "2022-04-12",
      endDate: "2022-04-22",
      duration: "10 days",
      status: "Recovered",
      missedMatches: 2,
    },
  ]

  // Calculate injury statistics
  const totalInjuries = injuryData.length
  const totalDaysMissed = injuryData.reduce((total, injury) => {
    const duration = Number.parseInt(injury.duration.split(" ")[0])
    return total + duration
  }, 0)
  const totalMatchesMissed = injuryData.reduce((total, injury) => total + injury.missedMatches, 0)
  const avgRecoveryTime = Math.round(totalDaysMissed / totalInjuries)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Injury History</h3>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{totalInjuries}</div>
          <div className="text-sm text-muted-foreground">Total Injuries</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{totalDaysMissed}</div>
          <div className="text-sm text-muted-foreground">Days Missed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{totalMatchesMissed}</div>
          <div className="text-sm text-muted-foreground">Matches Missed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{avgRecoveryTime}</div>
          <div className="text-sm text-muted-foreground">Avg. Recovery (days)</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Injury Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Injury Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Matches Missed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {injuryData.map((injury) => (
                <TableRow key={injury.id}>
                  <TableCell className="font-medium">{injury.type}</TableCell>
                  <TableCell>{injury.startDate}</TableCell>
                  <TableCell>{injury.endDate}</TableCell>
                  <TableCell>{injury.duration}</TableCell>
                  <TableCell>{injury.missedMatches}</TableCell>
                  <TableCell>
                    <Badge variant={injury.status === "Recovered" ? "default" : "destructive"}>{injury.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
