"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileEdit, Trash2 } from "lucide-react"
import { MedicalRecordDetail } from "@/components/medical-record-detail"

// Mock data for medical records - same as in the list component
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
  },
]

interface MedicalRecordsGridProps {
  searchQuery: string
  statusFilter: string
}
 
export function MedicalRecordsGrid({ searchQuery, statusFilter }: MedicalRecordsGridProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter records based on search query and status filter
  const filteredRecords = mockMedicalRecords.filter((record) => {
    const matchesSearch =
      record.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.injuryType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Under Treatment</Badge>
      case "recovered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Recovered
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Pending Evaluation
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  return (
    <>
      {filteredRecords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No medical records found matching your criteria</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={record.memberAvatar || "/placeholder.svg"}
                      alt={record.memberName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">{record.memberName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Injury Type</p>
                    <p>{record.injuryType}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Severity</p>
                      <p>{record.severity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estimated Recovery Time</p>
                      <p>{record.estimatedRecovery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm" onClick={() => handleViewDetail(record)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>View detailed medical records and recovery progress of the team member</DialogDescription>
          </DialogHeader>
          {selectedRecord && <MedicalRecordDetail record={selectedRecord} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
