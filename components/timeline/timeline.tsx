"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineFilters } from "./timeline-filters"
import { TimelineView } from "./timeline-view"
import { TimelineGantt } from "./timeline-gantt"

export function Timeline() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Timeline</h1>
          <p className="text-muted-foreground">Interactive timeline view of all project activities and assignments.</p>
        </div>
        <TimelineFilters />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline View</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <TimelineView />
            </TabsContent>
            <TabsContent value="gantt">
              <TimelineGantt />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

