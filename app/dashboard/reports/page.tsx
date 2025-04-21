"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Users, Dumbbell, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PERMISSIONS } from "@/lib/mock-users"
import { MemberReports } from "@/components/reports/member-reports"
import { TrainingReports } from "@/components/reports/training-reports"
import { MatchReports } from "@/components/reports/match-reports"
import { PerformanceReports } from "@/components/reports/performance-reports"

export default function ReportsPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("members")

  // Check if the user has permission to view various reports
  const canViewMemberReports = hasPermission(PERMISSIONS.VIEW_MEMBERS)
  const canViewTrainingReports = hasPermission(PERMISSIONS.VIEW_TRAINING)
  const canViewMatchReports = hasPermission(PERMISSIONS.VIEW_MATCHES)
  const canViewPerformanceReports = hasPermission(PERMISSIONS.VIEW_SKILLS)
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Center</h1>
          <p className="text-muted-foreground">View and export various data reports</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className={`cursor-pointer ${activeTab === "members" ? "border-primary" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Available Reports</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${activeTab === "training" ? "border-primary" : ""}`}
          onClick={() => setActiveTab("training")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Reports</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Available Reports</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${activeTab === "matches" ? "border-primary" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match Reports</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Available Reports</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${activeTab === "performance" ? "border-primary" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Available Reports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" disabled={!canViewMemberReports}>
            Members
          </TabsTrigger>
          <TabsTrigger value="training" disabled={!canViewTrainingReports}>
            Training
          </TabsTrigger>
          <TabsTrigger value="matches" disabled={!canViewMatchReports}>
            Matches
          </TabsTrigger>
          <TabsTrigger value="performance" disabled={!canViewPerformanceReports}>
            Performance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-4">
          <MemberReports />
        </TabsContent>
        <TabsContent value="training" className="space-y-4">
          <TrainingReports />
        </TabsContent>
        <TabsContent value="matches" className="space-y-4">
          <MatchReports />
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <PerformanceReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}