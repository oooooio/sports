"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Cog,
  FileText,
  Home,
  LayoutDashboard,
  LineChart,
  Medal,
  PieChart,
  ShieldAlert,
  Stethoscope,
  Trophy,
  Users,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, hasPermission } = useAuth()
  const pathname = usePathname()

  // Check if current path matches
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className={cn("pb-12 border-r min-h-screen w-56", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Sports Team Management System</h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/dashboard") && !isActive("/dashboard/") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant={isActive("/") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-1 px-2 text-sm font-semibold tracking-tight text-muted-foreground">Team Management</h2>
          <div className="space-y-1">
            {(hasPermission("MANAGE_MEMBERS") || hasPermission("VIEW_MEMBERS")) && (
              <Button
                variant={isActive("/dashboard/members") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/members">
                  <Users className="mr-2 h-4 w-4" />
                  Member Management
                </Link>
              </Button>
            )}
            {(hasPermission("MANAGE_TRAINING") || hasPermission("VIEW_TRAINING")) && (
              <Button
                variant={isActive("/dashboard/training") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/training">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Training Management
                </Link>
              </Button>
            )}
            {(hasPermission("MANAGE_MATCHES") || hasPermission("VIEW_MATCHES")) && (
              <Button
                variant={isActive("/dashboard/matches") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/matches">
                  <Trophy className="mr-2 h-4 w-4" />
                  Match Management
                </Link>
              </Button>
            )}
            {(hasPermission("MANAGE_MEDICAL") || hasPermission("VIEW_MEDICAL")) && (
              <Button
                variant={isActive("/dashboard/medical") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/medical">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Medical Management
                </Link>
              </Button>
            )}
            {(hasPermission("MANAGE_SKILLS") || hasPermission("VIEW_SKILLS")) && (
              <Button
                variant={isActive("/dashboard/assessment") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/assessment">
                  <Medal className="mr-2 h-4 w-4" />
                  Skill Assessment
                </Link>
              </Button>
            )}
          </div>
        </div>
        {hasPermission("VIEW_REPORTS") && (
          <div className="px-4 py-2">
            <h2 className="mb-1 px-2 text-sm font-semibold tracking-tight text-muted-foreground">Reports & Analysis</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/dashboard/reports") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Report Center
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Attendance Analysis
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <LineChart className="mr-2 h-4 w-4" />
                Performance Trends
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <PieChart className="mr-2 h-4 w-4" />
                Team Statistics
              </Button>
            </div>
          </div>
        )}
        {hasPermission("MANAGE_USERS") && (
          <div className="px-4 py-2">
            <h2 className="mb-1 px-2 text-sm font-semibold tracking-tight text-muted-foreground">System Management</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/dashboard/users") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              > 
                <Link href="/dashboard/users">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </Button>
              <Button
                variant={isActive("/dashboard/settings") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/settings">
                  <Cog className="mr-2 h-4 w-4" />
                  System Settings
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Operation Logs
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="px-3 py-2">
        <div className="space-y-1">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {user?.name} ({user?.role})
          </h2>
        </div>
      </div>
    </div>
  )
}
