import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillAssessmentForm } from "@/components/skill-assessment-form"
import { SkillHistoryChart } from "@/components/skill-history-chart"

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Skill Assessment</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Team and Player</CardTitle>
              <CardDescription>Choose the team and player to assess</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team-a">First Team</SelectItem>
                    <SelectItem value="team-b">Second Team</SelectItem>
                    <SelectItem value="team-c">Youth Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Player</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player-1">John Smith</SelectItem>
                    <SelectItem value="player-2">Michael Johnson</SelectItem>
                    <SelectItem value="player-3">David Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Start Assessment</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="new">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Assessment</TabsTrigger>
              <TabsTrigger value="history">Historical Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Assessment Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillAssessmentForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Assessment Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillHistoryChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
