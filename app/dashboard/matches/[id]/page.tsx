"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Printer, Share, Trash2, Trophy, User } from "lucide-react"
import Link from "next/link"
import { MatchLineup } from "@/components/match-lineup"
import { MatchEvents } from "@/components/match-events"
import { MatchStats } from "@/components/match-stats"
import { MatchOpponentAnalysis } from "@/components/match-opponent-analysis"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  // Mock data for a match
  const match = {
    id: Number.parseInt(params.id),
    opponent: "Beijing FC",
    date: "2023-04-10",
    time: "15:00",
    location: "Home Stadium",
    venue: "Home",
    competition: "League",
    result: "Win 3-1",
    score: { home: 3, away: 1 },
    status: "Completed",
    attendance: "18,245",
    referee: "John Smith",
    weather: "Sunny, 22°C",
    teamFormation: "4-3-3",
    opponentFormation: "4-4-2",
    scorers: ["John Smith (23')", "Michael Johnson (45+2')", "David Williams (78')"],
    assisters: ["Robert Davis (23')", "Thomas Wilson (45+2')", "John Smith (78')"],
    yellowCards: ["Richard Moore (34')", "James Brown (67')"],
    redCards: [],
    notes: "Strong performance overall with good defensive organization and clinical finishing.",
  }

  // Get result badge variant
  const getResultBadgeVariant = (result?: string) => {
    if (!result) return "outline"
    if (result.startsWith("Win")) return "default"
    if (result.startsWith("Loss")) return "destructive"
    return "outline" // Draw
  }

  const handleDelete = () => {
    setIsDeleting(true)

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      toast({
        title: "Match Deleted",
        description: `Match vs ${match.opponent} has been deleted successfully.`,
      })
      router.push("/dashboard/matches")
    }, 1500)
  }

  const handlePrint = () => {
    toast({
      title: "Printing Match Details",
      description: "The match details are being sent to the printer.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Match Shared",
      description: "The match details have been shared with the team.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/matches">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Match Details</h1>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>Share with Team</DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/dashboard/matches/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this match record and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Match Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">vs {match.opponent}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">{match.competition}</Badge>
                <Badge variant={getResultBadgeVariant(match.result)}>{match.result}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{match.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{match.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>{match.competition}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{match.referee}</span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Weather Conditions</h3>
              <p className="text-sm text-muted-foreground">{match.weather}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Attendance</h3>
              <p className="text-sm text-muted-foreground">{match.attendance}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Formations</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Our Team:</span> {match.teamFormation}
                </div>
                <div>
                  <span className="text-muted-foreground">Opponent:</span> {match.opponentFormation}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground">{match.notes}</p>
            </div>

            <div className="pt-4">
              <Link href={`/dashboard/matches/${params.id}/report`}>
                <Button className="w-full">View Full Match Report</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="lineup">Lineup</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="opponent">Opponent</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="p-4">
                <MatchEvents match={match} />
              </TabsContent>
              <TabsContent value="lineup" className="p-4">
                <MatchLineup matchId={match.id} />
              </TabsContent>
              <TabsContent value="stats" className="p-4">
                <MatchStats matchId={match.id} />
              </TabsContent>
              <TabsContent value="opponent" className="p-4">
                <MatchOpponentAnalysis matchId={match.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
