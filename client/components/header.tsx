"use client"

import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">Vendor Pro</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Customize
          </Button>
          <Button size="sm">Export</Button>
          <button className="p-2 hover:bg-accent rounded-lg">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
