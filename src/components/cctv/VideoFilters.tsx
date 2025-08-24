import { Search, Filter, Clock, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface VideoFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCameras: string[];
  onCameraToggle: (camera: string) => void;
  availableCameras: string[];
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export function VideoFilters({
  searchTerm,
  onSearchChange,
  selectedCameras,
  onCameraToggle,
  availableCameras,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  sortOrder,
  onSortChange,
  onClearFilters
}: VideoFiltersProps) {
  const hasActiveFilters = searchTerm || selectedCameras.length > 0 || startTime || endTime;

  return (
    <Card className="bg-card shadow-surface">
      <div className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="min-w-0 flex-1"
            />
          </div>

          {/* Camera Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="w-4 h-4" />
                Cameras
                {selectedCameras.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCameras.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Select Cameras</h4>
                {availableCameras.map(camera => (
                  <div key={camera} className="flex items-center space-x-2">
                    <Checkbox
                      id={camera}
                      checked={selectedCameras.includes(camera)}
                      onCheckedChange={() => onCameraToggle(camera)}
                    />
                    <label htmlFor={camera} className="text-sm font-mono">
                      {camera}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Input
              type="time"
              placeholder="Start time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-32"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="time"
              placeholder="End time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-32"
            />
          </div>

          {/* Sort Order */}
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => onSortChange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <Filter className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}