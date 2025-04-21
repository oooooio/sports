"use client"

import { useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SkillHistoryChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock data - historical assessment data
  const assessmentData = {
    dates: ["2023-01", "2023-03", "2023-06", "2023-09", "2023-12"],
    technique: [3, 3, 4, 4, 5],
    physical: [2, 3, 3, 4, 4],
    tactical: [2, 2, 3, 3, 4],
    mental: [3, 3, 3, 4, 4],
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw chart
    const padding = 40
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2
    const dataLength = assessmentData.dates.length

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height + padding)
    ctx.lineTo(width + padding, height + padding)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()

    // Draw date labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#888"
    ctx.font = "10px sans-serif"
    for (let i = 0; i < dataLength; i++) {
      const x = padding + (width / (dataLength - 1)) * i
      ctx.fillText(assessmentData.dates[i], x, height + padding + 15)
    }

    // Draw score labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const y = height + padding - (height / 5) * i
      ctx.fillText(i.toString(), padding - 5, y + 3)
    }

    // Draw data line - Technical Ability
    ctx.beginPath()
    for (let i = 0; i < dataLength; i++) {
      const x = padding + (width / (dataLength - 1)) * i
      const y = height + padding - (height / 5) * assessmentData.technique[i]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data line - Physical Attributes
    ctx.beginPath()
    for (let i = 0; i < dataLength; i++) {
      const x = padding + (width / (dataLength - 1)) * i
      const y = height + padding - (height / 5) * assessmentData.physical[i]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data line - Tactical Understanding
    ctx.beginPath()
    for (let i = 0; i < dataLength; i++) {
      const x = padding + (width / (dataLength - 1)) * i
      const y = height + padding - (height / 5) * assessmentData.tactical[i]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data line - Mental Attributes
    ctx.beginPath()
    for (let i = 0; i < dataLength; i++) {
      const x = padding + (width / (dataLength - 1)) * i
      const y = height + padding - (height / 5) * assessmentData.mental[i]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 2
    ctx.stroke()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="all">All history</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center text-sm">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 mr-1 rounded-full"></div>
            <span>Technical</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-red-500 mr-1 rounded-full"></div>
            <span>Physical</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-green-500 mr-1 rounded-full"></div>
            <span>Tactical</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 mr-1 rounded-full"></div>
            <span>Mental</span>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4">
        <canvas ref={canvasRef} className="w-full h-[300px]"></canvas>
      </div>
    </div>
  )
}
