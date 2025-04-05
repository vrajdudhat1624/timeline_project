"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Original project data
const allProjectData = [
  { month: "Jan", completed: 4, active: 6, planned: 2 },
  { month: "Feb", completed: 3, active: 7, planned: 3 },
  { month: "Mar", completed: 5, active: 8, planned: 4 },
  { month: "Apr", completed: 6, active: 9, planned: 2 },
  { month: "May", completed: 8, active: 7, planned: 3 },
  { month: "Jun", completed: 7, active: 8, planned: 5 },
  { month: "Jul", completed: 9, active: 6, planned: 4 },
  { month: "Aug", completed: 8, active: 7, planned: 3 },
  { month: "Sep", completed: 10, active: 5, planned: 2 },
  { month: "Oct", completed: 12, active: 4, planned: 3 },
  { month: "Nov", completed: 11, active: 5, planned: 4 },
  { month: "Dec", completed: 13, active: 3, planned: 2 },
]

// Team member specific data
const teamMemberData = {
  all: allProjectData,
  alex: [
    { month: "Jan", completed: 2, active: 3, planned: 1 },
    { month: "Feb", completed: 1, active: 4, planned: 2 },
    { month: "Mar", completed: 3, active: 3, planned: 1 },
    { month: "Apr", completed: 2, active: 4, planned: 1 },
    { month: "May", completed: 4, active: 3, planned: 2 },
    { month: "Jun", completed: 3, active: 4, planned: 2 },
    { month: "Jul", completed: 5, active: 2, planned: 1 },
    { month: "Aug", completed: 4, active: 3, planned: 1 },
    { month: "Sep", completed: 5, active: 2, planned: 1 },
    { month: "Oct", completed: 6, active: 2, planned: 1 },
    { month: "Nov", completed: 5, active: 3, planned: 2 },
    { month: "Dec", completed: 7, active: 1, planned: 1 },
  ],
  maria: [
    { month: "Jan", completed: 1, active: 2, planned: 1 },
    { month: "Feb", completed: 1, active: 2, planned: 1 },
    { month: "Mar", completed: 1, active: 3, planned: 2 },
    { month: "Apr", completed: 2, active: 3, planned: 1 },
    { month: "May", completed: 2, active: 2, planned: 1 },
    { month: "Jun", completed: 2, active: 3, planned: 2 },
    { month: "Jul", completed: 3, active: 2, planned: 2 },
    { month: "Aug", completed: 2, active: 3, planned: 1 },
    { month: "Sep", completed: 3, active: 2, planned: 1 },
    { month: "Oct", completed: 4, active: 1, planned: 1 },
    { month: "Nov", completed: 3, active: 1, planned: 1 },
    { month: "Dec", completed: 4, active: 1, planned: 1 },
  ],
  david: [
    { month: "Jan", completed: 1, active: 1, planned: 0 },
    { month: "Feb", completed: 1, active: 1, planned: 0 },
    { month: "Mar", completed: 1, active: 2, planned: 1 },
    { month: "Apr", completed: 2, active: 2, planned: 0 },
    { month: "May", completed: 2, active: 2, planned: 0 },
    { month: "Jun", completed: 2, active: 1, planned: 1 },
    { month: "Jul", completed: 1, active: 2, planned: 1 },
    { month: "Aug", completed: 2, active: 1, planned: 1 },
    { month: "Sep", completed: 2, active: 1, planned: 0 },
    { month: "Oct", completed: 2, active: 1, planned: 1 },
    { month: "Nov", completed: 3, active: 1, planned: 1 },
    { month: "Dec", completed: 2, active: 1, planned: 0 },
  ],
}

const resourceData = [
  { department: "Engineering", allocated: 85, utilized: 78 },
  { department: "Design", allocated: 75, utilized: 70 },
  { department: "Marketing", allocated: 65, utilized: 60 },
  { department: "Sales", allocated: 55, utilized: 50 },
  { department: "Operations", allocated: 45, utilized: 42 },
]

// Team member specific resource data
const teamMemberResourceData = {
  all: resourceData,
  alex: [
    { department: "Engineering", allocated: 90, utilized: 85 },
    { department: "Design", allocated: 70, utilized: 65 },
    { department: "Marketing", allocated: 60, utilized: 55 },
    { department: "Sales", allocated: 50, utilized: 45 },
    { department: "Operations", allocated: 40, utilized: 38 },
  ],
  maria: [
    { department: "Engineering", allocated: 80, utilized: 75 },
    { department: "Design", allocated: 85, utilized: 80 },
    { department: "Marketing", allocated: 70, utilized: 65 },
    { department: "Sales", allocated: 60, utilized: 55 },
    { department: "Operations", allocated: 50, utilized: 45 },
  ],
  david: [
    { department: "Engineering", allocated: 95, utilized: 90 },
    { department: "Design", allocated: 65, utilized: 60 },
    { department: "Marketing", allocated: 55, utilized: 50 },
    { department: "Sales", allocated: 45, utilized: 40 },
    { department: "Operations", allocated: 35, utilized: 30 },
  ],
}

export function ProjectsChart() {
  const [selectedTeamMember, setSelectedTeamMember] = useState("all")

  // Get the appropriate data based on the selected team member
  const projectData = teamMemberData[selectedTeamMember as keyof typeof teamMemberData] || allProjectData
  const resourceDataFiltered =
    teamMemberResourceData[selectedTeamMember as keyof typeof teamMemberResourceData] || resourceData

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Analytics</CardTitle>
        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Team Member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            <SelectItem value="alex">Alex Johnson</SelectItem>
            <SelectItem value="maria">Maria Garcia</SelectItem>
            <SelectItem value="david">David Kim</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Project Trends</TabsTrigger>
            <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          </TabsList>
          <TabsContent value="trends">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    name="Active"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorActive)"
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name="Planned"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorPlanned)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="resources">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceDataFiltered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated (%)" fill="#3b82f6" />
                  <Bar dataKey="utilized" name="Utilized (%)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

