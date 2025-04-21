"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarToggle } from "@/components/sidebar-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
 
  useEffect(() => {
    // If the user is not logged in and loading is complete, redirect to the login page
    if (!isLoading && !user) {
      // Pass the current path as a redirect parameter to return after login
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, router, pathname])

  // If loading or the user is not logged in, do not render content
  if (isLoading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar className="sidebar transition-all duration-300 ease-in-out" />
      <div className="flex-1 overflow-auto main-content transition-all duration-300 ease-in-out">
        <div className="sticky top-0 z-10 flex items-center border-b bg-background p-4">
          <SidebarToggle className="mr-2 md:hidden" />
          <div className="flex-1" />
        </div>
        <main className="container max-w-screen-xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
