import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineContent,
} from "@/components/ui/timeline"
import { CheckCircle2, AlertCircle, Clock, Activity, CalendarDays, FileText, Stethoscope } from "lucide-react"

interface MedicalRecordDetailProps {
  record: {
    id: string
    memberName: string
    memberAvatar: string
    injuryType: string
    date: string
    status: string
    severity: string
    estimatedRecovery: string
  }
}

export function MedicalRecordDetail({ record }: MedicalRecordDetailProps) {
  // Mock data for the detail view
  const recoveryProgress = record.status === "recovered" ? 100 : record.status === "active" ? 45 : 0

  const treatmentHistory = [
    {
      date: "2023-10-15",
      title: "Initial Diagnosis",
      description: "Diagnosed with ankle sprain, recommended rest and physical therapy",
      provider: "Dr. Wang",
    },
    {
      date: "2023-10-20",
      title: "Physical Therapy",
      description: "Completed first physical therapy session, including ice treatment and light stretching",
      provider: "Therapist Li",
    },
    {
      date: "2023-10-27",
      title: "Follow-up",
      description: "Swelling reduced, can begin light rehabilitation training",
      provider: "Dr. Wang",
    },
    {
      date: "2023-11-03",
      title: "Rehabilitation Training",
      description: "Started light rehabilitation training, including balance and strength exercises",
      provider: "Coach Zhang",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "recovered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "In Treatment"
      case "recovered":
        return "Recovered"
      case "pending":
        return "Pending Assessment"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={record.memberAvatar || "/placeholder.svg"}
          alt={record.memberName}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-bold">{record.memberName}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getStatusIcon(record.status)}
            <span>{getStatusText(record.status)}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Records</TabsTrigger>
          <TabsTrigger value="notes">Medical Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Injury Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Injury Type:</dt>
                    <dd>{record.injuryType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Date of Occurrence:</dt>
                    <dd>{record.date}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Severity:</dt>
                    <dd>{record.severity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Estimated Recovery Time:</dt>
                    <dd>{record.estimatedRecovery}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recovery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Recovery Progress</span>
                      <span className="text-sm font-medium">{recoveryProgress}%</span>
                    </div>
                    <Progress value={recoveryProgress} />
                  </div>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Current Stage:</dt>
                      <dd>{recoveryProgress < 30 ? "Initial Treatment" : recoveryProgress < 70 ? "Rehabilitation" : "Final Recovery"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Next Check-up:</dt>
                      <dd>{new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString("en-US")}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Medical Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Based on the player's injury condition, continued physical therapy and light rehabilitation training is recommended. Avoid intense exercise and ensure adequate rest.
                Apply ice twice daily for 15 minutes each time. Begin light balance and strength training, but avoid any movements that cause pain.
                If symptoms worsen, please contact the medical team immediately.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Treatment History</CardTitle>
              <CardDescription>All treatment records and rehabilitation progress for the player</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline>
                {treatmentHistory.map((item, index) => (
                  <TimelineItem key={index}>
                    {index < treatmentHistory.length - 1 && <TimelineConnector />}
                    <TimelineHeader>
                      <TimelineIcon>
                        {item.title.includes("Diagnosis") ? (
                          <Stethoscope className="h-4 w-4" />
                        ) : item.title.includes("Therapy") ? (
                          <Activity className="h-4 w-4" />
                        ) : item.title.includes("Follow-up") ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <CalendarDays className="h-4 w-4" />
                        )}
                      </TimelineIcon>
                      <TimelineTitle>{item.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineContent>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                        <Badge variant="outline">{item.provider}</Badge>
                      </div>
                      <p>{item.description}</p>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Medical Notes</CardTitle>
              <CardDescription>Detailed observations and records from the medical team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">Initial Diagnosis Notes</h4>
                  <span className="text-sm text-muted-foreground">2023-10-15</span>
                </div>
                <p>
                  Patient sprained right ankle during training, with significant swelling and pain. X-ray shows no fracture, diagnosed as moderate ankle sprain.
                  RICE treatment recommended (Rest, Ice, Compression, Elevation), and physical therapy should be started. Estimated recovery time is 2-3 weeks, which may be adjusted based on recovery progress.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">Physical Therapy Record</h4>
                  <span className="text-sm text-muted-foreground">2023-10-20</span>
                </div>
                <p>
                  Patient underwent first physical therapy session, including ice treatment, light massage, and passive joint movement. Swelling has decreased but pain persists.
                  Patient was taught simple home exercises, including light ankle movements and stretching. Continued use of elastic bandage and avoiding weight-bearing is advised.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">Follow-up Record</h4>
                  <span className="text-sm text-muted-foreground">2023-10-27</span>
                </div>
                <p>
                  Patient is recovering well, with significant reduction in swelling and decreased pain. Can begin light weight-bearing and rehabilitation training.
                  Recommended to start balance training and light strength exercises, but avoid any jumping or intense activities. Continue physical therapy twice a week.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
