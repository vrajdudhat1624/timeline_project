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
          <CardTitle>Project Rankings</CardTitle>
          <CardDescription>Tracking project rankings over time</CardDescription>
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
  // Group data by month and project
  const monthlyData = new Map<string, Map<string, number>>()

  billingData.forEach((entry) => {
    const date = new Date(entry.transfer_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const projectKey = entry.project_key

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, new Map())
    }

    const monthData = monthlyData.get(monthKey)!
    const hours = Number.parseFloat(entry.regular_hours) || 0
    monthData.set(projectKey, (monthData.get(projectKey) || 0) + hours)
  })

  // Convert to bump chart format
  const result: any[] = []
  monthlyData.forEach((projectHours, month) => {
    // Sort projects by hours for this month
    const sortedProjects = Array.from(projectHours.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([project, hours], index) => ({
        id: `Project ${project}`,
        data: [
          {
            x: month,
            y: index + 1,
            value: hours
          }
        ]
      }))

    result.push(...sortedProjects)
  })

  return result
}
