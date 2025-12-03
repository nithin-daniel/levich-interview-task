"use client"

import { useEffect } from "react"
import { Home, LayoutGrid, Users, FolderOpen, Clock, UserCog, Settings, HelpCircle, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: Users, label: "Vendors" },
  { icon: FolderOpen, label: "Documents" },
  { icon: Clock, label: "History" },
  { icon: UserCog, label: "Users" },
]

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <>
      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={onClose} />}

      {/* Sidebar - Icon only on desktop, full on mobile */}
      <aside
        className={`
          fixed lg:relative z-50 h-screen bg-background border-r border-border
          flex flex-col transition-transform duration-300
          w-64 lg:w-[72px]
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between lg:justify-center border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                lg:justify-center lg:px-0
                ${
                  item.active
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }
              `}
              title={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="lg:hidden font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="py-4 px-3 border-t border-border space-y-1">
          {bottomItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:justify-center lg:px-0"
              title={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="lg:hidden font-medium">{item.label}</span>
            </a>
          ))}

          {/* User Avatar */}
          <div className="flex items-center gap-3 px-3 py-3 lg:justify-center lg:px-0 mt-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src="/professional-woman-avatar.png" />
              <AvatarFallback className="bg-purple-100 text-purple-600">O</AvatarFallback>
            </Avatar>
            <span className="lg:hidden font-medium text-foreground">Olivia</span>
          </div>
        </div>
      </aside>
    </>
  )
}
