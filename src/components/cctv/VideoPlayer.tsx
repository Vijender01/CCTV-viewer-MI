import { useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Recording } from "@/data/recording";

interface VideoPlayerProps {
  currentVideo: Recording | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function VideoPlayer({ currentVideo, isPlaying, onPlayPause }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && currentVideo) {
      // In a real app, this would load the actual video file
      // For demo purposes, we'll use a placeholder
      console.log('this is the current video',currentVideo);
      
      videoRef.current.src = currentVideo.path;
    }
  }, [currentVideo]);

  return (
    <Card className="bg-gradient-surface shadow-monitoring">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Video Player</h3>
            {currentVideo && (
              <p className="text-sm text-muted-foreground font-mono">{currentVideo.name}</p>
            )}
          </div>
          {currentVideo && (
            <Badge variant="outline" className="font-mono text-xs">
              {currentVideo.path.split('/').pop()}
            </Badge>
          )}
        </div>
        
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {currentVideo ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              onPlay={() => {}}
              onPause={() => {}}
            >
              {/* Placeholder - in real app would have actual video source */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white text-sm">Video: {currentVideo.name}</p>
              </div>
            </video>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a recording to begin playback</p>
              </div>
            </div>
          )}
        </div>
        
        {currentVideo && (
          <div className="mt-4 flex items-center gap-4">
            <Button 
              size="sm" 
              onClick={onPlayPause}
              className="bg-primary hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="w-4 h-4" />
              <span>Controls available in fullscreen</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}