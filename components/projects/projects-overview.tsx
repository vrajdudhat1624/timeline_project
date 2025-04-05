"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectMetrics } from "./project-metrics"
import { ProjectsList } from "./projects-list"
import { TeamMembers } from "./team-members"
import { ProjectsChart } from "./projects-chart"
import { ProjectFilters } from "./project-filters"
import { DetailedProjects } from "./detailed-projects"
import { DetailedTeamMembers } from "./detailed-team-members"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function ProjectsOverview() {
  const [activeTab, setActiveTab] = useState("all")
  const [detailedView, setDetailedView] = useState<string | null>(null)

  // Handle back button click
  const handleBack = () => {
    setDetailedView(null)
  }

  // Render the appropriate detailed view based on the selection
  if (detailedView) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {detailedView === "total" && "All Projects"}
            {detailedView === "active" && "Active Projects"}
            {detailedView === "completed" && "Completed Projects"}
            {detailedView === "at-risk" && "At Risk Projects"}
            {detailedView === "team" && "Team Members"}
          </h1>
        </div>

        {(detailedView === "total" ||
          detailedView === "active" ||
          detailedView === "completed" ||
          detailedView === "at-risk") && <DetailedProjects filter={detailedView === "total" ? "all" : detailedView} />}

        {detailedView === "team" && <DetailedTeamMembers />}
      </div>
    )
  }

  // Default dashboard view
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor all your project activities in one place.</p>
        </div>
        <ProjectFilters />
      </div>

      <ProjectMetrics onMetricClick={setDetailedView} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  All Projects
                </TabsTrigger>
                <TabsTrigger value="active" onClick={() => setActiveTab("active")}>
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>
                  Completed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <ProjectsList filter="all" />
              </TabsContent>
              <TabsContent value="active" className="space-y-4">
                <ProjectsList filter="active" />
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <ProjectsList filter="completed" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <TeamMembers onViewAll={() => setDetailedView("team")} />
        </div>
      </div>

      <ProjectsChart />
    </div>
  )
}

