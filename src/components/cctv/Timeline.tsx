import { useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatTime, formatDuration } from "@/lib/formatters";
import type { Recording, CameraRecordings } from "@/data/recording";

interface TimelineProps {
  cameras: CameraRecordings;
  onVideoSelect: (video: Recording) => void;
  selectedVideo: Recording | null;
  selectedDate: string;
}

interface TimelineSegment {
  video: Recording;
  camera: string;
  startSeconds: number;
  durationSeconds: number;
}

export function Timeline({ cameras, onVideoSelect, selectedVideo, selectedDate }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()
  );

  // Calculate timeline segments
  const timelineData = useMemo(() => {
    const segments: TimelineSegment[] = [];
    let minTime = 24 * 3600; // 86400 seconds
    let maxTime = 0;

    Object.entries(cameras).forEach(([camera, videos]) => {

      videos.forEach(video => {
        const startDate = new Date(video.createdAt);
        const startSeconds =
          startDate.getHours() * 3600 +
          startDate.getMinutes() * 60 +
          startDate.getSeconds();
        const durationSeconds = video.duration; // already in seconds

        segments.push({
          video,
          camera,
          startSeconds,
          durationSeconds,
        });

        minTime = Math.min(minTime, startSeconds);
        maxTime = Math.max(maxTime, startSeconds + durationSeconds);
      });

      
    });

    // Expand range for better visibility (±5 min = 300 sec)
    const startTime = Math.max(0, Math.floor(minTime / 60) * 60 - 300);
    const endTime = Math.min(24 * 3600, Math.ceil(maxTime / 60) * 60 + 300);

    return { segments, startTime, endTime };
  }, [cameras]);

  const { segments, startTime, endTime } = timelineData;
  const timeRange = endTime - startTime;
  const cameraNames = Object.keys(cameras).filter(camera => cameras[camera].length > 0);

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    const markers: number[] = [];
    for (let hour = Math.floor(startTime / 3600); hour <= Math.ceil(endTime / 3600); hour++) {
      if (hour >= 0 && hour <= 24) {
        markers.push(hour);
      }
    }
    return markers;
  }, [startTime, endTime]);

  const getSegmentStyle = (segment: TimelineSegment) => {
    const left = ((segment.startSeconds - startTime) / timeRange) * 100;
    const width = (segment.durationSeconds / timeRange) * 100;

    return {
      left: `${left}%`,
      width: `${Math.max(width, 0.5)}%`, // Minimum width for visibility
    };
  };

  const isSelected = (video: Recording) => selectedVideo?.name === video.name;

  if (segments.length === 0) {
    return (
      <Card className="bg-card shadow-surface">
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            <div className="w-6 h-1 bg-muted-foreground rounded opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Timeline Data</h3>
          <p className="text-sm text-muted-foreground">
            No video recordings found for the selected date and filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-surface shadow-monitoring">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Timeline View</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {selectedDate} • {segments.length} recordings across {cameraNames.length} cameras
            </p>
          </div>
          <Badge variant="outline" className="font-mono">
            {formatTime(
              new Date(
                `${selectedDate}T${Math.floor(startTime / 3600)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((startTime % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}:00`
              ).toISOString()
            )}{" "}
            -{" "}
            {formatTime(
              new Date(
                `${selectedDate}T${Math.floor(endTime / 3600)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((endTime % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}:00`
              ).toISOString()
            )}
          </Badge>
        </div>

        <ScrollArea className="h-96">
          <div ref={scrollRef} className="relative min-h-[320px]">
            {/* Time axis */}
            <div className="sticky top-0 z-10 bg-card border-b border-border mb-4">
              <div className="relative h-12 px-4">
                {hourMarkers.map(hour => {
                  const position = ((hour * 3600 - startTime) / timeRange) * 100;
                  return (
                    <div
                      key={hour}
                      className="absolute top-0 h-full flex flex-col justify-between text-xs text-muted-foreground"
                      style={{ left: `${position}%` }}
                    >
                      <div className="font-mono font-semibold">
                        {hour.toString().padStart(2, "0")}:00
                      </div>
                      <div className="w-px h-6 bg-border" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Camera rows */}
            <div className="space-y-3 px-4">
              {cameraNames.map(camera => {
                const cameraSegments = segments.filter(s => s.camera === camera);

                return (
                  <div key={camera} className="relative">
                    {/* Camera label */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-mono text-primary font-semibold">
                          {camera.replace("camera", "C")}
                        </span>
                      </div>
                      <div className="font-mono text-sm font-semibold text-foreground">
                        {camera}
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        {cameraSegments.length}
                      </Badge>
                    </div>

                    {/* Timeline track */}
                    <div className="relative h-8 bg-accent/20 rounded-md mb-1">
                      {/* Grid lines */}
                      {hourMarkers.map(hour => {
                        const position = ((hour * 3600 - startTime) / timeRange) * 100;
                        return (
                          <div
                            key={hour}
                            className="absolute top-0 bottom-0 w-px bg-border/50"
                            style={{ left: `${position}%` }}
                          />
                        );
                      })}

                      {/* Video segments */}
                      {cameraSegments.map((segment, index) => (
                        <button
                          key={`${segment.video.name}-${index}`}
                          className={`absolute top-1 bottom-1 rounded-sm transition-all duration-200 hover:scale-y-110 hover:z-10 group ${
                            isSelected(segment.video)
                              ? "bg-primary text-primary-foreground shadow-monitoring ring-2 ring-primary/50"
                              : "bg-primary/70 hover:bg-primary/90 text-primary-foreground"
                          }`}
                          style={getSegmentStyle(segment)}
                          onClick={() => onVideoSelect(segment.video)}
                          title={`${segment.video.name} - ${formatDuration(segment.video.duration)}`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono bg-black/75 text-white px-1 py-0.5 rounded whitespace-nowrap">
                              {formatTime(segment.video.createdAt)} (
                              {formatDuration(segment.video.duration)})
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current time indicator (if today) */}
            {selectedDate === new Date().toISOString().split("T")[0] && (
              <div
                className="absolute top-12 bottom-0 w-0.5 bg-accent z-20 pointer-events-none"
                style={{
                  left: `${((currentTime - startTime) / timeRange) * 100}%`,
                  display:
                    currentTime >= startTime && currentTime <= endTime
                      ? "block"
                      : "none",
                }}
              >
                <div className="absolute -top-3 -left-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
