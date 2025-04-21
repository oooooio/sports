"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface TrainingExercisesProps {
  trainingId: number
}

export function TrainingExercises({ trainingId }: TrainingExercisesProps) {
  // Mock data for exercises
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Warm-up",
      duration: 15,
      description: "Light jogging and stretching to prepare the body for training.",
      completed: true,
    },
    {
      id: 2,
      name: "Passing Drills",
      duration: 20,
      description: "Short and long passing exercises in pairs and small groups.",
      completed: true,
    },
    {
      id: 3,
      name: "Possession Game",
      duration: 25,
      description: "5v2 rondo exercises focusing on ball retention and movement.",
      completed: true,
    },
    {
      id: 4,
      name: "Tactical Positioning",
      duration: 30,
      description: "Team shape and positioning drills for defensive and offensive scenarios.",
      completed: false,
    },
    {
      id: 5,
      name: "Small-Sided Game",
      duration: 20,
      description: "4v4 games with specific tactical objectives.",
      completed: false,
    },
    {
      id: 6,
      name: "Cool Down",
      duration: 10,
      description: "Light jogging and stretching to aid recovery.",
      completed: false,
    },
  ])

  // Calculate total duration and progress
  const totalDuration = exercises.reduce((total, exercise) => total + exercise.duration, 0)
  const completedDuration = exercises
    .filter((exercise) => exercise.completed)
    .reduce((total, exercise) => total + exercise.duration, 0)
  const progressPercentage = Math.round((completedDuration / totalDuration) * 100)

  // Toggle exercise completion
  const toggleExerciseCompletion = (id: number) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-medium">Training Progress</h3>
          <p className="text-sm text-muted-foreground">
            {completedDuration} of {totalDuration} minutes completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={progressPercentage} className="w-24" />
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <Card
            key={exercise.id}
            className={`cursor-pointer transition-colors ${exercise.completed ? "bg-muted/50" : ""}`}
            onClick={() => toggleExerciseCompletion(exercise.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </span>
                    <h4 className={`font-medium ${exercise.completed ? "line-through opacity-70" : ""}`}>
                      {exercise.name}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{exercise.duration} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                  {exercise.completed && <div className="h-3 w-3 rounded-full bg-primary" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
