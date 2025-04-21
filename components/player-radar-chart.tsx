"use client"

import { useEffect, useRef } from "react"

interface PlayerRadarChartProps {
  id: string
  data: number[]
  color: string
}
 
export default function PlayerRadarChart({ id, data, color }: PlayerRadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically import ECharts
    const loadECharts = async () => {
      try {
        const echarts = await import("echarts/core")
        const { RadarChart } = await import("echarts/charts")
        const { TitleComponent, TooltipComponent, LegendComponent, GridComponent } = await import("echarts/components")
        const { CanvasRenderer } = await import("echarts/renderers")

        echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarChart, CanvasRenderer])

        if (chartRef.current) {
          const chart = echarts.init(chartRef.current)

          const option = {
            animation: false,
            radar: {
              shape: "circle",
              indicator: [
                { name: "Speed", max: 100 },
                { name: "Strength", max: 100 },
                { name: "Technique", max: 100 },
                { name: "Awareness", max: 100 },
                { name: "Defense", max: 100 },
                { name: "Attack", max: 100 },
              ],
              axisName: {
                color: "#fff",
              },
              splitArea: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              },
            },
            series: [
              {
                type: "radar",
                data: [
                  {
                    value: data,
                    name: "Ability Assessment",
                    areaStyle: {
                      color: color.replace("rgb", "rgba").replace(")", ", 0.4)"),
                    },
                    lineStyle: {
                      color: color,
                    },
                    itemStyle: {
                      color: color,
                    },
                  },
                ],
              },
            ],
          }

          chart.setOption(option)

          const handleResize = () => {
            chart.resize()
          }

          window.addEventListener("resize", handleResize)

          return () => {
            chart.dispose()
            window.removeEventListener("resize", handleResize)
          }
        }
      } catch (error) {
        console.error("Failed to load ECharts:", error)
      }
    }

    loadECharts()
  }, [id, data, color])

  return <div id={id} ref={chartRef} className="w-full h-full player-radar-chart" />
}
