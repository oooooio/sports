"use client"

import React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Edit, FileText, Search, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MatchQuickView } from "@/components/match-quick-view"
import Link from "next/link"
import type { MatchWithDetails, MatchType, MatchResult, HomeAway } from "@/services/matches"
import { Skeleton } from "@/components/ui/skeleton"

type MatchListProps = {
  matches: MatchWithDetails[]
  type?: "upcoming" | "past" | "all"
  loading?: boolean
}

export function MatchList({ matches, type = "all", loading = false }: MatchListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [competitionFilter, setCompetitionFilter] = useState<MatchType | "all">("all")
  const [venueFilter, setVenueFilter] = useState<HomeAway | "all">("all")
  const [resultFilter, setResultFilter] = useState<MatchResult | "all">("all")
  const [sortField, setSortField] = useState<"opponent" | "match_date" | "match_type">("match_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedMatch, setSelectedMatch] = useState<MatchWithDetails | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  // Filter and sort matches
  const filteredMatches = matches
    .filter((match) => {
      const matchesSearch =
        match.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false
      const matchesCompetition = competitionFilter === "all" || match.match_type === competitionFilter
      const matchesVenue = venueFilter === "all" || match.home_away === venueFilter
      const matchesResult = resultFilter === "all" || match.result === resultFilter

      return matchesSearch && matchesCompetition && matchesVenue && matchesResult
    })
    .sort((a, b) => {
      if (sortField === "match_date") {
        const dateA = new Date(a.match_date)
        const dateB = new Date(b.match_date)
        return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      } else if (sortField === "opponent") {
        return sortDirection === "asc" ? a.opponent.localeCompare(b.opponent) : b.opponent.localeCompare(a.opponent)
      } else if (sortField === "match_type") {
        return sortDirection === "asc"
          ? (a.match_type || "").localeCompare(b.match_type || "")
          : (b.match_type || "").localeCompare(a.match_type || "")
      }
      return 0
    })

  // Toggle sort direction
  const toggleSort = (field: "opponent" | "match_date" | "match_type") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle match selection for quick view
  const handleMatchClick = (match: MatchWithDetails) => {
    setSelectedMatch(match)
    setIsQuickViewOpen(true)
  }

  // Toggle expanded match details
  const toggleExpandMatch = (id: string) => {
    setExpandedMatch(expandedMatch === id ? null : id)
  }

  // Get result badge color
  const getResultBadgeVariant = (result?: string) => {
    if (!result || result === "pending") return "outline"
    if (result === "win") return "default"
    if (result === "loss") return "destructive"
    return "outline" // Draw
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US")
  }

  // Format time
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full md:w-64" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            {type === "past" && <Skeleton className="h-10 w-32" />}
          </div>
        </div>
        <div className="rounded-md border">
          <div className="h-[400px] w-full animate-pulse bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={competitionFilter} onValueChange={(value) => setCompetitionFilter(value as MatchType | "all")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Match Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="league">League</SelectItem>
              <SelectItem value="cup">Cup</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="tournament">Tournament</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={venueFilter} onValueChange={(value) => setVenueFilter(value as HomeAway | "all")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>

          {type === "past" && (
            <Select value={resultFilter} onValueChange={(value) => setResultFilter(value as MatchResult | "all")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="win">Win</SelectItem>
                <SelectItem value="draw">Draw</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
 
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("opponent")}>
                <div className="flex items-center">
                  Opponent
                  {sortField === "opponent" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-1 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("match_date")}>
                <div className="flex items-center">
                  Date
                  {sortField === "match_date" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-1 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              {type === "upcoming" ? <TableHead>Time</TableHead> : <TableHead>Result</TableHead>}
              <TableHead>Venue</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("match_type")}>
                <div className="flex items-center">
                  Match Type
                  {sortField === "match_type" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-1 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <React.Fragment key={match.id}>
                  <TableRow className="cursor-pointer" onClick={() => handleMatchClick(match)}>
                    <TableCell className="font-medium">vs {match.opponent}</TableCell>
                    <TableCell>{formatDate(match.match_date)}</TableCell>
                    {type === "upcoming" ? (
                      <TableCell>{formatTime(match.match_date)}</TableCell>
                    ) : (
                      <TableCell>
                        <Badge variant={getResultBadgeVariant(match.result)}>
                          {match.result === "win"
                            ? "Win"
                            : match.result === "loss"
                              ? "Loss"
                              : match.result === "draw"
                                ? "Draw"
                                : "Pending"}
                          {match.score_for !== null &&
                            match.score_against !== null &&
                            ` ${match.score_for}-${match.score_against}`}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      {match.home_away === "home" ? "Home" : match.home_away === "away" ? "Away" : "Neutral"}
                    </TableCell>
                    <TableCell>
                      {match.match_type === "league"
                        ? "League"
                        : match.match_type === "cup"
                          ? "Cup"
                          : match.match_type === "friendly"
                            ? "Friendly"
                            : match.match_type === "tournament"
                              ? "Tournament"
                              : "Other"}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpandMatch(match.id)
                          }}
                        >
                          {expandedMatch === match.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="sr-only">Show Details</span>
                        </Button>
                        {type === "upcoming" ? (
                          <Link href={`/dashboard/matches/${match.id}`}>
                            <Button size="sm">Manage Lineup</Button>
                          </Link>
                        ) : (
                          <>
                            <Link href={`/dashboard/matches/${match.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Link href={`/dashboard/matches/${match.id}/report`}>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View Report</span>
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedMatch === match.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/50 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium mb-2">Match Details</h4>
                            <div className="space-y-1 text-sm">
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">Location:</span>
                                <span>{match.location || "-"}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">Match Type:</span>
                                <span>
                                  {match.match_type === "league"
                                    ? "League"
                                    : match.match_type === "cup"
                                      ? "Cup"
                                      : match.match_type === "friendly"
                                        ? "Friendly"
                                        : match.match_type === "tournament"
                                          ? "Tournament"
                                          : "Other"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">Venue:</span>
                                <span>
                                  {match.home_away === "home" ? "Home" : match.home_away === "away" ? "Away" : "Neutral"}
                                </span>
                              </div>
                              {match.notes && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">Notes:</span>
                                  <span>{match.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {match.result && match.result !== "pending" && (
                            <div>
                              <h4 className="font-medium mb-2">Match Result</h4>
                              <div className="space-y-1 text-sm">
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">Result:</span>
                                  <span>
                                    <Badge variant={getResultBadgeVariant(match.result)}>
                                      {match.result === "win"
                                        ? "Win"
                                        : match.result === "loss"
                                          ? "Loss"
                                          : match.result === "draw"
                                            ? "Draw"
                                            : "Pending"}
                                    </Badge>
                                  </span>
                                </div>
                                {match.score_for !== null && match.score_against !== null && (
                                  <div className="grid grid-cols-2">
                                    <span className="text-muted-foreground">Score:</span>
                                    <span>
                                      {match.score_for} - {match.score_against}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No matches found matching the filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
            <DialogDescription>View match details and statistics</DialogDescription>
          </DialogHeader>
          {selectedMatch && <MatchQuickView match={selectedMatch} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
