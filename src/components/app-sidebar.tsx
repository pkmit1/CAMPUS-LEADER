"use client"

import * as React from "react"
import axios from "axios"
import {
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
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Introduction", url: "#" },
          { title: "Get Started", url: "#" },
          { title: "Tutorials", url: "#" },
          { title: "Changelog", url: "#" },
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
      { name: "Travel", url: "/dashboard", icon: Map },
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={navData.projects} />
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
