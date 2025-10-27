"use client"

import * as React from "react"
import axios from "axios"
import {
  Book,
  BookOpen,
  Command,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Types
interface User {
  id:number,
  name: string
  email: string
  image?: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      try {
        const res = await axios.get("/api/me", { withCredentials: true })
        console.log("API /api/me response:", res.data)
        setUser(res.data) // ✅ your GET returns { id, name, email, collegeName, image }
      } catch (err) {
        setError("Failed to load user")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Static nav data
  const navData = {
    navMain: [
      {
        title: "Opportunitys",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Placment", url: "#" },
          { title: "Live Project", url: "#" },
          { title: "Internship", url: "#" },
         
        ],
      },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: LifeBuoy },
      { title: "Feedback", url: "#", icon: Send },
    ],
    projects: [
      { name: "Home", url: "/dashboard", icon: Home },
      { name: "User", url: "/dashboard/leader/users", icon: User },
      { name: "Project", url: "/dashboard/leader/project-assigned", icon: Map },
       { name: "ResumeBuilder", url: "/dashboard/resumeBuilder", icon: Book },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Campus Leader</span>
                  <span className="truncate text-medium">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
        <NavProjects projects={navData.projects} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>


      <SidebarFooter>
        {loading ? (
          <div className="text-sm text-gray-500 px-3">Loading user...</div>
        ) : error ? (
          <div className="text-sm text-red-500 px-3">{error}</div>
        ) : user ? (
          <NavUser
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.image || "",
            }}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
