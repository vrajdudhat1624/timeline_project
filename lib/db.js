// This is a client-side adaptation of the database.js file
// In a real Next.js app, we would use a proper database client
// that works with the Edge runtime or use an external database service

import { cache } from "react"

// Mock database with sample data based on the schema from the provided files
const mockProjects = [
  {
    id: "1",
    project_key: "WEB-REDESIGN",
    name: "Website Redesign",
    status: "at-risk",
    progress: 75,
    dueDate: "2023-12-15",
    project_leader: "Alex Johnson",
    source: "internal",
    team: [
      { name: "Alex Johnson", avatar: "AJ", employee_id: "EMP001" },
      { name: "Maria Garcia", avatar: "MG", employee_id: "EMP002" },
      { name: "David Kim", avatar: "DK", employee_id: "EMP003" },
    ],
    priority: "high",
    description: "Complete overhaul of the company website with new design system",
  },
  {
    id: "2",
    project_key: "MOBILE-APP",
    name: "Mobile App Development",
    status: "active",
    progress: 45,
    dueDate: "2024-01-30",
    project_leader: "Sarah Lee",
    source: "client",
    team: [
      { name: "Sarah Lee", avatar: "SL", employee_id: "EMP004" },
      { name: "James Wilson", avatar: "JW", employee_id: "EMP005" },
    ],
    priority: "medium",
    description: "Develop a new mobile app for iOS and Android platforms",
  },
  {
    id: "3",
    project_key: "BRAND-ID",
    name: "Brand Identity",
    status: "completed",
    progress: 100,
    dueDate: "2023-11-10",
    project_leader: "Emma Davis",
    source: "client",
    team: [
      { name: "Emma Davis", avatar: "ED", employee_id: "EMP006" },
      { name: "Michael Brown", avatar: "MB", employee_id: "EMP007" },
    ],
    priority: "medium",
    description: "Create a new brand identity including logo and style guide",
  },
  {
    id: "4",
    project_key: "MKTG-CAMPAIGN",
    name: "Marketing Campaign",
    status: "at-risk",
    progress: 30,
    dueDate: "2024-02-28",
    project_leader: "Olivia Martinez",
    source: "internal",
    team: [
      { name: "Olivia Martinez", avatar: "OM", employee_id: "EMP008" },
      { name: "William Taylor", avatar: "WT", employee_id: "EMP009" },
      { name: "Sophia Anderson", avatar: "SA", employee_id: "EMP010" },
    ],
    priority: "high",
    description: "Q1 marketing campaign for new product launch",
  },
  {
    id: "5",
    project_key: "PROD-LAUNCH",
    name: "Product Launch",
    status: "on-hold",
    progress: 60,
    dueDate: "2024-03-15",
    project_leader: "Daniel Thomas",
    source: "client",
    team: [
      { name: "Daniel Thomas", avatar: "DT", employee_id: "EMP011" },
      { name: "Isabella White", avatar: "IW", employee_id: "EMP012" },
    ],
    priority: "high",
    description: "Launch of new product line with marketing and sales coordination",
  },
]

const mockEmployees = [
  {
    employee_id: "EMP001",
    name: "Alex Johnson",
    avatar: "AJ",
    role: "Project Manager",
    department: "Management",
    status: "available",
    activeProjects: 3,
    completedProjects: 12,
    utilization: 85,
    joinDate: "2020-03-15",
  },
  {
    employee_id: "EMP002",
    name: "Maria Garcia",
    avatar: "MG",
    role: "UX Designer",
    department: "Design",
    status: "busy",
    activeProjects: 2,
    completedProjects: 8,
    utilization: 90,
    joinDate: "2021-06-10",
  },
  {
    employee_id: "EMP003",
    name: "David Kim",
    avatar: "DK",
    role: "Developer",
    department: "Engineering",
    status: "available",
    activeProjects: 4,
    completedProjects: 15,
    utilization: 95,
    joinDate: "2019-11-05",
  },
  {
    employee_id: "EMP004",
    name: "Sarah Lee",
    avatar: "SL",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "away",
    activeProjects: 1,
    completedProjects: 7,
    utilization: 75,
    joinDate: "2022-01-20",
  },
]

const mockBilling = [
  {
    id: 1,
    project_key: "WEB-REDESIGN",
    employee_id: "EMP001",
    transfer_date: "2023-11-01",
    regular_hours: 40,
    overtime_hours: 5,
    category: "development",
  },
  {
    id: 2,
    project_key: "WEB-REDESIGN",
    employee_id: "EMP002",
    transfer_date: "2023-11-01",
    regular_hours: 35,
    overtime_hours: 0,
    category: "design",
  },
  {
    id: 3,
    project_key: "MOBILE-APP",
    employee_id: "EMP003",
    transfer_date: "2023-11-01",
    regular_hours: 38,
    overtime_hours: 2,
    category: "development",
  },
]

// Cached data fetching functions
export const getProjects = cache(async (filter = null) => {
  // In a real app, this would be a database query
  let filteredProjects = [...mockProjects]

  if (filter) {
    if (filter === "active") {
      filteredProjects = filteredProjects.filter((p) => p.status === "active")
    } else if (filter === "completed") {
      filteredProjects = filteredProjects.filter((p) => p.status === "completed")
    } else if (filter === "at-risk") {
      filteredProjects = filteredProjects.filter((p) => p.status === "at-risk")
    }
  }

  return filteredProjects
})

export const getProjectById = cache(async (projectId) => {
  // In a real app, this would be a database query
  return mockProjects.find((p) => p.id === projectId || p.project_key === projectId)
})

export const getEmployees = cache(async () => {
  // In a real app, this would be a database query
  return mockEmployees
})

export const getEmployeeById = cache(async (employeeId) => {
  // In a real app, this would be a database query
  return mockEmployees.find((e) => e.employee_id === employeeId)
})

export const getBillingData = cache(async (projectKey = null) => {
  // In a real app, this would be a database query
  if (projectKey) {
    return mockBilling.filter((b) => b.project_key === projectKey)
  }
  return mockBilling
})

export const getProjectStats = cache(async () => {
  // In a real app, this would calculate these from the database
  return {
    total: mockProjects.length,
    active: mockProjects.filter((p) => p.status === "active").length,
    completed: mockProjects.filter((p) => p.status === "completed").length,
    atRisk: mockProjects.filter((p) => p.status === "at-risk").length,
    teamMembers: mockEmployees.length,
    utilization: 87, // This would be calculated from actual data
  }
})

export const getTimelineData = cache(async () => {
  // In a real app, this would be generated from project tasks in the database
  const today = new Date()

  return mockProjects.map((project) => {
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - Math.floor(Math.random() * 10))

    const endDate = new Date(today)
    endDate.setDate(today.getDate() + Math.floor(Math.random() * 20))

    return {
      id: project.id,
      projectId: project.project_key,
      projectName: project.name,
      task: `${project.name} Development`,
      assignee: {
        name: project.project_leader,
        avatar: project.project_leader
          .split(" ")
          .map((n) => n[0])
          .join(""),
      },
      startDate,
      endDate,
      status:
        project.status === "completed" ? "completed" : project.status === "active" ? "in-progress" : "not-started",
    }
  })
})

// User profile and settings
export const getUserProfile = cache(async () => {
  // In a real app, this would come from an authentication system
  return {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Project Manager",
    avatar: "JD",
    theme: "system",
    notifications: {
      email: true,
      push: false,
      projectUpdates: true,
      teamActivity: true,
      reminders: false,
    },
  }
})

export const updateUserProfile = async (data) => {
  // In a real app, this would update the user profile in the database
  console.log("Updating user profile:", data)
  return { success: true }
}

export const getThemePreference = () => {
  // In a real app, this might come from the database or local storage
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "system"
  }
  return "system"
}

export const setThemePreference = (theme) => {
  // In a real app, this might update the database
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme)
  }
}
