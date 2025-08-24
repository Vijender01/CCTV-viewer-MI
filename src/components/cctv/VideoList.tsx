import { useState } from "react";
import { Play, Clock, HardDrive, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDuration, formatSize, formatTime } from "@/lib/formatters";
import type { Recording, CameraRecordings } from "@/data/recordings";

interface VideoListProps {
  cameras: CameraRecordings;
  onVideoSelect: (video: Recording) => void;
  selectedVideo: Recording | null;
}

export function VideoList({ cameras, onVideoSelect, selectedVideo }: VideoListProps) {
  const [expandedCameras, setExpandedCameras] = useState<Set<string>>(new Set());

  const toggleCamera = (camera: string) => {
    const newExpanded = new Set(expandedCameras);
    if (newExpanded.has(camera)) {
      newExpanded.delete(camera);
    } else {
      newExpanded.add(camera);
    }
    setExpandedCameras(newExpanded);
  };

  const cameraEntries = Object.entries(cameras).filter(([_, videos]) => videos.length > 0);

  if (cameraEntries.length === 0) {
    return (
      <Card className="bg-card shadow-surface">
        <div className="p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Recordings Found</h3>
          <p className="text-sm text-muted-foreground">
            No video recordings match your current filters for this date.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {cameraEntries.map(([camera, videos]) => {
        const isExpanded = expandedCameras.has(camera);
        
        return (
          <Card key={camera} className="bg-card shadow-surface">
            <Collapsible open={isExpanded} onOpenChange={() => toggleCamera(camera)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-4 justify-between hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-mono text-primary font-semibold">
                        {camera.replace('camera', 'C')}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground font-mono">{camera}</h3>
                      <p className="text-sm text-muted-foreground">
                        {videos.length} recording{videos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {videos.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <ScrollArea className="max-h-96">
                  <div className="px-4 pb-4 space-y-1">
                    {videos.map((video, index) => {
                      const isSelected = selectedVideo?.name === video.name;
                      
                      return (
                        <Button
                          key={video.name}
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={() => onVideoSelect(video)}
                          className={`w-full p-3 h-auto justify-start ${
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-monitoring" 
                              : "hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">
                              <Play className="w-4 h-4" />
                            </div>
                            
                            <div className="min-w-0 flex-1 text-left">
                              <div className="font-mono text-sm truncate">
                                {video.name}
                              </div>
                              <div className="flex items-center gap-4 text-xs opacity-70 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(video.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HardDrive className="w-3 h-3" />
                                  {formatSize(video.size)}
                                </span>
                                <span>{formatDuration(video.duration)}</span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0 text-right">
                              <Badge variant={isSelected ? "secondary" : "outline"} className="text-xs">
                                {formatDuration(video.duration)}
                              </Badge>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}