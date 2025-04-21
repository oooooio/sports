"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface SidebarToggleProps {
  className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen)
    document.documentElement.classList.toggle("sidebar-collapsed", !isOpen)
    localStorage.setItem("sidebarCollapsed", (!isOpen).toString())
  }, [isOpen])

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState === "true") {
      setIsOpen(false)
      document.documentElement.classList.add("sidebar-collapsed")
    }
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleSidebar}
      aria-label={isOpen ? "折叠侧边栏" : "展开侧边栏"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
