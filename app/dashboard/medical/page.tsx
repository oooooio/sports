"use client"

import { useState } from "react"
import { Search, Filter, Plus, Calendar, List, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicalRecordsList } from "@/components/medical-records-list"
import { MedicalRecordsGrid } from "@/components/medical-records-grid"
import { MedicalRecordsCalendar } from "@/components/medical-records-calendar"
import { MedicalStats } from "@/components/medical-stats"
import Link from "next/link"

// Mock data for medical records
const mockMedicalStats = {
  totalRecords: 124,
  activeInjuries: 8,
  recoveredThisMonth: 12,
  pendingAssessments: 5,
}

export default function MedicalDashboard() {
  const [view, setView] = useState<"list" | "grid" | "calendar">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">Manage team members' medical records, injuries, and recovery progress</p>
        </div>
        <Link href="/dashboard/medical/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Medical Record
          </Button>
        </Link>
      </div>

      <MedicalStats data={mockMedicalStats} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search members or records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">In Treatment</SelectItem>
              <SelectItem value="recovered">Recovered</SelectItem>
              <SelectItem value="pending">Pending Assessment</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" onClick={() => setView("list")}>
              <List className="mr-2 h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="grid" onClick={() => setView("grid")}>
              <Grid3X3 className="mr-2 h-4 w-4" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="calendar" onClick={() => setView("calendar")}>
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records List</CardTitle>
              <CardDescription>View and manage all team members' medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalRecordsList searchQuery={searchQuery} statusFilter={statusFilter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid" className="mt-6">
          <MedicalRecordsGrid searchQuery={searchQuery} statusFilter={statusFilter} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records Calendar</CardTitle>
              <CardDescription>View medical records and appointments by date</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalRecordsCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
