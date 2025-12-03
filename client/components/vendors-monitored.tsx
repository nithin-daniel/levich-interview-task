"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, TrendingUp, Sparkles } from "lucide-react"

export function VendorsMonitored() {
  const percentage = 80
  const total = 240

  const radius = 70
  const strokeWidth = 14
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage / 100)

  return (
    <Card className="p-4 md:p-6 h-full flex flex-col border-2 border-purple-200 dark:border-purple-900/50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">Vendors monitored</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">You're using 80% of available spots.</p>
        </div>
        <button className="p-1 hover:bg-accent rounded-lg">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
        <div className="absolute top-2 right-0 flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">10%</span>
        </div>

        <div className="relative">
          <svg width="180" height="100" viewBox="0 0 180 100">
            <path
              d="M 10 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d="M 10 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke="#7c3aed"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="text-4xl font-bold text-foreground">{total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div>
          <p className="font-semibold text-foreground text-sm md:text-base">You've almost reached your limit</p>
          <p className="text-xs md:text-sm text-muted-foreground">
            You have used 80% of your available spots. Upgrade plan to monitor more vendors.
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="gap-2 bg-transparent text-sm">
            <Sparkles className="w-4 h-4" />
            Upgrade plan
          </Button>
        </div>
      </div>
    </Card>
  )
}
