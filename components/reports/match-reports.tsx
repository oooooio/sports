"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, BarChart, PieChart, LineChart, Trophy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function MatchReports() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("summary")
  const [timeRange, setTimeRange] = useState("season")

  const handleDownload = (reportName: string) => {
    toast({
      title: "Download Started",
      description: `${reportName} report is downloading...`,
    })
  }

  const handleView = (reportName: string) => {
    toast({
      title: "View Report",
      description: `Generating ${reportName} report preview...`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Match Summary Report</SelectItem>
              <SelectItem value="performance">Match Performance Report</SelectItem>
              <SelectItem value="stats">Match Statistics Report</SelectItem>
              <SelectItem value="opponent">Opponent Analysis Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="season">This Season</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Match Summary Report</CardTitle>
            <CardDescription>Match results, scores and key data</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <PieChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("Match Summary")}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button size="sm" onClick={() => handleDownload("Match Summary")}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Match Performance Report</CardTitle>
            <CardDescription>Player performance evaluation and ratings</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("Match Performance")}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button size="sm" onClick={() => handleDownload("Match Performance")}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Match Statistics Report</CardTitle>
            <CardDescription>Detailed match statistics data</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <LineChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("Match Statistics")}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button size="sm" onClick={() => handleDownload("Match Statistics")}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Opponent Analysis Report</CardTitle>
            <CardDescription>Opponent tactics and performance analysis</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("Opponent Analysis")}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button size="sm" onClick={() => handleDownload("Opponent Analysis")}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Custom Match Report</CardTitle>
            <CardDescription>Create custom match data reports</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <Trophy className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("Custom Match")}>
              <Eye className="mr-2 h-4 w-4" />
              Create
            </Button>
            <Button size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
