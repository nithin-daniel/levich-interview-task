"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

const data = [
  { month: "Jan", low: 45, medium: 35, high: 15 },
  { month: "Feb", low: 50, medium: 30, high: 20 },
  { month: "Mar", low: 40, medium: 35, high: 25 },
  { month: "Apr", low: 35, medium: 40, high: 20 },
  { month: "May", low: 45, medium: 35, high: 25 },
  { month: "Jun", low: 50, medium: 30, high: 20 },
  { month: "Jul", low: 55, medium: 25, high: 25 },
  { month: "Aug", low: 50, medium: 30, high: 20 },
  { month: "Sep", low: 60, medium: 25, high: 20 },
  { month: "Oct", low: 55, medium: 30, high: 25 },
  { month: "Nov", low: 65, medium: 25, high: 20 },
  { month: "Dec", low: 70, medium: 20, high: 15 },
]

export function VendorBreakdown() {
  return (
    <Card className="p-4 md:p-6 h-full border-2 border-purple-200 dark:border-purple-900/50">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">Vendor breakdown</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Keep track of vendors and their security ratings.
          </p>
        </div>
        <button className="p-1 hover:bg-accent rounded-lg">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="h-44 md:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              interval={1}
              tickFormatter={(value) => {
                // Show only Jan, Mar, May, Jul, Sep, Nov on mobile-sized charts
                const shortMonths = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
                return shortMonths.includes(value) ? value : ""
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="low" stackId="a" fill="#c4b5fd" radius={[0, 0, 0, 0]} />
            <Bar dataKey="medium" stackId="a" fill="#a78bfa" radius={[0, 0, 0, 0]} />
            <Bar dataKey="high" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="font-medium bg-transparent text-sm">
          View full report
        </Button>
      </div>
    </Card>
  )
}
