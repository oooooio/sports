"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Printer, Share, Trash2, User, Users } from "lucide-react"
import Link from "next/link"
import { TrainingAttendance } from "@/components/training-attendance"
import { TrainingExercises } from "@/components/training-exercises"
import { TrainingNotes } from "@/components/training-notes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TrainingDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = () => {
    setIsDeleting(true)

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      toast({
        title: "Training Deleted",
        description: `${training.title} has been deleted successfully.`,
      })
      router.push("/dashboard/training")
    }, 1500)
  }

  const handlePrint = () => {
    toast({
      title: "Printing Training Details",
      description: "The training details are being sent to the printer.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Training Shared",
      description: "The training details have been shared with the team.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/training">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Training Details</h1>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>Share with Team</DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/dashboard/training/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this training session and all associated
                  data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Training Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">{training.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
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

            <div className="space-y-3 pt-2">
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
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{training.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{training.description}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Objectives</h3>
              <p className="text-sm text-muted-foreground">{training.objectives}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Equipment</h3>
              <p className="text-sm text-muted-foreground">{training.equipment}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="attendance" className="p-4">
                <TrainingAttendance trainingId={training.id} />
              </TabsContent>
              <TabsContent value="exercises" className="p-4">
                <TrainingExercises trainingId={training.id} />
              </TabsContent>
              <TabsContent value="notes" className="p-4">
                <TrainingNotes trainingId={training.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
