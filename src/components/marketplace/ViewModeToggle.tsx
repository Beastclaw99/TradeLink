
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, LayoutList } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  projectCount: number;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode, projectCount }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-ttc-neutral-800">{projectCount} Projects Available</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Button 
            size="icon" 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            onClick={() => setViewMode("grid")} 
            className="h-8 w-8"
          >
            <Grid size={16} />
          </Button>
          <Button 
            size="icon" 
            variant={viewMode === "list" ? "default" : "ghost"} 
            onClick={() => setViewMode("list")} 
            className="h-8 w-8"
          >
            <LayoutList size={16} />
          </Button>
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="budget-high">Budget: High to Low</SelectItem>
            <SelectItem value="budget-low">Budget: Low to High</SelectItem>
            <SelectItem value="deadline">Deadline: Soonest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ViewModeToggle;
