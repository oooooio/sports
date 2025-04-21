"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, BarChart, PieChart, LineChart, Dumbbell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function TrainingReports() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("summary")
  const [timeRange, setTimeRange] = useState("month")

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
              <SelectItem value="summary">训练概况报告</SelectItem>
              <SelectItem value="attendance">训练出勤报告</SelectItem>
              <SelectItem value="effectiveness">训练效果报告</SelectItem>
              <SelectItem value="intensity">训练强度报告</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">训练概况报告</CardTitle>
            <CardDescription>训练次数、类型和时长统计</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <PieChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("训练概况")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("训练概况")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">训练出勤报告</CardTitle>
            <CardDescription>会员训练出勤率和缺勤原因</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("训练出勤")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("训练出勤")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">训练效果报告</CardTitle>
            <CardDescription>训练目标达成率和效果评估</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <LineChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("训练效果")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("训练效果")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">训练强度报告</CardTitle>
            <CardDescription>训练强度分布和负荷管理</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("训练强度")}>
              <Eye className="mr-2 h-4 w-4" />
              查看
            </Button>
            <Button size="sm" onClick={() => handleDownload("训练强度")}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">自定义训练报告</CardTitle>
            <CardDescription>创建自定义训练数据报告</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
              <Dumbbell className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleView("自定义训练")}>
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
