"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { DatePicker } from "@/components/date-picker"
import { TimePicker } from "@/components/time-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchLineup } from "@/components/match-lineup"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewMatchPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    opponent: "",
    date: null as Date | null,
    time: "",
    location: "",
    competition: "",
    venue: "Home",
    description: "",
    transportDetails: "",
    notifyMembers: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleTimeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, time: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, notifyMembers: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Match Created",
        description: `Match vs ${formData.opponent} has been scheduled successfully.`,
      })
      router.push("/dashboard/matches")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Match Record</h1>
        <Link href="/dashboard/matches">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Button>
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="opponent">Opponent Team</Label>
                <Input
                  id="opponent"
                  name="opponent"
                  placeholder="Enter opponent team name"
                  value={formData.opponent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competition">Competition</Label>
                <Select
                  value={formData.competition}
                  onValueChange={(value) => handleSelectChange("competition", value)}
                >
                  <SelectTrigger id="competition">
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="League">League</SelectItem>
                    <SelectItem value="Cup">Cup</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Tournament">Tournament</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker date={formData.date} onSelect={handleDateChange} placeholder="Select match date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <TimePicker value={formData.time} onChange={handleTimeChange} placeholder="Select match time" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Select value={formData.venue} onValueChange={(value) => handleSelectChange("venue", value)}>
                  <SelectTrigger id="venue">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Away">Away</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter match location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Match Notes</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter any additional notes about the match"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportDetails">Transport Details</Label>
              <Textarea
                id="transportDetails"
                name="transportDetails"
                placeholder="Enter transport arrangements if applicable"
                value={formData.transportDetails}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <Tabs defaultValue="lineup">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lineup">Team Lineup</TabsTrigger>
                <TabsTrigger value="tactics">Tactics & Strategy</TabsTrigger>
              </TabsList>
              <TabsContent value="lineup" className="p-4 border rounded-md mt-2">
                <MatchLineup />
              </TabsContent>
              <TabsContent value="tactics" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="formation">Formation</Label>
                    <Select>
                      <SelectTrigger id="formation">
                        <SelectValue placeholder="Select formation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-4-2">4-4-2</SelectItem>
                        <SelectItem value="4-3-3">4-3-3</SelectItem>
                        <SelectItem value="3-5-2">3-5-2</SelectItem>
                        <SelectItem value="4-2-3-1">4-2-3-1</SelectItem>
                        <SelectItem value="5-3-2">5-3-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tacticalNotes">Tactical Notes</Label>
                    <Textarea id="tacticalNotes" placeholder="Enter tactical instructions and strategy" rows={4} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Checkbox id="notifyMembers" checked={formData.notifyMembers} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="notifyMembers">Notify team members about this match</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Link href="/dashboard/matches">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Match
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
