"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Download, MapPin, Printer, User, Users } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function TrainingReportPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  // Mock data for a training session
  const training = {
    id: Number.parseInt(params.id),
    title: "Tactical Coordination Training",
    date: "2023-03-26",
    startTime: "15:00",
    endTime: "17:00",
    coach: "Coach Wang",
    team: "First Team",
    status: "Completed",
    type: "Tactical",
    location: "Main Field",
    attendance: "20/20",
    description:
      "Focus on team shape, defensive organization, and transition play. Emphasis on maintaining compact defensive structure and quick transitions to attack.",
    objectives: "Improve defensive organization, practice quick transitions, enhance team coordination",
    equipment: "Cones, bibs, balls, mini goals",
  }

  // Mock data for attendance
  const attendanceData = {
    total: 20,
    present: 18,
    late: 2,
    absent: 0,
    rate: 100,
  }

  // Mock data for exercises
  const exercises = [
    {
      name: "Warm-up",
      duration: 15,
      completed: true,
    },
    {
      name: "Passing Drills",
      duration: 20,
      completed: true,
    },
    {
      name: "Possession Game",
      duration: 25,
      completed: true,
    },
    {
      name: "Tactical Positioning",
      duration: 30,
      completed: true,
    },
    {
      name: "Small-Sided Game",
      duration: 20,
      completed: true,
    },
    {
      name: "Cool Down",
      duration: 10,
      completed: true,
    },
  ]

  // Mock data for player performance
  const playerPerformance = [
    {
      id: 1,
      name: "John Smith",
      position: "Forward",
      rating: 4.5,
      notes: "Excellent movement and finishing",
    },
    {
      id: 2,
      name: "Michael Johnson",
      position: "Midfielder",
      rating: 4.0,
      notes: "Good passing and positioning",
    },
    {
      id: 3,
      name: "David Williams",
      position: "Defender",
      rating: 3.5,
      notes: "Solid defensively, needs work on distribution",
    },
    {
      id: 4,
      name: "James Brown",
      position: "Goalkeeper",
      rating: 4.0,
      notes: "Good shot stopping and communication",
    },
    {
      id: 5,
      name: "Robert Davis",
      position: "Midfielder",
      rating: 3.0,
      notes: "Average performance, needs to improve decision making",
    },
  ]

  // Get training type badge color
  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "Fitness":
        return "bg-blue-500"
      case "Tactical":
        return "bg-purple-500"
      case "Technical":
        return "bg-green-500"
      case "Recovery":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle print report
  const handlePrint = () => {
    toast({
      title: "Printing Report",
      description: "The training report is being sent to the printer.",
    })
    window.print()
  }

  // Handle download report
  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "The training report is being downloaded as a PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/training/${params.id}`}>
            <Button variant="outline" size="icon" className="print:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Training Report</h1>
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
            <CardTitle className="text-2xl">{training.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getTrainingTypeColor(training.type)} variant="secondary">
                {training.type}
              </Badge>
              <Badge variant={training.status === "Completed" ? "default" : "outline"}>{training.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{training.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {training.startTime} - {training.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{training.coach}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{training.team}</span>
            </div>
            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{training.location}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{training.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Objectives</h3>
            <p className="text-muted-foreground">{training.objectives}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Attendance Summary</h3>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">{attendanceData.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{attendanceData.present}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">{attendanceData.late}</div>
                <div className="text-sm text-muted-foreground">Late</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{attendanceData.absent}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </Card>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm">Attendance Rate</div>
                <div className="text-sm font-medium">{attendanceData.rate}%</div>
              </div>
              <Progress value={attendanceData.rate} className="h-2" />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Exercises Completed</h3>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <span>{exercise.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{exercise.duration} min</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Player Performance</h3>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium">Player</th>
                    <th className="px-4 py-2 text-left font-medium">Position</th>
                    <th className="px-4 py-2 text-left font-medium">Rating</th>
                    <th className="px-4 py-2 text-left font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {playerPerformance.map((player) => (
                    <tr key={player.id} className="border-b">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{player.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{player.position}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <span className="font-medium">{player.rating}</span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{player.notes}</td>
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
              Overall, this was a productive training session with good engagement from all players. The team showed
              improvement in defensive organization and transition play. The small-sided games were particularly
              effective in reinforcing the tactical concepts. Areas to focus on in future sessions include quicker
              decision-making in the final third and maintaining defensive shape during sustained pressure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
