"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { VendorBreakdown } from "@/components/vendor-breakdown"
import { VendorsMonitored } from "@/components/vendors-monitored"
import { VendorMovements } from "@/components/vendor-movements"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Menu, Settings2, Search } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  // Extract first name from email for greeting
  const getFirstName = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-4 py-4 bg-background lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-base">V</span>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-accent rounded-lg">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </header>

          <main className="flex-1 overflow-auto px-4 pb-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              <div className="hidden lg:flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">
                  Welcome back, {user ? getFirstName(user.email) : 'User'}
                </h1>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings2 className="w-4 h-4" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Export
                  </Button>
                </div>
              </div>

              <div className="lg:hidden">
                <h1 className="text-xl font-semibold text-foreground mb-3">
                  Welcome back, {user ? getFirstName(user.email) : 'User'}
                </h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs">
                    <Settings2 className="w-3.5 h-3.5" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent text-xs">
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2">
                  <VendorBreakdown />
                </div>
                <div>
                  <VendorsMonitored />
                </div>
              </div>

              <VendorMovements />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
