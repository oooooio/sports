"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, BarChart, PieChart, LineChart, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PerformanceReports() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("individual")
  const [timeRange, setTimeRange] = useState("season")

  const handleDownload = (reportName: string) => {
    toast({
      title: "开始下载",
      description: `${reportName} 报告正在下载中...`,
    })
  }

  const handleView = (reportName: string) => {
    toast({
      title: "查看报告",
      description: `正在生成 ${reportName} 报告预览...`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择报告类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">个人表现报告</SelectItem>
              <SelectItem value="team">团队表现报告</SelectItem>
              <SelectItem value="skills">技能评估报告</SelectItem>
              <SelectItem value="progress">进步跟踪报告</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="season">本赛季</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">个人表现报告</CardTitle>
            <CardDescription>会员个人表现评估</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <LineChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("个人表现")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("个人表现")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">团队表现报告</CardTitle>
            <CardDescription>整体团队表现分析</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("团队表现")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("团队表现")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">技能评估报告</CardTitle>
            <CardDescription>详细的技能评估数据</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <PieChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("技能评估")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("技能评估")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">进步跟踪报告</CardTitle>
            <CardDescription>会员技能进步跟踪</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <LineChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("进步跟踪")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("进步跟踪")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">自定义表现报告</CardTitle>
            <CardDescription>创建自定义表现数据报告</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("自定义表现")}>
              <Eye className="mr-2 h-4 w-4" />
              创建
            </Button>
            <Button size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
