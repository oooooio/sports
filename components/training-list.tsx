import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { TrainingSessionWithAttendance } from "@/services/training"

interface TrainingListProps {
  trainingSessions?: TrainingSessionWithAttendance[]
  loading?: boolean
}

export function TrainingList({ trainingSessions = [], loading = false }: TrainingListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }
 
  if (trainingSessions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">No training records</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attendance Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainingSessions.map((training) => (
          <TableRow key={training.id}>
            <TableCell className="font-medium">
              <Link href={`/dashboard/training/${training.id}`} className="hover:underline">
                {training.title}
              </Link>
            </TableCell>
            <TableCell>{new Date(training.start_time).toLocaleDateString()}</TableCell>
            <TableCell>
              {new Date(training.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {new Date(training.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </TableCell>
            <TableCell>{training.location}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {training.type === "regular"
                  ? "Regular"
                  : training.type === "fitness"
                    ? "Fitness"
                    : training.type === "tactical"
                      ? "Tactical"
                      : training.type === "recovery"
                        ? "Recovery"
                        : "Other"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  training.status === "completed"
                    ? "success"
                    : training.status === "cancelled"
                      ? "destructive"
                      : "default"
                }
              >
                {training.status === "completed" ? "Completed" : training.status === "cancelled" ? "Cancelled" : "Planned"}
              </Badge>
            </TableCell>
            <TableCell>
              {training.total_members
                ? (((training.attendance_count || 0) / training.total_members) * 100).toFixed(0)
                : 0}
              % ({training.attendance_count || 0}/{training.total_members || 0})
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
