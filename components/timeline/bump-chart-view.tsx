"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchEmployeeBillingData } from "@/lib/data"
import { BumpChart } from "@/components/charts/bump-chart"
import { TimelineHeader } from "@/components/timeline/timeline-header"

export function BumpChartView() {
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

        // Process data for bump chart
        const processedData = processDataForBumpChart(billingData)
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
          <CardTitle>Project Engagement Over Time</CardTitle>
          <CardDescription>Visualizing project involvement by rank and importance</CardDescription>
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
              <BumpChart data={data} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Process data for bump chart
function processDataForBumpChart(billingData: any[]) {
  // Group data by project and month
  const projectMonthHours = new Map()

  billingData.forEach((entry) => {
    const projectKey = entry.project_key
    const date = new Date(entry.transfer_date)
    const month = date.toLocaleString("default", { month: "short" })
    const hours = Number.parseFloat(entry.regular_hours) || 0

    const key = `${projectKey}-${month}`
    projectMonthHours.set(key, (projectMonthHours.get(key) || 0) + hours)
  })

  // Get unique projects and months
  const projects = [...new Set(billingData.map((entry) => entry.project_key))]
  const months = [
    ...new Set(
      billingData.map((entry) => {
        const date = new Date(entry.transfer_date)
        return date.toLocaleString("default", { month: "short" })
      }),
    ),
  ]

  // Sort months chronologically
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))

  // For each month, rank projects by hours
  const projectRanksByMonth = new Map()

  months.forEach((month) => {
    const projectHours = projects.map((project) => ({
      project,
      hours: projectMonthHours.get(`${project}-${month}`) || 0,
    }))

    // Sort projects by hours for this month
    projectHours.sort((a, b) => b.hours - a.hours)

    // Assign ranks (1 is highest)
    projectHours.forEach((item, index) => {
      const key = `${item.project}-${month}`
      projectRanksByMonth.set(key, index + 1)
    })
  })

  // Format data for the bump chart
  return projects
    .map((project) => {
      return {
        id: `Project ${project}`,
        data: months
          .map((month) => ({
            x: month,
            y: projectRanksByMonth.get(`${project}-${month}`) || null,
          }))
          .filter((item) => item.y !== null), // Remove months with no data
      }
    })
    .filter((series) => series.data.length > 0) // Remove projects with no data
}
