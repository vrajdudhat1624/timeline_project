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
          <CardDescription>Visualizing project relationships and connections</CardDescription>
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
  const nodes = new Set<string>()
  const links = new Set<string>()
  const nodeMap = new Map<string, { id: string, group: number, value: number }>()
  const linkMap = new Map<string, { source: string, target: string, value: number }>()

  billingData.forEach((entry) => {
    // Add employee node
    const employeeId = `Employee_${entry.employee_id}`
    if (!nodeMap.has(employeeId)) {
      nodeMap.set(employeeId, { id: employeeId, group: 1, value: 1 })
    }

    // Add project node
    const projectId = `Project_${entry.project_key}`
    if (!nodeMap.has(projectId)) {
      nodeMap.set(projectId, { id: projectId, group: 2, value: 1 })
    }

    // Add link
    const linkKey = `${employeeId}-${projectId}`
    if (!linkMap.has(linkKey)) {
      linkMap.set(linkKey, { source: employeeId, target: projectId, value: 1 })
    } else {
      linkMap.get(linkKey)!.value += 1
    }
  })

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values())
  }
}
