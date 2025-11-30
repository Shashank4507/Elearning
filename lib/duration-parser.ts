/**
 * Parse duration string to seconds
 * Supports formats: "MM:SS", "H:MM:SS", "HH:MM:SS"
 */
export function parseDurationToSeconds(duration: string): number {
  const parts = duration.trim().split(':').map(p => parseInt(p, 10))
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    // H:MM:SS or HH:MM:SS format
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }
  
  return 0
}

/**
 * Manual video durations from your list
 * Maps video title keywords to duration in seconds
 */
export const MANUAL_DURATIONS: Record<string, number> = {
  // HTML
  'HTML': parseDurationToSeconds('1:09:34'), // 4174 seconds
  
  // CSS
  'CSS': parseDurationToSeconds('1:00:00'), // 3600 seconds
  
  // JavaScript
  'JavaScript': parseDurationToSeconds('12:00:00'), // 43200 seconds (seems wrong, likely 1:12:00?)
  
  // React
  'React Tutorial for Beginners': parseDurationToSeconds('20:27'), // 1227 seconds
  'React Hooks': parseDurationToSeconds('2:17:47'), // 8267 seconds
  'React State Management': parseDurationToSeconds('2:46:37'), // 9997 seconds
  
  // Node.js
  'Node.js': parseDurationToSeconds('1:18:16'), // 4696 seconds
  
  // Express.js
  'Express': parseDurationToSeconds('3:57:15'), // 14235 seconds
  
  // MongoDB
  'MongoDB Crash Course': parseDurationToSeconds('1:00:00'), // 3600 seconds
  'MongoDB Schema Design': parseDurationToSeconds('9:57'), // 597 seconds
}

/**
 * Get duration for a video based on its title
 */
export function getDurationByTitle(title: string): number {
  // Try exact match first
  for (const [key, duration] of Object.entries(MANUAL_DURATIONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return duration
    }
  }
  
  // Default fallback
  return 600 // 10 minutes default
}

/**
 * Format seconds to readable duration (HH:MM:SS or MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  
  return `${minutes}:${String(secs).padStart(2, '0')}`
}
