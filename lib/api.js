// Real API utilities to fetch data from the backend server with mock data fallback

// Base API URL
const API_BASE_URL = "http://localhost:3300/api"

// Flag to track if we're using mock data - set to true by default for preview environment
let usingMockData = true

// Mock data for when the API server is not available
const mockProjects = [
  {
    id: "1",
    project_key: "WEB-REDESIGN",
    name: "Website Redesign",
    status: "At Risk",
    progress: 75,
    dueDate: "2023-12-15",
    end_date: "2023-12-15",
    project_leader: "Alex Johnson",
    source: "internal",
    priority: "high",
    description: "Complete overhaul of the company website with new design system",
  },
  {
    id: "2",
    project_key: "MOBILE-APP",
    name: "Mobile App Development",
    status: "Active",
    progress: 45,
    dueDate: "2024-01-30",
    end_date: "2024-01-30",
    project_leader: "Sarah Lee",
    source: "client",
    priority: "medium",
    description: "Develop a new mobile app for iOS and Android platforms",
  },
  {
    id: "3",
    project_key: "BRAND-ID",
    name: "Brand Identity",
    status: "Completed",
    progress: 100,
    dueDate: "2023-11-10",
    end_date: "2023-11-10",
    project_leader: "Emma Davis",
    source: "client",
    priority: "medium",
    description: "Create a new brand identity including logo and style guide",
  },
  {
    id: "4",
    project_key: "MKTG-CAMPAIGN",
    name: "Marketing Campaign",
    status: "At Risk",
    progress: 30,
    dueDate: "2024-02-28",
    end_date: "2024-02-28",
    project_leader: "Olivia Martinez",
    source: "internal",
    priority: "high",
    description: "Q1 marketing campaign for new product launch",
  },
  {
    id: "5",
    project_key: "PROD-LAUNCH",
    name: "Product Launch",
    status: "On Hold",
    progress: 60,
    dueDate: "2024-03-15",
    end_date: "2024-03-15",
    project_leader: "Daniel Thomas",
    source: "client",
    priority: "high",
    description: "Launch of new product line with marketing and sales coordination",
  },
]

const mockEmployees = [
  {
    employee_id: "EMP001",
    name: "Alex Johnson",
    role: "Project Manager",
    department: "Management",
    status: "available",
    activeProjects: 3,
    completedProjects: 12,
    utilization: 85,
  },
  {
    employee_id: "EMP002",
    name: "Maria Garcia",
    role: "UX Designer",
    department: "Design",
    status: "busy",
    activeProjects: 2,
    completedProjects: 8,
    utilization: 90,
  },
  {
    employee_id: "EMP003",
    name: "David Kim",
    role: "Developer",
    department: "Engineering",
    status: "available",
    activeProjects: 4,
    completedProjects: 15,
    utilization: 95,
  },
  {
    employee_id: "EMP004",
    name: "Sarah Lee",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "away",
    activeProjects: 1,
    completedProjects: 7,
    utilization: 75,
  },
]

// Helper function for API requests with error handling and mock data fallback
async function apiRequest(endpoint, options = {}) {
  // Always use mock data in preview environment
  if (usingMockData) {
    return getMockData(endpoint)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Set the flag to use mock data for future requests
    usingMockData = true

    console.warn(`API server unavailable. Using mock data for ${endpoint}`)
    return getMockData(endpoint)
  }
}

// Function to return appropriate mock data based on the endpoint
function getMockData(endpoint) {
  // Parse the endpoint to determine what data to return
  if (endpoint.startsWith("/projects")) {
    if (endpoint.includes("?")) {
      // Handle query parameters for filtering
      const params = new URLSearchParams(endpoint.split("?")[1])
      const status = params.get("status")

      if (status) {
        return mockProjects.filter((p) => p.status.toLowerCase() === status.toLowerCase())
      }
    }

    // If it's a specific project request
    const projectMatch = endpoint.match(/\/projects\/([^/?]+)/)
    if (projectMatch && projectMatch[1]) {
      const projectKey = projectMatch[1]
      return mockProjects.find((p) => p.project_key === projectKey || p.id === projectKey) || null
    }

    // Return all projects
    return mockProjects
  }

  if (endpoint.startsWith("/employees")) {
    if (endpoint.includes("/stats")) {
      // Return employee stats
      return mockEmployees.map((emp) => ({
        employee_id: emp.employee_id,
        category: emp.department,
        project_count: emp.activeProjects,
        total_hours: emp.utilization * 1.6, // Mock calculation
      }))
    }

    // If it's a specific employee request
    const employeeMatch = endpoint.match(/\/employees\/([^/?]+)/)
    if (employeeMatch && employeeMatch[1]) {
      const employeeId = employeeMatch[1]
      return mockEmployees.find((e) => e.employee_id === employeeId) || null
    }

    // Return all employees
    return mockEmployees
  }

  // Default empty response
  return []
}

// Projects API
export async function fetchProjects(filter = null, page = 1, limit = 10) {
  try {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() })

    if (filter === "active") {
      queryParams.append("status", "Active")
    } else if (filter === "completed") {
      queryParams.append("status", "Completed")
    } else if (filter === "at-risk") {
      queryParams.append("status", "At Risk")
    }

    const result = await apiRequest(`/projects?${queryParams.toString()}`)
    return Array.isArray(result) ? result : result.data || []
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    // Return empty array instead of throwing
    return []
  }
}

export async function fetchProjectById(projectKey) {
  try {
    return await apiRequest(`/projects/${projectKey}`)
  } catch (error) {
    console.error(`Failed to fetch project ${projectKey}:`, error)
    return null
  }
}

export async function fetchProjectStats() {
  try {
    // Fetch all projects
    const projects = await apiRequest("/projects")

    // Extract the projects array from the response
    const projectsArray = Array.isArray(projects)
      ? projects
      : projects.data && Array.isArray(projects.data)
        ? projects.data
        : []

    // Process the stats to match our dashboard format
    const projectStats = {
      total: projectsArray.length,
      active: projectsArray.filter((p) => p.status === "Active" || p.status === "active").length,
      completed: projectsArray.filter((p) => p.status === "Completed" || p.status === "completed").length,
      atRisk: projectsArray.filter(
        (p) => p.status === "At Risk" || p.status === "at-risk" || p.status === "At risk" || p.status === "at risk",
      ).length,
      teamMembers: calculateUniqueTeamMembers(projectsArray),
      utilization: calculateUtilization(projectsArray),
    }

    return projectStats
  } catch (error) {
    console.error("Failed to fetch project stats:", error)
    // Return default values instead of throwing
    return {
      total: mockProjects.length,
      active: mockProjects.filter((p) => p.status === "Active").length,
      completed: mockProjects.filter((p) => p.status === "Completed").length,
      atRisk: mockProjects.filter((p) => p.status === "At Risk").length,
      teamMembers: mockEmployees.length,
      utilization: 75,
    }
  }
}

// Helper function to calculate unique team members across projects
function calculateUniqueTeamMembers(projects) {
  if (!projects || projects.length === 0) return 0

  // Create a Set of unique employee IDs or project leaders
  const uniqueMembers = new Set()

  projects.forEach((project) => {
    // Add project leader if available
    if (project.project_leader) {
      uniqueMembers.add(project.project_leader)
    }

    // Add team members if available
    if (project.team && Array.isArray(project.team)) {
      project.team.forEach((member) => {
        if (member.employee_id) {
          uniqueMembers.add(member.employee_id)
        } else if (member.name) {
          uniqueMembers.add(member.name)
        }
      })
    }
  })

  // If we couldn't find any team members, return a default value
  return uniqueMembers.size > 0 ? uniqueMembers.size : mockEmployees.length
}

// Helper function to calculate utilization percentage
function calculateUtilization(projects) {
  if (!projects || projects.length === 0) return 0

  // Count active projects as a percentage of total
  const activeProjects = projects.filter(
    (p) => p.status === "Active" || p.status === "active" || p.status === "In Progress" || p.status === "in-progress",
  ).length

  // Calculate utilization as percentage of active projects
  return Math.round((activeProjects / projects.length) * 100)
}

// Employees API
export async function fetchEmployees() {
  try {
    // Get employee stats which includes all employees
    const employeeStats = await apiRequest("/employees/stats?timeframe=monthly")

    // If we got an array of employee stats
    if (Array.isArray(employeeStats) && employeeStats.length > 0) {
      // Process the data to match our dashboard format
      const employees = []
      const employeeMap = new Map()

      employeeStats.forEach((stat) => {
        if (!employeeMap.has(stat.employee_id)) {
          employeeMap.set(stat.employee_id, {
            employee_id: stat.employee_id,
            name: `Employee ${stat.employee_id}`, // API doesn't provide names, using ID as placeholder
            avatar: stat.employee_id.toString().substring(0, 2).toUpperCase(),
            role: stat.category || "Staff",
            department: stat.category || "General",
            status: "available",
            activeProjects: 0,
            completedProjects: 0,
            utilization: 0,
            joinDate: new Date().toISOString().split("T")[0], // Placeholder
          })
        }

        // Update employee data
        const employee = employeeMap.get(stat.employee_id)
        employee.activeProjects = Math.max(employee.activeProjects, stat.project_count || 0)

        // Calculate utilization based on hours
        if (stat.total_hours) {
          // Assuming 40 hours per week is 100% utilization
          const utilization = Math.min(100, Math.round((stat.total_hours / 160) * 100)) // 160 hours per month
          employee.utilization = Math.max(employee.utilization, utilization)
        }
      })

      return Array.from(employeeMap.values())
    } else {
      // If we didn't get valid employee stats, return mock data
      return mockEmployees
    }
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return mockEmployees
  }
}

export async function fetchEmployeeById(employeeId) {
  try {
    const records = await apiRequest(`/employees/${employeeId}/records`)

    // Process the data to match our dashboard format
    if (records && Array.isArray(records) && records.length > 0) {
      // Extract employee details from the first record
      const firstRecord = records[0]
      return {
        employee_id: employeeId,
        name: `Employee ${employeeId}`, // API doesn't provide names, using ID as placeholder
        avatar: employeeId.toString().substring(0, 2).toUpperCase(),
        role: firstRecord.category || "Staff",
        department: firstRecord.category || "General",
        status: "available",
        activeProjects: new Set(records.map((r) => r.project_key)).size,
        completedProjects: 0, // Not provided by API
        utilization: calculateEmployeeUtilization(records),
        joinDate: new Date().toISOString().split("T")[0], // Placeholder
        records: records,
      }
    } else {
      // Return mock employee if no records found
      const mockEmployee = mockEmployees.find((e) => e.employee_id === employeeId)
      return (
        mockEmployee || {
          employee_id: employeeId,
          name: `Employee ${employeeId}`,
          avatar: employeeId.substring(0, 2).toUpperCase(),
          role: "Staff",
          department: "General",
          status: "available",
          activeProjects: 1,
          completedProjects: 0,
          utilization: 75,
          joinDate: new Date().toISOString().split("T")[0],
          records: [],
        }
      )
    }
  } catch (error) {
    console.error(`Failed to fetch employee ${employeeId}:`, error)
    // Return mock employee
    const mockEmployee = mockEmployees.find((e) => e.employee_id === employeeId)
    return mockEmployee || null
  }
}

// Helper function to calculate employee utilization
function calculateEmployeeUtilization(records) {
  if (!records || records.length === 0) return 0

  const totalHours = records.reduce((sum, record) => sum + (record.regular_hours || 0), 0)
  // Assuming 40 hours per week is 100% utilization
  return Math.min(100, Math.round((totalHours / (records.length * 40)) * 100))
}

// Timeline API
export async function fetchTimelineData() {
  try {
    // Get all projects to build timeline
    const projects = await fetchProjects(null, 1, 100)

    // Process projects into timeline events
    return projects.map((project) => {
      // Calculate start and end dates based on project data
      const today = new Date()
      let startDate, endDate

      if (project.start_date) {
        startDate = new Date(project.start_date)
      } else {
        // If no start date, use a date in the past
        startDate = new Date(today)
        startDate.setDate(today.getDate() - Math.floor(Math.random() * 30))
      }

      if (project.end_date) {
        endDate = new Date(project.end_date)
      } else {
        // If no end date, use a date in the future based on progress
        endDate = new Date(today)
        const progress = project.progress || 50
        const daysToAdd = progress < 50 ? 30 : 15
        endDate.setDate(today.getDate() + daysToAdd)
      }

      return {
        id: project.id || project.project_key,
        projectId: project.project_key,
        projectName: project.name || `Project ${project.project_key}`,
        task: `${project.name || `Project ${project.project_key}`} Development`,
        assignee: {
          name: project.project_leader || "Unassigned",
          avatar: (project.project_leader || "UA").substring(0, 2).toUpperCase(),
        },
        startDate,
        endDate,
        status:
          project.status === "Completed" ? "completed" : project.status === "Active" ? "in-progress" : "not-started",
      }
    })
  } catch (error) {
    console.error("Failed to fetch timeline data:", error)

    // Generate mock timeline data from mock projects
    const today = new Date()
    return mockProjects.map((project, index) => {
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - (10 - index * 2))

      const endDate = new Date(today)
      endDate.setDate(today.getDate() + (10 + index * 5))

      return {
        id: project.id,
        projectId: project.project_key,
        projectName: project.name,
        task: `${project.name} Development`,
        assignee: {
          name: project.project_leader,
          avatar: project.project_leader.substring(0, 2).toUpperCase(),
        },
        startDate,
        endDate,
        status:
          project.status === "Completed" ? "completed" : project.status === "Active" ? "in-progress" : "not-started",
      }
    })
  }
}

// User Profile API
// Since the API doesn't provide user profile endpoints, we'll use localStorage for persistence
export async function fetchUserProfile() {
  try {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        return JSON.parse(storedProfile)
      }
    }

    // Default profile if none exists
    const defaultProfile = {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Project Manager",
      avatar: "JD",
      theme: getTheme(),
      notifications: {
        email: true,
        push: false,
        projectUpdates: true,
        teamActivity: true,
        reminders: false,
      },
    }

    // Store the default profile
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(defaultProfile))
    }

    return defaultProfile
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    // Return a default profile
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
  }
}

export async function updateProfile(profileData) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(profileData))
    }
    return { success: true }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Unable to update profile" }
  }
}

// Theme API
export function getTheme() {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "system"
    }
    return "system"
  } catch (error) {
    console.error("Failed to get theme preference:", error)
    return "system" // Default fallback
  }
}

export function setTheme(theme) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
    }
    return { success: true }
  } catch (error) {
    console.error("Failed to set theme preference:", error)
    return { success: false, error: "Unable to save theme preference" }
  }
}
