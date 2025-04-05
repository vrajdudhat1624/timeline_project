"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  status: "available" | "busy" | "away"
  activeProjects: number
  completedProjects: number
  department: string
  utilization: number
  joinDate: string
}

// Extended team member data for detailed view
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Project Manager",
    avatar: "AJ",
    email: "alex.johnson@example.com",
    status: "available",
    activeProjects: 3,
    completedProjects: 12,
    department: "Management",
    utilization: 85,
    joinDate: "2020-03-15",
  },
  {
    id: "2",
    name: "Maria Garcia",
    role: "UX Designer",
    avatar: "MG",
    email: "maria.garcia@example.com",
    status: "busy",
    activeProjects: 2,
    completedProjects: 8,
    department: "Design",
    utilization: 90,
    joinDate: "2021-06-10",
  },
  {
    id: "3",
    name: "David Kim",
    role: "Developer",
    avatar: "DK",
    email: "david.kim@example.com",
    status: "available",
    activeProjects: 4,
    completedProjects: 15,
    department: "Engineering",
    utilization: 95,
    joinDate: "2019-11-05",
  },
  {
    id: "4",
    name: "Sarah Lee",
    role: "Marketing Specialist",
    avatar: "SL",
    email: "sarah.lee@example.com",
    status: "away",
    activeProjects: 1,
    completedProjects: 7,
    department: "Marketing",
    utilization: 75,
    joinDate: "2022-01-20",
  },
  {
    id: "5",
    name: "James Wilson",
    role: "QA Engineer",
    avatar: "JW",
    email: "james.wilson@example.com",
    status: "available",
    activeProjects: 2,
    completedProjects: 9,
    department: "Engineering",
    utilization: 80,
    joinDate: "2021-04-12",
  },
  {
    id: "6",
    name: "Emma Davis",
    role: "Graphic Designer",
    avatar: "ED",
    email: "emma.davis@example.com",
    status: "busy",
    activeProjects: 3,
    completedProjects: 6,
    department: "Design",
    utilization: 85,
    joinDate: "2022-03-01",
  },
  {
    id: "7",
    name: "Michael Brown",
    role: "Frontend Developer",
    avatar: "MB",
    email: "michael.brown@example.com",
    status: "available",
    activeProjects: 2,
    completedProjects: 11,
    department: "Engineering",
    utilization: 90,
    joinDate: "2020-09-15",
  },
  {
    id: "8",
    name: "Olivia Martinez",
    role: "Content Strategist",
    avatar: "OM",
    email: "olivia.martinez@example.com",
    status: "away",
    activeProjects: 1,
    completedProjects: 5,
    department: "Marketing",
    utilization: 70,
    joinDate: "2022-07-10",
  },
]

export function DetailedTeamMembers() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter((member) => {
    if (searchTerm) {
      return (
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search team members..."
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
                <TableHead>Team Member</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        member.status === "available"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                          : member.status === "busy"
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Active</span>
                        <span className="text-xs font-medium">{member.activeProjects}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Completed</span>
                        <span className="text-xs font-medium">{member.completedProjects}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Total</span>
                        <span className="text-xs font-medium">{member.activeProjects + member.completedProjects}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.utilization} className="h-2 w-[60px]" />
                      <span className="text-xs">{member.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

