"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, FileEdit, Trash2, Eye } from "lucide-react"
import { MedicalRecordDetail } from "@/components/medical-record-detail"

// Mock data for medical records
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
    severity: "Pending Assessment",
    estimatedRecovery: "Pending Assessment",
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

interface MedicalRecordsListProps {
  searchQuery: string
  statusFilter: string
}

export function MedicalRecordsList({ searchQuery, statusFilter }: MedicalRecordsListProps) {
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
            Pending Assessment
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Injury Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Est. Recovery Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No medical records found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <img
                      src={record.memberAvatar || "/placeholder.svg"}
                      alt={record.memberName}
                      className="w-8 h-8 rounded-full"
                    />
                    {record.memberName}
                  </div>
                </TableCell>
                <TableCell>{record.injuryType}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>{record.severity}</TableCell>
                <TableCell>{record.estimatedRecovery}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetail(record)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit Record
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
 
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>View detailed medical record and recovery progress</DialogDescription>
          </DialogHeader>
          {selectedRecord && <MedicalRecordDetail record={selectedRecord} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
