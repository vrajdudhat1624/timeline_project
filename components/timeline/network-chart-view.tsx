"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchEmployeeBillingData } from "@/lib/data"
import { NetworkChart } from "@/components/charts/network-chart"
import { TimelineHeader } from "@/components/timeline/timeline-header"

export function NetworkChartView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>({ nodes: [], links: [] })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch and process data
        const billingData = await fetchEmployeeBillingData()

        // Process data for network chart
        const processedData = processDataForNetworkChart(billingData)
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
          <CardTitle>Project Network</CardTitle>
          <CardDescription>Visualizing relationships between employees and projects</CardDescription>
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
              <NetworkChart data={data} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Process data for network chart
function processDataForNetworkChart(billingData: any[]) {
  // Create nodes for employee and projects
  const employeeNode = {
    id: "Employee 2185",
    group: 1,
    value: 30,
  }

  // Get unique projects
  const projectKeys = [...new Set(billingData.map((entry) => entry.project_key))]

  // Create project nodes
  const projectNodes = projectKeys.map((key) => ({
    id: `Project ${key}`,
    group: 2,
    value: 20,
  }))

  // Calculate total hours per project
  const projectHours = new Map()

  billingData.forEach((entry) => {
    const projectKey = entry.project_key
    const hours = Number.parseFloat(entry.regular_hours) || 0

    projectHours.set(projectKey, (projectHours.get(projectKey) || 0) + hours)
  })

  // Create links between employee and projects
  const links = projectKeys.map((key) => ({
    source: "Employee 2185",
    target: `Project ${key}`,
    value: Math.max(1, Math.min(10, Math.round(projectHours.get(key) / 10))),
  }))

  return {
    nodes: [employeeNode, ...projectNodes],
    links: links,
  }
}
