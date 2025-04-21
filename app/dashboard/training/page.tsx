"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, FileText, PlusCircle } from "lucide-react"
import { TrainingCalendar } from "@/components/training-calendar"
import { TrainingList } from "@/components/training-list"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { fetchTrainingSessions, fetchTrainingStatistics } from "./actions"
import type { TrainingSessionWithAttendance } from "@/services/training"

export default function TrainingPage() {
  const { toast } = useToast()
  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionWithAttendance[]>([])
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
    attendanceRate: 0,
  })
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [sessions, stats] = await Promise.all([fetchTrainingSessions(), fetchTrainingStatistics()])
        setTrainingSessions(sessions)
        setStatistics(stats)
      } catch (error) {
        console.error("Error fetching training data:", error)
        toast({
          title: "Failed to fetch training data",
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
        <h1 className="text-3xl font-bold">Training Management</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/training/templates">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Button>
          </Link>
          <Link href="/dashboard/training/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Training Plan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.attendanceRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingCalendar trainingSessions={trainingSessions} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Training List</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainingList trainingSessions={trainingSessions} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}