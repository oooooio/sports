import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface MedicalStatsProps {
  data: {
    totalRecords: number
    activeInjuries: number
    recoveredThisMonth: number
    pendingAssessments: number
  }
}
 
export function MedicalStats({ data }: MedicalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalRecords}</div>
          <p className="text-xs text-muted-foreground">Total number of all medical records</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Injuries</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeInjuries}</div>
          <p className="text-xs text-muted-foreground">Number of injuries currently being treated</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recovered This Month</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.recoveredThisMonth}</div>
          <p className="text-xs text-muted-foreground">Number of injuries recovered this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Assessment</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pendingAssessments}</div>
          <p className="text-xs text-muted-foreground">Number of team members waiting for medical assessment</p>
        </CardContent>
      </Card>
    </div>
  )
}
