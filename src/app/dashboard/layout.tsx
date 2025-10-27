"use client"
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
 


export default function DashboardLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const pathname = usePathname()
   const paths= pathname.split("/").filter(Boolean)



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
           <Breadcrumb>
  <BreadcrumbList>
    {/* Static breadcrumb item */}
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink href="#">
        Building Your Application
      </BreadcrumbLink>
    </BreadcrumbItem>

    {/* Dynamic breadcrumb items */}
    {paths.map((item, index) => (
      <React.Fragment key={index}>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          {/* Last item as page, others as links */}
          {index === paths.length - 1 ? (
            <BreadcrumbPage>{item.toUpperCase()}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="#">{item}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    ))}
  </BreadcrumbList>
</Breadcrumb>

          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
       {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
