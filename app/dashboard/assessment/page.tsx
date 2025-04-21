"use client"
 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState("technical")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skill Assessment</h1>
        <Link href="/dashboard/assessment/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="technical" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="tactical">Tactical</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="mental">Mental</TabsTrigger>
        </TabsList>
        <TabsContent value="technical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput placeholder="Search players..." />
                <CommandList>
                  <CommandEmpty>No players found</CommandEmpty>
                  <CommandGroup heading="Players">
                    <CommandItem>Zhang San</CommandItem>
                    <CommandItem>Li Si</CommandItem>
                    <CommandItem>Wang Wu</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tactical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tactical Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput placeholder="Search players..." />
                <CommandList>
                  <CommandEmpty>No players found</CommandEmpty>
                  <CommandGroup heading="Players">
                    <CommandItem>Zhang San</CommandItem>
                    <CommandItem>Li Si</CommandItem>
                    <CommandItem>Wang Wu</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="physical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Physical Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput placeholder="Search players..." />
                <CommandList>
                  <CommandEmpty>No players found</CommandEmpty>
                  <CommandGroup heading="Players">
                    <CommandItem>Zhang San</CommandItem>
                    <CommandItem>Li Si</CommandItem>
                    <CommandItem>Wang Wu</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mental" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mental Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput placeholder="Search players..." />
                <CommandList>
                  <CommandEmpty>No players found</CommandEmpty>
                  <CommandGroup heading="Players">
                    <CommandItem>Zhang San</CommandItem>
                    <CommandItem>Li Si</CommandItem>
                    <CommandItem>Wang Wu</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
