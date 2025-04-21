"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TrainingTemplates() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateType, setNewTemplateType] = useState("Tactical")

  // Mock data for training templates
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Basic Fitness Training",
      type: "Fitness",
      description: "Standard fitness training session with warm-up, conditioning, and cool-down.",
      exercises: 6,
      duration: 90,
    },
    {
      id: 2,
      name: "Tactical Coordination",
      type: "Tactical",
      description: "Focus on team shape, defensive organization, and transition play.",
      exercises: 5,
      duration: 120,
    },
    {
      id: 3,
      name: "Shooting Skills",
      type: "Technical",
      description: "Shooting drills from various positions and scenarios.",
      exercises: 7,
      duration: 90,
    },
    {
      id: 4,
      name: "Defensive Tactics",
      type: "Tactical",
      description: "Defensive positioning, marking, and coordination exercises.",
      exercises: 5,
      duration: 120,
    },
    {
      id: 5,
      name: "Recovery Session",
      type: "Recovery",
      description: "Light exercises and stretching for recovery after matches.",
      exercises: 4,
      duration: 60,
    },
    {
      id: 6,
      name: "Match Preparation",
      type: "Tactical",
      description: "Specific tactical preparation for upcoming matches.",
      exercises: 6,
      duration: 120,
    },
  ])

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || template.type === typeFilter

    return matchesSearch && matchesType
  })

  // Get template type badge color
  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case "Fitness":
        return "bg-blue-500"
      case "Tactical":
        return "bg-purple-500"
      case "Technical":
        return "bg-green-500"
      case "Recovery":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle template selection
  const handleSelectTemplate = (templateId: number) => {
    // In a real app, this would load the template data
    toast({
      title: "Template Selected",
      description: "Template has been loaded into the form.",
    })
  }

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      setIsCreating(true)

      // Simulate API call
      setTimeout(() => {
        const newTemplate = {
          id: templates.length + 1,
          name: newTemplateName,
          type: newTemplateType,
          description: `New ${newTemplateType} training template.`,
          exercises: 5,
          duration: 90,
        }

        setTemplates([...templates, newTemplate])
        setIsCreating(false)
        setNewTemplateName("")

        toast({
          title: "Template Created",
          description: `${newTemplateName} template has been created successfully.`,
        })
      }, 1500)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Tactical">Tactical</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Recovery">Recovery</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new training template that you can reuse for future sessions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter template name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Template Type</Label>
                  <Select value={newTemplateType} onValueChange={setNewTemplateType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Tactical">Tactical</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTemplate} disabled={isCreating || !newTemplateName.trim()}>
                  {isCreating ? "Creating..." : "Create Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge className={getTemplateTypeColor(template.type)} variant="secondary">
                  {template.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <div className="flex justify-between mt-4 text-sm">
                <div>
                  <span className="font-medium">{template.exercises}</span> exercises
                </div>
                <div>
                  <span className="font-medium">{template.duration}</span> minutes
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleSelectTemplate(template.id)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
