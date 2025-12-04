"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { apiService, type CreateVendorData } from "@/lib/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface AddVendorModalProps {
  onVendorAdded?: () => void;
}

const VENDOR_CATEGORIES = [
  "Customer data",
  "Admin",
  "Business data",
  "Financials",
  "Database access",
  "Salesforce",
];

export function AddVendorModal({ onVendorAdded }: AddVendorModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    rating: "",
    status: "Active",
    categories: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      domain: "",
      rating: "",
      status: "Active",
      categories: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

        // Notify parent component to refresh vendor list
        onVendorAdded?.();

        // Close dialog and reset form
        setIsDialogOpen(false);
        resetForm();
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
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      });
    }
  };

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                {VENDOR_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(category, checked as boolean)
                      }
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
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
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
  );
}