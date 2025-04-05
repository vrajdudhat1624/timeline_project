"use client"

import { useState } from "react"
import { ProjectsOverview } from "./projects/projects-overview"
import { Timeline } from "./timeline/timeline"
import { Settings } from "./settings/settings"
import { ThemeProvider } from "./theme-provider"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./theme-toggle"
import { LayoutDashboard, Clock, SettingsIcon, LogOut, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<"projects" | "timeline" | "settings">("projects")
  const [profileName, setProfileName] = useState("John Doe")
  const [profileRole, setProfileRole] = useState("Project Manager")

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <Sidebar>
            <SidebarHeader className="flex items-center justify-between p-4">
              <h1 className="text-xl font-bold">ProjectHub</h1>
              <ModeToggle />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "projects"}
                    onClick={() => setActiveSection("projects")}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "timeline"}
                    onClick={() => setActiveSection("timeline")}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Timeline</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "settings"}
                    onClick={() => setActiveSection("settings")}
                  >
                    <SettingsIcon className="h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-accent/50">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{profileName}</p>
                      <p className="text-xs text-muted-foreground">{profileRole}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      const name = prompt("Enter new display name:", profileName)
                      if (name) setProfileName(name)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Switch Account</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 overflow-auto p-6">
            {activeSection === "projects" && <ProjectsOverview />}
            {activeSection === "timeline" && <Timeline />}
            {activeSection === "settings" && <Settings />}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

