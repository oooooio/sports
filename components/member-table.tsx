"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, FileText, MoreHorizontal, Search, SortAsc, SortDesc, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemberQuickView } from "@/components/member-quick-view"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Member } from "@/services/members"
import { Skeleton } from "@/components/ui/skeleton"

export function MemberTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.from("members").select("*").order("name", { ascending: true })

        if (error) throw error

        setMembers(data || [])
      } catch (err) {
        console.error("Error fetching members:", err)
        setError("Failed to load members. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  // Filter and sort members
  const filteredMembers = members
    .filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPosition = positionFilter === "all" || member.position === positionFilter
      // For team and status, we need to check if they're not null first
      const matchesTeam = teamFilter === "all" || (member.position && member.position.includes(teamFilter))
      const matchesStatus = statusFilter === "all" || member.status === statusFilter

      return matchesSearch && matchesPosition && matchesTeam && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "position") {
        if (!a.position) return sortDirection === "asc" ? 1 : -1
        if (!b.position) return sortDirection === "asc" ? -1 : 1
        return sortDirection === "asc" ? a.position.localeCompare(b.position) : b.position.localeCompare(a.position)
      } else if (sortField === "join_date") {
        if (!a.join_date) return sortDirection === "asc" ? 1 : -1
        if (!b.join_date) return sortDirection === "asc" ? -1 : 1
        return sortDirection === "asc"
          ? new Date(a.join_date).getTime() - new Date(b.join_date).getTime()
          : new Date(b.join_date).getTime() - new Date(a.join_date).getTime()
      }
      return 0
    })

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle member selection for quick view
  const handleMemberClick = (member: Member) => {
    setSelectedMember(member)
    setIsQuickViewOpen(true)
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "N/A"

    const dob = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    return age
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-[130px]" />
            <Skeleton className="h-10 w-[130px]" />
            <Skeleton className="h-10 w-[130px]" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full ml-1" />
                          <Skeleton className="h-8 w-8 rounded-full ml-1" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }
 
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="Forward">Forward</SelectItem>
              <SelectItem value="Midfielder">Midfielder</SelectItem>
              <SelectItem value="Defender">Defender</SelectItem>
              <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="injured">Injured</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                  <div className="flex items-center">
                    Member
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("position")}>
                  <div className="flex items-center">
                    Position
                    {sortField === "position" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("join_date")}>
                  <div className="flex items-center">
                    Join Date
                    {sortField === "join_date" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="cursor-pointer" onClick={() => handleMemberClick(member)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.position || "Not set"}</TableCell>
                    <TableCell>{member.email || "Not set"}</TableCell>
                    <TableCell>{calculateAge(member.date_of_birth)}</TableCell>
                    <TableCell>{member.join_date || "Not set"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "active"
                            ? "default"
                            : member.status === "injured"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {member.status === "active"
                          ? "Active"
                          : member.status === "injured"
                            ? "Injured"
                            : member.status === "suspended"
                              ? "Suspended"
                              : member.status === "inactive"
                                ? "Inactive"
                                : "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <Link href={`/dashboard/members/${member.id}`}>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Link href={`/dashboard/members/${member.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Member</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Change Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <span>Delete Member</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No matching members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>View member information and statistics</DialogDescription>
          </DialogHeader>
          {selectedMember && <MemberQuickView member={selectedMember} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
