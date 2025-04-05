import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Project {
  id: string
  name: string
  status: "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  team: {
    name: string
    avatar: string
  }[]
  priority: "low" | "medium" | "high"
}

const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    status: "active",
    progress: 75,
    dueDate: "2023-12-15",
    team: [
      { name: "Alex Johnson", avatar: "AJ" },
      { name: "Maria Garcia", avatar: "MG" },
      { name: "David Kim", avatar: "DK" },
    ],
    priority: "high",
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
  },
  {
    id: "4",
    name: "Marketing Campaign",
    status: "active",
    progress: 30,
    dueDate: "2024-02-28",
    team: [
      { name: "Olivia Martinez", avatar: "OM" },
      { name: "William Taylor", avatar: "WT" },
      { name: "Sophia Anderson", avatar: "SA" },
    ],
    priority: "high",
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
  },
]

interface ProjectsListProps {
  filter: "all" | "active" | "completed"
}

export function ProjectsList({ filter }: ProjectsListProps) {
  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true
    if (filter === "active") return project.status === "active"
    if (filter === "completed") return project.status === "completed"
    return true
  })

  return (
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
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  project.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    : project.status === "completed"
                      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                }
              >
                {project.status === "active" ? "Active" : project.status === "completed" ? "Completed" : "On Hold"}
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
  )
}

