/**
 * Utility functions for formatting CCTV data display
 */

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export function parseTimeRange(timeString: string): Date | null {
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function isInTimeRange(recordingTime: string, startTime: string, endTime: string): boolean {
  if (!startTime && !endTime) return true;
  
  const recordingDate = new Date(recordingTime);
  const recordingHours = recordingDate.getHours();
  const recordingMinutes = recordingDate.getMinutes();
  const recordingTotalMinutes = recordingHours * 60 + recordingMinutes;
  
  if (startTime) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    if (recordingTotalMinutes < startTotalMinutes) return false;
  }
  
  if (endTime) {
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;
    if (recordingTotalMinutes > endTotalMinutes) return false;
  }
  
  return true;
}