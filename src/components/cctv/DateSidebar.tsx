import { Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import type { RecordingsData } from "@/data/recordings";

interface DateSidebarProps {
  recordings: RecordingsData;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function DateSidebar({ 
  recordings, 
  selectedDate, 
  onDateSelect, 
  isCollapsed, 
  onToggleCollapse 
}: DateSidebarProps) {
  const dates = Object.keys(recordings).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const getVideoCount = (date: string) => {
    const cameras = recordings[date];
    return Object.values(cameras).reduce((total, videos) => total + videos.length, 0);
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sidebar-primary" />
              <h2 className="text-sm font-semibold text-sidebar-foreground">Recordings</h2>
            </div>
          )}
          <Button
            variant="ghost" 
            size="sm"
            onClick={onToggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="p-2 space-y-1">
          {dates.map(date => {
            const videoCount = getVideoCount(date);
            const isSelected = date === selectedDate;
            
            return (
              <Button
                key={date}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => onDateSelect(date)}
                className={`w-full justify-start gap-2 ${
                  isSelected 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-monitoring" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Video className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">
                          {formatDate(date)}
                        </div>
                        <div className="text-xs opacity-70">
                          {date}
                        </div>
                      </div>
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {videoCount}
                      </Badge>
                    </>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}