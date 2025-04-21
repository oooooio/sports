"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface MemberAttendanceProps {
  memberId: number
}

export function MemberAttendance({ memberId }: MemberAttendanceProps) {
  const [period, setPeriod] = useState("last3months")

  // Mock data
  const attendanceData = [
    {
      id: 1,
      date: "2023-03-15",
      type: "Training",
      title: "Basic Fitness Training",
      status: "Present",
    },
    {
      id: 2,
      date: "2023-03-12",
      type: "Match",
      title: "vs Beijing FC",
      status: "Present",
    },
    {
      id: 3,
      date: "2023-03-08",
      type: "Training",
      title: "Tactical Coordination Training",
      status: "Present",
    },
    {
      id: 4,
      date: "2023-03-05",
      type: "Match",
      title: "vs Shanghai FC",
      status: "Present",
    },
    {
      id: 5,
      date: "2023-03-01",
      type: "Training",
      title: "Shooting Skills Training",
      status: "Absent",
    },
    {
      id: 6,
      date: "2023-02-25",
      type: "Training",
      title: "Defensive Tactics Training",
      status: "Late",
    },
    {
      id: 7,
      date: "2023-02-20",
      type: "Match",
      title: "vs Guangzhou FC",
      status: "Present",
    },
  ]

  // Calculate attendance statistics
  const totalEvents = attendanceData.length
  const presentCount = attendanceData.filter((item) => item.status === "Present").length
  const absentCount = attendanceData.filter((item) => item.status === "Absent").length
  const lateCount = attendanceData.filter((item) => item.status === "Late").length
  const attendanceRate = Math.round((presentCount / totalEvents) * 100)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attendance Record</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last1month">Last Month</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
            <SelectItem value="lastyear">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{totalEvents}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{presentCount}</div>
          <div className="text-sm text-muted-foreground">Present</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{lateCount}</div>
          <div className="text-sm text-muted-foreground">Late</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{absentCount}</div>
          <div className="text-sm text-muted-foreground">Absent</div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Attendance Rate</div>
        <div className="font-medium">{attendanceRate}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "Present" ? "default" : item.status === "Absent" ? "destructive" : "outline"}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
