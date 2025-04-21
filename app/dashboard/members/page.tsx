"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberTable } from "@/components/member-table"
import { MemberGrid } from "@/components/member-grid"
import { MemberStats } from "@/components/member-stats"
import { Plus, Upload, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { PERMISSIONS } from "@/lib/mock-users"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MembersPage() {
  const [view, setView] = useState<"list" | "grid">("list")
  const { hasPermission } = useAuth()

  const canManageMembers = hasPermission(PERMISSIONS.MANAGE_MEMBERS)
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="text-muted-foreground">Manage team members, view details and track performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageMembers && (
            <>
              <Link href="/dashboard/members/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    More Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/dashboard/members/import">
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Members
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export Members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <MemberStats />

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" onClick={() => setView("list")}>
              List View
            </TabsTrigger>
            <TabsTrigger value="grid" onClick={() => setView("grid")}>
              Grid View
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list" className="space-y-4">
          <MemberTable />
        </TabsContent>
        <TabsContent value="grid" className="space-y-4">
          <MemberGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}
