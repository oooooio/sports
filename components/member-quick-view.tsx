"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Calendar, MapPin, Flag, Ruler, Weight } from "lucide-react"
import Link from "next/link"

interface MemberQuickViewProps {
  member: any
}

export function MemberQuickView({ member }: MemberQuickViewProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold">{member.name}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="secondary">{member.position}</Badge>
            <Badge
              variant={member.status === "Active" ? "default" : member.status === "Injured" ? "destructive" : "outline"}
            >
              {member.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/members/${member.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/members/${member.id}`}>
            <Button size="sm">View Full Profile</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Age: {member.age} years</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span>Nationality: {member.nationality}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <span>Height: {member.height}</span>
        </div>
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-muted-foreground" />
          <span>Weight: {member.weight}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Team: {member.team}</span>
        </div>
      </div>
 
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Appearances</p>
                  <p className="text-lg font-bold">{member.appearances}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goals</p>
                  <p className="text-lg font-bold">{member.goals}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assists</p>
                  <p className="text-lg font-bold">{member.assists}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contract End</p>
                  <p className="text-lg font-bold">{member.contractEnd}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-bold">{member.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Training Attendance</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Match Attendance</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[90%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Attendance</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[87%] rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Technical Ability</span>
                    <span className="text-sm font-medium">8.5/10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Physical Fitness</span>
                    <span className="text-sm font-medium">7.8/10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[78%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Tactical Understanding</span>
                    <span className="text-sm font-medium">8.2/10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[82%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Mental Strength</span>
                    <span className="text-sm font-medium">9.0/10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[90%] rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
