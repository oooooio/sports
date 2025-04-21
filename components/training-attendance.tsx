"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Clock, X } from "lucide-react"

interface TrainingAttendanceProps {
  trainingId: number
}

export function TrainingAttendance({ trainingId }: TrainingAttendanceProps) {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "John Smith",
      position: "Forward",
      status: "Present",
      arrivalTime: "08:50",
      notes: "",
    },
    {
      id: 2,
      name: "Michael Johnson",
      position: "Midfielder",
      status: "Present",
      arrivalTime: "08:45",
      notes: "",
    },
    {
      id: 3,
      name: "David Williams",
      position: "Defender",
      status: "Late",
      arrivalTime: "09:15",
      notes: "Traffic delay",
    },
    {
      id: 4,
      name: "James Brown",
      position: "Goalkeeper",
      status: "Present",
      arrivalTime: "08:55",
      notes: "",
    },
    {
      id: 5,
      name: "Robert Davis",
      position: "Midfielder",
      status: "Absent",
      arrivalTime: "",
      notes: "Injured",
    },
    {
      id: 6,
      name: "Thomas Wilson",
      position: "Defender",
      status: "Present",
      arrivalTime: "08:40",
      notes: "",
    },
    {
      id: 7,
      name: "Richard Moore",
      position: "Forward",
      status: "Present",
      arrivalTime: "08:50",
      notes: "",
    },
  ])

  const [filter, setFilter] = useState("all")

  // Filter attendance data
  const filteredData = filter === "all" ? attendanceData : attendanceData.filter((item) => item.status === filter)

  // Update attendance status
  const updateStatus = (id: number, status: string) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, arrivalTime: status === "Absent" ? "" : status === "Late" ? "09:15" : "08:50" }
          : item,
      ),
    )
  }

  // Calculate attendance statistics
  const totalMembers = attendanceData.length
  const presentCount = attendanceData.filter((item) => item.status === "Present").length
  const lateCount = attendanceData.filter((item) => item.status === "Late").length
  const absentCount = attendanceData.filter((item) => item.status === "Absent").length
  const attendanceRate = Math.round(((presentCount + lateCount) / totalMembers) * 100)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Attendance Rate:</div>
          <div className="font-medium">{attendanceRate}%</div>
          <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ml-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">Filter:</div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-2">
          <div className="font-medium text-green-600 dark:text-green-400">{presentCount}</div>
          <div>Present</div>
        </div>
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-2">
          <div className="font-medium text-yellow-600 dark:text-yellow-400">{lateCount}</div>
          <div>Late</div>
        </div>
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-2">
          <div className="font-medium text-red-600 dark:text-red-400">{absentCount}</div>
          <div>Absent</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.status === "Present" ? "default" : member.status === "Late" ? "outline" : "destructive"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.arrivalTime ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{member.arrivalTime}</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{member.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant={member.status === "Present" ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateStatus(member.id, "Present")}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={member.status === "Late" ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateStatus(member.id, "Late")}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={member.status === "Absent" ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateStatus(member.id, "Absent")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
