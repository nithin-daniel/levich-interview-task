"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  MoreVertical,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const vendors = [
  {
    id: 1,
    name: "Ephemeral",
    domain: "ephemeral.io",
    logo: "E",
    logoColor: "from-pink-400 to-pink-600",
    rating: 60,
    trend: 5,
    trendUp: true,
    lastAssessed: "22 Jan 2025",
    status: "Active",
    categories: ["Customer data", "Admin"],
    extraCategories: 4,
    monitored: true,
  },
  {
    id: 2,
    name: "Stack3d Lab",
    domain: "stack3dlab.com",
    logo: "S",
    logoColor: "from-emerald-400 to-emerald-600",
    rating: 72,
    trend: 4,
    trendUp: false,
    lastAssessed: "20 Jan 2025",
    status: "Active",
    categories: ["Business data", "Admin"],
    extraCategories: 4,
    monitored: true,
  },
  {
    id: 3,
    name: "Warpspeed",
    domain: "getwarpspeed.com",
    logo: "W",
    logoColor: "from-cyan-400 to-cyan-600",
    rating: 78,
    trend: 6,
    trendUp: true,
    lastAssessed: "24 Jan 2025",
    status: "Active",
    categories: ["Customer data", "Financials"],
    extraCategories: 0,
    monitored: true,
  },
  {
    id: 4,
    name: "CloudWatch",
    domain: "cloudwatch.app",
    logo: "C",
    logoColor: "from-blue-400 to-blue-600",
    rating: 38,
    trend: 8,
    trendUp: true,
    lastAssessed: "26 Jan 2025",
    status: "Active",
    categories: ["Database access", "Admin"],
    extraCategories: 0,
    monitored: false,
  },
  {
    id: 5,
    name: "ContrastAI",
    domain: "contrastai.com",
    logo: "C",
    logoColor: "from-indigo-400 to-indigo-600",
    rating: 42,
    trend: 1,
    trendUp: false,
    lastAssessed: "18 Jan 2025",
    status: "Active",
    categories: ["Salesforce", "Admin"],
    extraCategories: 4,
    monitored: false,
  },
  {
    id: 6,
    name: "Convergence",
    domain: "convergence.io",
    logo: "C",
    logoColor: "from-purple-400 to-purple-600",
    rating: 66,
    trend: 6,
    trendUp: false,
    lastAssessed: "28 Jan 2025",
    status: "Active",
    categories: ["Business data", "Admin"],
    extraCategories: 4,
    monitored: true,
  },
  {
    id: 7,
    name: "Sisyphus",
    domain: "sisyphus.com",
    logo: "S",
    logoColor: "from-green-400 to-green-600",
    rating: 91,
    trend: 2,
    trendUp: true,
    lastAssessed: "16 Jan 2025",
    status: "Inactive",
    categories: ["Customer data", "Financials"],
    extraCategories: 0,
    monitored: true,
  },
]

type TabType = "all" | "monitored" | "unmonitored"

export function VendorMovements() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    rating: "",
    status: "Active",
    categories: [] as string[]
  })

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "monitored" && vendor.monitored) ||
      (activeTab === "unmonitored" && !vendor.monitored)
    return matchesSearch && matchesTab
  })

  const allSelected = filteredVendors.length > 0 && filteredVendors.every((v) => selectedVendors.includes(v.id))

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedVendors([])
    } else {
      setSelectedVendors(filteredVendors.map((v) => v.id))
    }
  }

  const handleSelectVendor = (id: number) => {
    setSelectedVendors((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">Vendor movements</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Keep track of vendor and their security ratings.
          </p>
        </div>
        <button className="p-1 hover:bg-accent rounded-lg md:hidden">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <Badge variant="secondary" className="font-normal hidden md:flex">
          240 vendors
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs md:text-sm">
          <RefreshCw className="w-4 h-4" />
          Import
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm">
              <Plus className="w-4 h-4" />
              Add vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Here you would typically handle the form submission
                console.log("Form submitted:", formData)
                setIsDialogOpen(false)
                // Reset form
                setFormData({
                  name: "",
                  domain: "",
                  rating: "",
                  status: "Active",
                  categories: []
                })
              }}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter vendor name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Security Rating (0-100)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="75"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Customer data", "Admin", "Business data", "Financials", "Database access", "Salesforce"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                categories: [...formData.categories, category]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                categories: formData.categories.filter(c => c !== category)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Vendor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
        <Button variant="outline" size="icon" className="bg-transparent shrink-0 h-9 w-9">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["all", "monitored", "unmonitored"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "View all" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Mobile View - Simplified List */}
      <div className="md:hidden border border-border rounded-lg overflow-hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-3">
            <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Vendor <ArrowUpDown className="w-3 h-3" />
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">Rating</span>
        </div>

        {/* Mobile Vendor List */}
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 bg-background"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedVendors.includes(vendor.id)}
                onCheckedChange={() => handleSelectVendor(vendor.id)}
              />
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${vendor.logoColor} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
              >
                {vendor.logo}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground text-sm truncate">{vendor.name}</div>
                <div className="text-xs text-muted-foreground truncate">{vendor.domain}</div>
              </div>
            </div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden shrink-0 ml-3">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${vendor.rating}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Full Table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Vendor
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Last assessed</TableHead>
              <TableHead className="hidden lg:table-cell">Categories</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => handleSelectVendor(vendor.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${vendor.logoColor} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                    >
                      {vendor.logo}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.domain}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${vendor.rating}%` }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">{vendor.rating}</span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-medium ${
                        vendor.trendUp ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {vendor.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {vendor.trend}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{vendor.lastAssessed}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${
                        vendor.status === "Active"
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          vendor.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {vendor.status}
                    </Badge>
                    {vendor.categories.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs font-normal">
                        {cat}
                      </Badge>
                    ))}
                    {vendor.extraCategories > 0 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{vendor.extraCategories}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-accent rounded-lg">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-accent rounded-lg">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button className="p-2 hover:bg-accent rounded-lg md:hidden border border-border">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="text-muted-foreground">Page 1 of 10</span>
        <button className="p-2 hover:bg-accent rounded-lg md:hidden border border-border">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="gap-1 bg-transparent">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
