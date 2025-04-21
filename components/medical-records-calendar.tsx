"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MedicalRecordDetail } from "@/components/medical-record-detail"

// Mock data for medical records with dates
const mockMedicalRecords = [
  {
    id: "1",
    memberName: "Zhang San",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Ankle Sprain",
    date: "2023-10-15",
    status: "active",
    severity: "Moderate",
    estimatedRecovery: "2-3 weeks",
    type: "injury",
  },
  {
    id: "2",
    memberName: "Li Si",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Muscle Strain",
    date: "2023-10-10",
    status: "recovered",
    severity: "Mild",
    estimatedRecovery: "1 week",
    type: "injury",
  },
  {
    id: "3",
    memberName: "Wang Wu",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Knee Ligament Injury",
    date: "2023-10-05",
    status: "active",
    severity: "Severe",
    estimatedRecovery: "8-12 weeks",
    type: "injury",
  },
  {
    id: "4",
    memberName: "Zhao Liu",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Shoulder Dislocation",
    date: "2023-09-28",
    status: "pending",
    severity: "Pending Evaluation",
    estimatedRecovery: "Pending Evaluation",
    type: "injury",
  },
  {
    id: "5",
    memberName: "Qian Qi",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Lower Back Strain",
    date: "2023-09-20",
    status: "recovered",
    severity: "Moderate",
    estimatedRecovery: "3 weeks",
    type: "injury",
  },
  {
    id: "6",
    memberName: "Zhang San",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Follow-up",
    date: "2023-10-20",
    status: "appointment",
    severity: "N/A",
    estimatedRecovery: "N/A",
    type: "appointment",
  },
  {
    id: "7",
    memberName: "Wang Wu",
    memberAvatar: "/placeholder.svg?height=40&width=40",
    injuryType: "Rehabilitation Training",
    date: "2023-10-12",
    status: "appointment",
    severity: "N/A",
    estimatedRecovery: "N/A",
    type: "appointment",
  },
]
 
export function MedicalRecordsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // Group records by date for the calendar
  const recordsByDate = mockMedicalRecords.reduce((acc: Record<string, any[]>, record) => {
    if (!acc[record.date]) {
      acc[record.date] = []
    }
    acc[record.date].push(record)
    return acc
  }, {})

  // Function to highlight dates with records
  const isDayWithRecord = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    return !!recordsByDate[dateString]
  }

  // Handle date selection
  const handleSelect = (day: Date | undefined) => {
    setDate(day)
    if (day) {
      const dateString = day.toISOString().split("T")[0]
      setSelectedRecords(recordsByDate[dateString] || [])
    } else {
      setSelectedRecords([])
    }
  }

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
          modifiers={{
            withRecords: (date) => isDayWithRecord(date),
          }}
          modifiersClassNames={{
            withRecords: "bg-primary/10 font-bold text-primary",
          }}
        />
      </div>
      <div className="md:w-1/2">
        <h3 className="text-lg font-medium mb-4">
          {date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Select a date"}{" "}
          Records
        </h3>
        {selectedRecords.length === 0 ? (
          <p className="text-muted-foreground">No medical records for this date</p>
        ) : (
          <div className="space-y-4">
            {selectedRecords.map((record) => (
              <Card
                key={record.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewDetail(record)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={record.memberAvatar || "/placeholder.svg"}
                        alt={record.memberName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{record.memberName}</p>
                        <p className="text-sm text-muted-foreground">{record.injuryType}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.type === "appointment"
                          ? "outline"
                          : record.status === "active"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {record.type === "appointment" ? "Appointment" : record.status === "active" ? "Injury" : "Recovered"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>View detailed medical records and recovery progress</DialogDescription>
          </DialogHeader>
          {selectedRecord && <MedicalRecordDetail record={selectedRecord} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
