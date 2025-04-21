"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MemberPerformanceProps {
  memberId: number
}

export function MemberPerformance({ memberId }: MemberPerformanceProps) {
  const [period, setPeriod] = useState("season")
  const [chartType, setChartType] = useState("radar")

  // Mock data
  const performanceData = {
    technical: {
      passing: 85,
      shooting: 78,
      dribbling: 82,
      firstTouch: 80,
      heading: 65,
    },
    physical: {
      speed: 88,
      strength: 75,
      stamina: 90,
      agility: 82,
      jumping: 70,
    },
    tactical: {
      positioning: 85,
      gameReading: 80,
      teamwork: 88,
      decisionMaking: 75,
      offTheBall: 78,
    },
    mental: {
      concentration: 82,
      determination: 90,
      leadership: 75,
      composure: 78,
      workRate: 85,
    },
    statistics: {
      matches: 15,
      goals: 8,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 1250,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Performance Analysis</h3>
        <div className="flex space-x-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radar">Radar Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last5">Last 5 Matches</SelectItem>
              <SelectItem value="last10">Last 10 Matches</SelectItem>
              <SelectItem value="season">This Season</SelectItem>
              <SelectItem value="career">Career</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{performanceData.statistics.matches}</div>
          <div className="text-sm text-muted-foreground">Matches</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{performanceData.statistics.goals}</div>
          <div className="text-sm text-muted-foreground">Goals</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{performanceData.statistics.assists}</div>
          <div className="text-sm text-muted-foreground">Assists</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{performanceData.statistics.yellowCards}</div>
          <div className="text-sm text-muted-foreground">Yellow Cards</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {Math.round(performanceData.statistics.minutesPlayed / performanceData.statistics.matches)}
          </div>
          <div className="text-sm text-muted-foreground">Avg. Minutes</div>
        </Card>
      </div>

      <Tabs defaultValue="technical">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="tactical">Tactical</TabsTrigger>
          <TabsTrigger value="mental">Mental</TabsTrigger>
        </TabsList>
        <TabsContent value="technical">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(performanceData.technical).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="physical">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(performanceData.physical).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tactical">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(performanceData.tactical).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mental">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(performanceData.mental).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
