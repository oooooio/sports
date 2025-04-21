"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemberQuickView } from "@/components/member-quick-view"
import { FileText, Edit } from "lucide-react"
import Link from "next/link"

export function MemberGrid() {
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Mock data
  const members = [
    {
      id: 1,
      name: "John Smith",
      position: "Forward",
      team: "First Team",
      age: 24,
      joinDate: "2020-06-15",
      status: "Active",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      nationality: "USA",
      height: "185 cm",
      weight: "78 kg",
      contractEnd: "2024-06-30",
      value: "$2.5M",
      goals: 15,
      assists: 8,
      appearances: 28,
    },
    {
      id: 2,
      name: "Michael Johnson",
      position: "Midfielder",
      team: "First Team",
      age: 22,
      joinDate: "2021-03-10",
      status: "Active",
      email: "michael.johnson@example.com",
      phone: "+1 (555) 234-5678",
      nationality: "England",
      height: "178 cm",
      weight: "72 kg",
      contractEnd: "2025-03-31",
      value: "$1.8M",
      goals: 6,
      assists: 12,
      appearances: 30,
    },
    {
      id: 3,
      name: "David Williams",
      position: "Defender",
      team: "Second Team",
      age: 20,
      joinDate: "2022-01-05",
      status: "Injured",
      email: "david.williams@example.com",
      phone: "+1 (555) 345-6789",
      nationality: "France",
      height: "182 cm",
      weight: "76 kg",
      contractEnd: "2024-12-31",
      value: "$1.2M",
      goals: 2,
      assists: 3,
      appearances: 18,
    },
    {
      id: 4,
      name: "James Brown",
      position: "Goalkeeper",
      team: "Youth Team",
      age: 18,
      joinDate: "2022-08-20",
      status: "Active",
      email: "james.brown@example.com",
      phone: "+1 (555) 456-7890",
      nationality: "Germany",
      height: "190 cm",
      weight: "85 kg",
      contractEnd: "2025-08-31",
      value: "$0.8M",
      goals: 0,
      assists: 0,
      appearances: 15,
    },
    {
      id: 5,
      name: "Robert Davis",
      position: "Midfielder",
      team: "Second Team",
      age: 21,
      joinDate: "2021-11-15",
      status: "Suspended",
      email: "robert.davis@example.com",
      phone: "+1 (555) 567-8901",
      nationality: "Brazil",
      height: "175 cm",
      weight: "70 kg",
      contractEnd: "2023-12-31",
      value: "$1.5M",
      goals: 4,
      assists: 7,
      appearances: 22,
    },
    {
      id: 6,
      name: "Thomas Wilson",
      position: "Defender",
      team: "First Team",
      age: 26,
      joinDate: "2019-07-10",
      status: "Active",
      email: "thomas.wilson@example.com",
      phone: "+1 (555) 678-9012",
      nationality: "Spain",
      height: "188 cm",
      weight: "82 kg",
      contractEnd: "2024-07-31",
      value: "$3.2M",
      goals: 1,
      assists: 4,
      appearances: 32,
    },
    {
      id: 7,
      name: "Richard Moore",
      position: "Forward",
      team: "First Team",
      age: 23,
      joinDate: "2020-08-05",
      status: "Active",
      email: "richard.moore@example.com",
      phone: "+1 (555) 789-0123",
      nationality: "Argentina",
      height: "180 cm",
      weight: "75 kg",
      contractEnd: "2024-08-31",
      value: "$2.8M",
      goals: 12,
      assists: 6,
      appearances: 29,
    },
    {
      id: 8,
      name: "Charles Taylor",
      position: "Midfielder",
      team: "Youth Team",
      age: 19,
      joinDate: "2022-06-15",
      status: "Active",
      email: "charles.taylor@example.com",
      phone: "+1 (555) 890-1234",
      nationality: "Italy",
      height: "176 cm",
      weight: "68 kg",
      contractEnd: "2025-06-30",
      value: "$0.9M",
      goals: 3,
      assists: 5,
      appearances: 20,
    },
  ]

  // Handle member selection for quick view
  const handleMemberClick = (member: any) => {
    setSelectedMember(member)
    setIsQuickViewOpen(true)
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col items-center p-6 cursor-pointer" onClick={() => handleMemberClick(member)}>
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>{member.team}</Badge>
                  <Badge
                    variant={
                      member.status === "Active" ? "default" : member.status === "Injured" ? "destructive" : "outline"
                    }
                  >
                    {member.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{member.age}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nationality</p>
                    <p className="font-medium">{member.nationality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Height</p>
                    <p className="font-medium">{member.height}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{member.weight}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0 border-t">
              <Link href={`/dashboard/members/${member.id}`}>
                <Button variant="ghost" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Details
                </Button>
              </Link>
              <Link href={`/dashboard/members/${member.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

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
