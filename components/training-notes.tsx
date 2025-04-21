"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send } from "lucide-react"

interface TrainingNotesProps {
  trainingId: number
}

export function TrainingNotes({ trainingId }: TrainingNotesProps) {
  const [newNote, setNewNote] = useState("")
  const [notes, setNotes] = useState([
    {
      id: 1,
      author: "Coach Lee",
      avatar: "CL",
      content:
        "The team showed good progress in the passing drills today. Need to work more on defensive positioning in the next session.",
      timestamp: "2023-03-15 11:15",
    },
    {
      id: 2,
      author: "Coach Wang",
      avatar: "CW",
      content:
        "John Smith and Michael Johnson performed exceptionally well in the tactical exercises. David Williams needs more work on his positioning.",
      timestamp: "2023-03-15 11:30",
    },
  ])

  const handleAddNote = () => {
    if (newNote.trim()) {
      const now = new Date()
      const timestamp = now.toISOString().slice(0, 10) + " " + now.toTimeString().slice(0, 5)

      setNotes([
        ...notes,
        {
          id: notes.length + 1,
          author: "You",
          avatar: "Y",
          content: newNote,
          timestamp,
        },
      ])
      setNewNote("")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Training Notes and Observations</h3>
        <p className="text-sm text-muted-foreground">Record observations, feedback, and areas for improvement</p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{note.avatar}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{note.author}</span>
                <span className="text-xs text-muted-foreground">{note.timestamp}</span>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note or observation..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[80px]"
        />
        <Button size="icon" onClick={handleAddNote} disabled={!newNote.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
