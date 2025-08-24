import { useState, useMemo } from "react";
import { Monitor, Settings, List, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateSidebar } from "./DateSidebar";
import { VideoPlayer } from "./VideoPlayer";
import { VideoFilters } from "./VideoFilters";
import { VideoList } from "./VideoList";
import { Timeline as TimelineView } from "./Timeline";
import { RECORDINGS } from "@/data/recording";
import { isInTimeRange } from "@/lib/formatters";
import type { Recording, CameraRecordings } from "@/data/recording";

export function CCTVDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = Object.keys(RECORDINGS).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return dates[0] || '';
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const currentDateRecordings = RECORDINGS[selectedDate] || {};
  const availableCameras = Object.keys(currentDateRecordings);

  const filteredRecordings = useMemo(() => {
    const filtered: CameraRecordings = {};

    Object.entries(currentDateRecordings).forEach(([camera, videos]) => {
      // Filter by selected cameras
      if (selectedCameras.length > 0 && !selectedCameras.includes(camera)) {
        return;
      }

      // Filter videos by search term and time range
      const filteredVideos = videos
        .filter(video => {
          // Search filter
          if (searchTerm && !video.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
          
          // Time range filter
          if (!isInTimeRange(video.createdAt, startTime, endTime)) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
        });

      if (filteredVideos.length > 0) {
        filtered[camera] = filteredVideos;
      }
    });

    return filtered;
  }, [currentDateRecordings, selectedCameras, searchTerm, startTime, endTime, sortOrder]);

  const handleVideoSelect = (video: Recording) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCameraToggle = (camera: string) => {
    setSelectedCameras(prev => 
      prev.includes(camera) 
        ? prev.filter(c => c !== camera)
        : [...prev, camera]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCameras([]);
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="h-screen bg-background flex">
      <DateSidebar
        recordings={RECORDINGS}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card shadow-surface">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CCTV Recording Browser</h1>
                <p className="text-sm text-muted-foreground">
                  Professional surveillance system monitoring interface
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'timeline' ? (
            /* Timeline View - Scrollable Layout */
            <div className="h-full overflow-y-auto">
              <div className="space-y-6 p-6">
                <div className="max-w-4xl">
                  <VideoPlayer
                    currentVideo={selectedVideo}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                  />
                </div>
                
                <VideoFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCameras={selectedCameras}
                  onCameraToggle={handleCameraToggle}
                  availableCameras={availableCameras}
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  onClearFilters={handleClearFilters}
                />
                
                <TimelineView
                  cameras={filteredRecordings}
                  onVideoSelect={handleVideoSelect}
                  selectedVideo={selectedVideo}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          ) : (
            /* List View - Two Column */
            <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
              {/* Left Column - Video Player */}
              <div className="space-y-6">
                <VideoPlayer
                  currentVideo={selectedVideo}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </div>

              {/* Right Column - Filters and Video List */}
              <div className="space-y-6 flex flex-col min-h-0">
                <VideoFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCameras={selectedCameras}
                  onCameraToggle={handleCameraToggle}
                  availableCameras={availableCameras}
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  onClearFilters={handleClearFilters}
                />
                
                <div className="flex-1 min-h-0 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <VideoList
                      cameras={filteredRecordings}
                      onVideoSelect={handleVideoSelect}
                      selectedVideo={selectedVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}