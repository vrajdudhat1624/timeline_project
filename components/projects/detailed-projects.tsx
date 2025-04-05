"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface Project {
  id: string
  name: string
  status: "active" | "completed" | "on-hold" | "at-risk"
  progress: number
  dueDate: string
  team: {
    name: string
    avatar: string
  }[]
  priority: "low" | "medium" | "high"
  description: string
}

// Extended project data for detailed view
const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    status: "at-risk",
    progress: 75,
    dueDate: "2023-12-15",
    team: [
      { name: "Alex Johnson", avatar: "AJ" },
      { name: "Maria Garcia", avatar: "MG" },
      { name: "David Kim", avatar: "DK" },
    ],
    priority: "high",
    description: "Complete overhaul of the company website with new design system",
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "active",
    progress: 45,
    dueDate: "2024-01-30",
    team: [
      { name: "Sarah Lee", avatar: "SL" },
      { name: "James Wilson", avatar: "JW" },
    ],
    priority: "medium",
    description: "Develop a new mobile app for iOS and Android platforms",
  },
  {
    id: "3",
    name: "Brand Identity",
    status: "completed",
    progress: 100,
    dueDate: "2023-11-10",
    team: [
      { name: "Emma Davis", avatar: "ED" },
      { name: "Michael Brown", avatar: "MB" },
    ],
    priority: "medium",
    description: "Create a new brand identity including logo and style guide",
  },
  {
    id: "4",
    name: "Marketing Campaign",
    status: "at-risk",
    progress: 30,
    dueDate: "2024-02-28",
    team: [
      { name: "Olivia Martinez", avatar: "OM" },
      { name: "William Taylor", avatar: "WT" },
      { name: "Sophia Anderson", avatar: "SA" },
    ],
    priority: "high",
    description: "Q1 marketing campaign for new product launch",
  },
  {
    id: "5",
    name: "Product Launch",
    status: "on-hold",
    progress: 60,
    dueDate: "2024-03-15",
    team: [
      { name: "Daniel Thomas", avatar: "DT" },
      { name: "Isabella White", avatar: "IW" },
    ],
    priority: "high",
    description: "Launch of new product line with marketing and sales coordination",
  },
  {
    id: "6",
    name: "CRM Implementation",
    status: "active",
    progress: 35,
    dueDate: "2024-04-10",
    team: [
      { name: "Noah Martin", avatar: "NM" },
      { name: "Ava Thompson", avatar: "AT" },
    ],
    priority: "medium",
    description: "Implementation of new customer relationship management system",
  },
  {
    id: "7",
    name: "Office Relocation",
    status: "on-hold",
    progress: 20,
    dueDate: "2024-05-20",
    team: [
      { name: "Liam Johnson", avatar: "LJ" },
      { name: "Charlotte Brown", avatar: "CB" },
    ],
    priority: "low",
    description: "Planning and execution of office move to new location",
  },
  {
    id: "8",
    name: "Annual Report",
    status: "completed",
    progress: 100,
    dueDate: "2023-10-30",
    team: [
      { name: "Ethan Wilson", avatar: "EW" },
      { name: "Amelia Davis", avatar: "AD" },
    ],
    priority: "high",
    description: "Preparation and publication of annual company report",
  },
  {
    id: "9",
    name: "Security Audit",
    status: "at-risk",
    progress: 50,
    dueDate: "2023-12-20",
    team: [
      { name: "Benjamin Moore", avatar: "BM" },
      { name: "Mia Jackson", avatar: "MJ" },
    ],
    priority: "high",
    description: "Comprehensive security audit of all systems and infrastructure",
  },
]

interface DetailedProjectsProps {
  filter: "all" | "active" | "completed" | "at-risk"
}

export function DetailedProjects({ filter }: DetailedProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter((project) => {
    // Apply status filter
    if (filter !== "all") {
      if (filter === "at-risk" && project.status !== "at-risk") return false
      if (filter === "active" && project.status !== "active") return false
      if (filter === "completed" && project.status !== "completed") return false
    }

    // Apply search filter
    if (searchTerm) {
      return (
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        project.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                          : project.status === "completed"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                            : project.status === "at-risk"
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                      }
                    >
                      {project.status === "active"
                        ? "Active"
                        : project.status === "completed"
                          ? "Completed"
                          : project.status === "at-risk"
                            ? "At Risk"
                            : "On Hold"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-2 w-[60px]" />
                      <span className="text-xs">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {project.team.map((member, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-[10px]">{member.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        project.priority === "high"
                          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                          : project.priority === "medium"
                            ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800"
                            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      }
                    >
                      {project.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

