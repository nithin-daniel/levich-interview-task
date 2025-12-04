"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService, type Vendor, type CreateVendorData } from "@/lib/api";
import { toast } from "sonner";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Static fallback data - will be replaced by API data
const fallbackVendors: Vendor[] = [
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

type TabType = "all" | "monitored" | "unmonitored";

export function VendorMovements() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(fallbackVendors);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [apiData, setApiData] = useState<Vendor[]>([]);
  const [isUsingApiData, setIsUsingApiData] = useState(false);

  // Search state
  const [searchResults, setSearchResults] = useState<Vendor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUsingSearchResults, setIsUsingSearchResults] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    rating: "",
    status: "Active",
    categories: [] as string[],
  });

  // When using API data, pagination is handled by the server
  // When using fallback data, we handle pagination client-side
  const getFilteredVendors = () => {
    if (isUsingSearchResults) {
      // Return search results (they come pre-filtered from the search API)
      return searchResults.filter((vendor) => {
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "monitored" && vendor.monitored) ||
          (activeTab === "unmonitored" && !vendor.monitored);
        return matchesTab;
      });
    } else if (isUsingApiData) {
      // API data is already filtered and paginated by the server
      return apiData;
    } else {
      // Fallback to client-side filtering and pagination
      const filtered = fallbackVendors.filter((vendor) => {
        const matchesSearch =
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "monitored" && vendor.monitored) ||
          (activeTab === "unmonitored" && !vendor.monitored);
        return matchesSearch && matchesTab;
      });
      return filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    }
  };

  const paginatedVendors = getFilteredVendors();

  const allSelected =
    paginatedVendors.length > 0 &&
    paginatedVendors.every((v) => selectedVendors.includes(v.id));

  // Pagination handlers
  const handlePrevPage = () => {
    if (isUsingApiData) {
      if (hasPrev) {
        fetchVendors(currentPage - 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (isUsingApiData) {
      if (hasNext) {
        fetchVendors(currentPage + 1);
      }
    } else {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePageClick = (page: number) => {
    if (isUsingApiData) {
      fetchVendors(page);
    } else {
      setCurrentPage(page);
    }
  };

  // Update total items and pages when filters change (for fallback data only)
  useEffect(() => {
    if (!isUsingApiData) {
      const filtered = fallbackVendors.filter((vendor) => {
        const matchesSearch =
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "monitored" && vendor.monitored) ||
          (activeTab === "unmonitored" && !vendor.monitored);
        return matchesSearch && matchesTab;
      });
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));

      // Reset to first page if current page is beyond available pages
      if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }
  }, [searchQuery, activeTab, isUsingApiData, currentPage, itemsPerPage]);

  // Fetch vendors when filters change (this will reset to page 1)
  useEffect(() => {
    fetchVendors(1);
  }, [searchQuery, activeTab]);

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (page = 1) => {
    try {
      setIsLoading(true);

      const response = await apiService.vendors.getAll({
        page,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        monitored:
          activeTab === "monitored"
            ? true
            : activeTab === "unmonitored"
            ? false
            : undefined,
      });

      if (response.success && response.data) {
        // Handle the response structure you provided
        if (response.data.data && Array.isArray(response.data.data)) {
          // Paginated response structure
          const { data, pagination } = response.data;
          setApiData(data);
          setCurrentPage(pagination.page);
          setTotalItems(pagination.total);
          setTotalPages(pagination.totalPages);
          setHasNext(pagination.hasNext);
          setHasPrev(pagination.hasPrev);
          setIsUsingApiData(true);
        } else if (Array.isArray(response.data)) {
          // Simple array response - fallback
          setApiData(response.data);
          setTotalItems(response.data.length);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
          setHasNext(false);
          setHasPrev(false);
          setIsUsingApiData(true);
        } else {
          // Fallback to static data
          console.warn(
            "Unexpected API response structure, using fallback data"
          );
          setIsUsingApiData(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      toast.error("Failed to fetch vendors. Using cached data.");
      setIsUsingApiData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Search function using the search API
  const searchVendors = async (title: string) => {
    if (!title.trim()) {
      setIsUsingSearchResults(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await apiService.search.searchByTitle(title);

      if (response.success && response.data) {
        setSearchResults(response.data.vendors || []);
        setIsUsingSearchResults(true);
        toast.success(
          response.message || `Found ${response.data.total || 0} vendor(s)`
        );
      } else {
        setSearchResults([]);
        setIsUsingSearchResults(false);
        toast.error("No vendors found matching your search");
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
      setSearchResults([]);
      setIsUsingSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(paginatedVendors.map((v) => v.id));
    }
  };

  const handleSelectVendor = (id: number) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (isUsingApiData) {
      fetchVendors(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Search handler with debounce effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        // Use search API when there's a search query
        searchVendors(searchQuery);
      } else {
        // Clear search results when search query is empty
        setIsUsingSearchResults(false);
        setSearchResults([]);
        if (isUsingApiData) {
          fetchVendors(1); // Reset to first page when searching
        } else {
          setCurrentPage(1); // Reset to first page for local filtering
        }
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Tab change handler
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (isUsingApiData) {
      fetchVendors(1); // Reset to first page when changing tabs
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Vendor movements
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Keep track of vendor and their security ratings.
          </p>
        </div>
        <button className="p-1 hover:bg-accent rounded-lg md:hidden">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <Badge variant="secondary" className="font-normal hidden md:flex">
          {totalItems} vendors
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent text-xs md:text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Import
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm"
            >
              <Plus className="w-4 h-4" />
              Add vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (
                  !formData.name.trim() ||
                  !formData.domain.trim() ||
                  !formData.rating
                ) {
                  toast.error("Please fill in all required fields.");
                  return;
                }

                try {
                  setIsSubmitting(true);

                  const vendorData: CreateVendorData = {
                    name: formData.name.trim(),
                    domain: formData.domain.trim().toLowerCase(),
                    rating: parseInt(formData.rating),
                    status: formData.status,
                    categories: formData.categories,
                    monitored: false,
                  };

                  const response = await apiService.vendors.create(vendorData);

                  if (response.success) {
                    toast.success("Vendor created successfully!");

                    // Refresh vendor list
                    await fetchVendors();

                    // Close dialog and reset form
                    setIsDialogOpen(false);
                    setFormData({
                      name: "",
                      domain: "",
                      rating: "",
                      status: "Active",
                      categories: [],
                    });
                  }
                } catch (error: any) {
                  console.error("Failed to create vendor:", error);

                  const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create vendor. Please try again.";

                  toast.error(errorMessage);
                } finally {
                  setIsSubmitting(false);
                }
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
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
                    {[
                      "Customer data",
                      "Admin",
                      "Business data",
                      "Financials",
                      "Database access",
                      "Salesforce",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                categories: [...formData.categories, category],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                categories: formData.categories.filter(
                                  (c) => c !== category
                                ),
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={category}
                          className="text-sm font-normal"
                        >
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
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Add Vendor"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {isSearching ? (
            <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
          <input
            type="text"
            placeholder="Search vendors by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            disabled={isSearching}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsUsingSearchResults(false);
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent shrink-0 h-9 w-9"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Results Indicator */}
      {isUsingSearchResults && (
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
          <Search className="w-4 h-4 text-purple-600" />
          <span className="text-purple-800">
            Search results for "
            <span className="font-medium">{searchQuery}</span>" (
            {searchResults.length} found)
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setIsUsingSearchResults(false);
              setSearchResults([]);
            }}
            className="ml-auto text-purple-600 hover:text-purple-800"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["all", "monitored", "unmonitored"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all"
              ? "View all"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          <span className="text-sm font-medium text-muted-foreground">
            Rating
          </span>
        </div>

        {/* Mobile Vendor List */}
        {paginatedVendors.map((vendor) => (
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
                <div className="font-medium text-foreground text-sm truncate">
                  {vendor.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {vendor.domain}
                </div>
              </div>
            </div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden shrink-0 ml-3">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${vendor.rating}%` }}
              />
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
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
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
            {isLoading
              ? // Loading state
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                        <div>
                          <div className="w-24 h-4 bg-muted animate-pulse rounded mb-2" />
                          <div className="w-32 h-3 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted animate-pulse rounded-full" />
                        <div className="w-8 h-4 bg-muted animate-pulse rounded" />
                        <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-1">
                        <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                        <div className="w-20 h-5 bg-muted animate-pulse rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-8 h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : paginatedVendors.map((vendor) => (
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
                          <div className="font-medium text-foreground">
                            {vendor.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.domain}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${vendor.rating}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-8">
                          {vendor.rating}
                        </span>
                        <span
                          className={`flex items-center gap-0.5 text-sm font-medium ${
                            vendor.trendUp ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {vendor.trendUp ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {vendor.trend}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {vendor.lastAssessed}
                    </TableCell>
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
                              vendor.status === "Active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {vendor.status}
                        </Badge>
                        {vendor.categories.slice(0, 2).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {cat}
                          </Badge>
                        ))}
                        {vendor.extraCategories > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
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
        <button
          className="p-2 hover:bg-accent rounded-lg md:hidden border border-border disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevPage}
          disabled={isLoading || (isUsingApiData ? !hasPrev : currentPage <= 1)}
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
          {isUsingApiData && ` (${totalItems} total)`}
        </span>
        <button
          className="p-2 hover:bg-accent rounded-lg md:hidden border border-border disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={
            isLoading || (isUsingApiData ? !hasNext : currentPage >= totalPages)
          }
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent"
            onClick={handlePrevPage}
            disabled={
              isLoading || (isUsingApiData ? !hasPrev : currentPage <= 1)
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent"
            onClick={handleNextPage}
            disabled={
              isLoading ||
              (isUsingApiData ? !hasNext : currentPage >= totalPages)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
