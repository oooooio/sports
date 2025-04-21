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
import { ArrowLeft, Plus, Save, X } from "lucide-react"
import Link from "next/link"
import { DatePicker } from "@/components/date-picker"
import { TimePicker } from "@/components/time-picker"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewTrainingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exercises, setExercises] = useState<{ id: number; name: string; duration: string; description: string }[]>([
    { id: 1, name: "Warm-up", duration: "15", description: "Light jogging and stretching" },
  ])
  const [formData, setFormData] = useState({
    title: "",
    date: null as Date | null,
    startTime: "",
    endTime: "",
    team: "",
    location: "",
    coach: "",
    description: "",
    objectives: "",
    equipment: "",
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

  const handleTimeChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, notifyMembers: checked }))
  }

  const handleExerciseChange = (id: number, field: string, value: string) => {
    setExercises((prev) => prev.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise)))
  }

  const addExercise = () => {
    const newId = exercises.length > 0 ? Math.max(...exercises.map((e) => e.id)) + 1 : 1
    setExercises([...exercises, { id: newId, name: "", duration: "", description: "" }])
  }

  const removeExercise = (id: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((exercise) => exercise.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Training Plan Created",
        description: `${formData.title} has been scheduled successfully.`,
      })
      router.push("/dashboard/training")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Training Plan</h1>
        <Link href="/dashboard/training">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training
          </Button>
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Training Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Training Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter training title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={formData.team} onValueChange={(value) => handleSelectChange("team", value)}>
                  <SelectTrigger id="team">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Team">First Team</SelectItem>
                    <SelectItem value="Second Team">Second Team</SelectItem>
                    <SelectItem value="Youth Team">Youth Team</SelectItem>
                    <SelectItem value="All Teams">All Teams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker date={formData.date} onSelect={handleDateChange} placeholder="Select date" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <TimePicker
                    value={formData.startTime}
                    onChange={(value) => handleTimeChange("startTime", value)}
                    placeholder="Select start time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <TimePicker
                    value={formData.endTime}
                    onChange={(value) => handleTimeChange("endTime", value)}
                    placeholder="Select end time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter training location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coach">Coach</Label>
                <Input
                  id="coach"
                  name="coach"
                  placeholder="Enter coach name"
                  value={formData.coach}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter training description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                name="objectives"
                placeholder="Enter training objectives"
                value={formData.objectives}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Required Equipment</Label>
              <Input
                id="equipment"
                name="equipment"
                placeholder="Enter required equipment"
                value={formData.equipment}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Exercises</Label>
                <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {exercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="grid w-full gap-4 md:grid-cols-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`exercise-name-${exercise.id}`}>Exercise Name</Label>
                            <Input
                              id={`exercise-name-${exercise.id}`}
                              value={exercise.name}
                              onChange={(e) => handleExerciseChange(exercise.id, "name", e.target.value)}
                              placeholder="Exercise name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`exercise-duration-${exercise.id}`}>Duration (min)</Label>
                            <Input
                              id={`exercise-duration-${exercise.id}`}
                              value={exercise.duration}
                              onChange={(e) => handleExerciseChange(exercise.id, "duration", e.target.value)}
                              placeholder="Duration"
                              type="number"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-4">
                            <Label htmlFor={`exercise-description-${exercise.id}`}>Description</Label>
                            <Textarea
                              id={`exercise-description-${exercise.id}`}
                              value={exercise.description}
                              onChange={(e) => handleExerciseChange(exercise.id, "description", e.target.value)}
                              placeholder="Exercise description"
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(exercise.id)}
                          disabled={exercises.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="notifyMembers" checked={formData.notifyMembers} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="notifyMembers">Notify team members about this training session</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Link href="/dashboard/training">
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
                  Save Training Plan
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
