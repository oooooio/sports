"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"
import { useAuth } from "@/contexts/auth-context"
import { PERMISSIONS } from "@/lib/mock-users"

export default function Dashboard() {
  const { user, hasPermission } = useAuth()

  if (!user) return null

  const getRoleWelcomeMessage = () => {
    switch (user.role) {
      case "admin":
        return "Welcome back, Administrator"
      case "coach":
        return "Welcome back, Coach"
      case "medical":
        return "Welcome back, Medical Staff"
      case "player":
        return "Welcome back, Player"
      case "parent":
        return "Welcome back, Parent"
      default:
        return "Welcome back"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        {getRoleWelcomeMessage()}, {user.name}
      </p>

      {/* Only specific roles can see statistics */}
      {(hasPermission(PERMISSIONS.VIEW_MEMBERS) ||
        hasPermission(PERMISSIONS.VIEW_TRAINING) ||
        hasPermission(PERMISSIONS.VIEW_MATCHES)) && <DashboardStats />}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Only users with training view permission can see training activities */}
        {hasPermission(PERMISSIONS.VIEW_TRAINING) && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Training</CardTitle>
              <CardDescription>Training activities in the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities type="training" />
            </CardContent>
          </Card>
        )}

        {/* Only users with match view permission can see match records */}
        {hasPermission(PERMISSIONS.VIEW_MATCHES) && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardDescription>Match records in the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities type="match" />
            </CardContent>
          </Card>
        )}

        {/* If the user is a player, show personal training and match data */}
        {user.role === "player" && (
          <Card>
            <CardHeader>
              <CardTitle>My Performance</CardTitle>
              <CardDescription>Your recent performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[90%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Skill Improvement</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[75%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Physical Condition</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* If the user is a parent, show the child's training and match data */}
        {user.role === "parent" && (
          <Card>
            <CardHeader>
              <CardTitle>Child's Performance</CardTitle>
              <CardDescription>Your child's recent performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Skill Improvement</span>
                    <span className="text-sm text-muted-foreground">70%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[70%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Coach Evaluation</span>
                    <span className="text-sm text-muted-foreground">Good</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
