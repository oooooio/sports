"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { TrainingSessionWithAttendance } from "@/services/training"

interface TrainingCalendarProps {
  trainingSessions?: TrainingSessionWithAttendance[]
  loading?: boolean
}

export function TrainingCalendar({ trainingSessions = [], loading = false }: TrainingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get training sessions for the selected date
  const trainingsOnSelectedDate = selectedDate
    ? trainingSessions.filter((training) => {
        const trainingDate = new Date(training.start_time)
        return (
          trainingDate.getDate() === selectedDate.getDate() &&
          trainingDate.getMonth() === selectedDate.getMonth() &&
          trainingDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  // Create class for calendar days
  function getDayClass(day: Date): string {
    const hasTraining = trainingSessions.some((training) => {
      const trainingDate = new Date(training.start_time)
      return (
        trainingDate.getDate() === day.getDate() &&
        trainingDate.getMonth() === day.getMonth() &&
        trainingDate.getFullYear() === day.getFullYear()
      )
    })

    return hasTraining ? "bg-primary/10 font-bold" : ""
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={{
          training: (date) => {
            return trainingSessions.some((training) => {
              const trainingDate = new Date(training.start_time)
              return (
                trainingDate.getDate() === date.getDate() &&
                trainingDate.getMonth() === date.getMonth() &&
                trainingDate.getFullYear() === date.getFullYear()
              )
            })
          },
        }}
        modifiersClassNames={{
          training: "bg-primary/10 font-bold",
        }}
        components={{
          DayContent: ({ date }) => (
            <div className={cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100", getDayClass(date))}>
              {date.getDate()}
            </div>
          ),
        }}
      />
      <div className="space-y-4">
        {trainingsOnSelectedDate.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No training sessions scheduled for this date</p>
          </div>
        ) : ( 
          trainingsOnSelectedDate.map((training) => (
            <Link href={`/dashboard/training/${training.id}`} key={training.id}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{training.title}</h3>
                    <Badge
                      variant={
                        training.status === "completed"
                          ? "success"
                          : training.status === "cancelled"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {training.status === "completed"
                        ? "Completed"
                        : training.status === "cancelled"
                          ? "Cancelled"
                          : "Scheduled"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {new Date(training.start_time).toLocaleTimeString()} -{" "}
                      {new Date(training.end_time).toLocaleTimeString()}
                    </p>
                    <p>{training.location}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span>
                        Attendance Rate:{" "}
                        {training.total_members
                          ? (((training.attendance_count || 0) / training.total_members) * 100).toFixed(0)
                          : 0}
                        %
                      </span>
                      <span className="text-xs">
                        {training.attendance_count || 0}/{training.total_members || 0} people
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
