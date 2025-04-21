"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Plus, X } from "lucide-react"

export function MatchLineup() {
  const [formation, setFormation] = useState("4-4-2")

  // Mock data for players
  const [players, setPlayers] = useState([
    { id: "player-1", name: "John Smith", position: "Forward", selected: true },
    { id: "player-2", name: "Michael Johnson", position: "Midfielder", selected: true },
    { id: "player-3", name: "David Williams", position: "Defender", selected: true },
    { id: "player-4", name: "James Brown", position: "Goalkeeper", selected: true },
    { id: "player-5", name: "Robert Davis", position: "Midfielder", selected: true },
    { id: "player-6", name: "Thomas Wilson", position: "Defender", selected: true },
    { id: "player-7", name: "Richard Moore", position: "Forward", selected: true },
    { id: "player-8", name: "Charles Taylor", position: "Midfielder", selected: true },
    { id: "player-9", name: "Daniel Anderson", position: "Defender", selected: true },
    { id: "player-10", name: "Paul Thomas", position: "Defender", selected: true },
    { id: "player-11", name: "Mark Jackson", position: "Midfielder", selected: true },
    { id: "player-12", name: "Steven White", position: "Forward", selected: false },
    { id: "player-13", name: "Edward Harris", position: "Midfielder", selected: false },
    { id: "player-14", name: "Brian Martin", position: "Defender", selected: false },
    { id: "player-15", name: "Kevin Thompson", position: "Goalkeeper", selected: false },
  ])

  const [starters, setStarters] = useState(players.filter((player) => player.selected))
  const [substitutes, setSubstitutes] = useState(players.filter((player) => !player.selected))

  const handleFormationChange = (value: string) => {
    setFormation(value)
  }

  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "starters") {
        const newStarters = Array.from(starters)
        const [removed] = newStarters.splice(source.index, 1)
        newStarters.splice(destination.index, 0, removed)
        setStarters(newStarters)
      } else {
        const newSubstitutes = Array.from(substitutes)
        const [removed] = newSubstitutes.splice(source.index, 1)
        newSubstitutes.splice(destination.index, 0, removed)
        setSubstitutes(newSubstitutes)
      }
    } else {
      // Moving from one list to another
      if (source.droppableId === "starters") {
        const newStarters = Array.from(starters)
        const newSubstitutes = Array.from(substitutes)
        const [removed] = newStarters.splice(source.index, 1)
        removed.selected = false
        newSubstitutes.splice(destination.index, 0, removed)
        setStarters(newStarters)
        setSubstitutes(newSubstitutes)
      } else {
        const newStarters = Array.from(starters)
        const newSubstitutes = Array.from(substitutes)
        const [removed] = newSubstitutes.splice(source.index, 1)
        removed.selected = true
        newStarters.splice(destination.index, 0, removed)
        setStarters(newStarters)
        setSubstitutes(newSubstitutes)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Team Selection</h3>
          <p className="text-sm text-muted-foreground">Drag and drop players to set your lineup</p>
        </div>
        <Select value={formation} onValueChange={handleFormationChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Formation" />
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Starting Lineup ({starters.length})</h4>
              <Droppable droppableId="starters">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] border rounded-md p-2"
                  >
                    {starters.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 mb-2 bg-background border rounded-md"
                          >
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-muted-foreground">{player.position}</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Substitutes ({substitutes.length})</h4>
              <Droppable droppableId="substitutes">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] border rounded-md p-2"
                  >
                    {substitutes.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 mb-2 bg-background border rounded-md"
                          >
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-muted-foreground">{player.position}</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      <div className="border rounded-md p-4">
        <h4 className="font-medium mb-4">Formation Preview: {formation}</h4>
        <div className="aspect-[3/4] bg-green-100 dark:bg-green-900 rounded-md relative">
          {/* This would be a visual representation of the formation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Formation visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
