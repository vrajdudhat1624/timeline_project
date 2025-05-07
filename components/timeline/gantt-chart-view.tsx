"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchEmployeeBillingData } from "@/lib/data"
import { GanttChart } from "@/components/charts/gantt-chart"
import { TimelineHeader } from "@/components/timeline/timeline-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineFilters } from "./timeline-filters"
import { TimelineView } from "./timeline-view"
import { TimelineGantt } from "./timeline-gantt"
import { BumpChartView } from "@/components/timeline/bump-chart-view"
import { NetworkChartView } from "@/components/timeline/network-chart-view"

export function GanttChartView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch and process data
        const billingData = await fetchEmployeeBillingData()

        // Process data for gantt chart
        const processedData = processDataForGanttChart(billingData)
        setData(processedData)
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Failed to load chart data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <TimelineHeader />

      <Card className="h-[calc(100%-180px)]">
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Visualizing project schedules and durations</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="h-full">
              <Tabs defaultValue="timeline">
                <TabsList className="mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
                  <TabsTrigger value="bump">Bump Chart</TabsTrigger>
                  <TabsTrigger value="network">Network Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline">
                  <TimelineView />
                </TabsContent>
                <TabsContent value="gantt">
                  <TimelineGantt />
                </TabsContent>
                <TabsContent value="bump">
                  <BumpChartView />
                </TabsContent>
                <TabsContent value="network">
                  <NetworkChartView />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Process data for gantt chart
function processDataForGanttChart(billingData: any[]) {
  // Group data by project
  const projectGroups = new Map()

  billingData.forEach((entry) => {
    const projectKey = entry.project_key
    const date = new Date(entry.transfer_date)

    if (!projectGroups.has(projectKey)) {
      projectGroups.set(projectKey, {
        id: `Project ${projectKey}`,
        dates: [date],
      })
    } else {
      projectGroups.get(projectKey).dates.push(date)
    }
  })

  // Convert to Gantt chart format
  return Array.from(projectGroups.values()).map((project) => {
    const dates = project.dates.sort((a, b) => a - b)
    const startDate = dates[0]
    const endDate = dates[dates.length - 1]

    // Calculate progress based on dates
    const totalDuration = endDate - startDate
    const elapsed = new Date() - startDate
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)))

    return {
      id: project.id,
      data: [
        {
          id: "Main Task",
          start: startDate,
          end: endDate,
          type: "task",
          progress: progress,
        },
      ],
    }
  })
}
