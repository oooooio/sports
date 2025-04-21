"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, User, Users } from "lucide-react"
import Link from "next/link"
import { TrainingAttendance } from "@/components/training-attendance"
import { TrainingExercises } from "@/components/training-exercises"
import { TrainingNotes } from "@/components/training-notes"

interface TrainingQuickViewProps {
  training: any
}

export function TrainingQuickView({ training }: TrainingQuickViewProps) {
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

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold">{training.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge className={getTrainingTypeColor(training.type)} variant="secondary">
              {training.type}
            </Badge>
            <Badge
              variant={
                training.status === "Completed"
                  ? "default"
                  : training.status === "Cancelled"
                    ? "destructive"
                    : "outline"
              }
            >
              {training.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/training/${training.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/training/${training.id}`}>
            <Button size="sm">View Full Details</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{training.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{training.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{training.coach}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{training.team}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{training.location}</span>
        </div>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardContent className="pt-6">
              <TrainingAttendance trainingId={training.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exercises">
          <Card>
            <CardContent className="pt-6">
              <TrainingExercises trainingId={training.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <TrainingNotes trainingId={training.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
