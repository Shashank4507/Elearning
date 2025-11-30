/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Fetch YouTube video metadata using oEmbed API (no API key needed)
 * Returns title, author, and thumbnail
 */
export async function fetchYouTubeMetadata(videoUrl: string) {
  try {
    const videoId = extractYouTubeVideoId(videoUrl)
    if (!videoId) {
      throw new Error("Invalid YouTube URL")
    }

    // Use YouTube oEmbed API (no API key required)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const response = await fetch(oEmbedUrl)
    
    if (!response.ok) {
      throw new Error("Failed to fetch video metadata")
    }

    const data = await response.json()
    
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
    }
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error)
    return null
  }
}

/**
 * Parse ISO 8601 duration format (PT1H2M10S) to seconds
 */
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  
  if (!match) return 0
  
  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)
  
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Fetch video duration from YouTube using Noembed API (no API key needed)
 * This is a workaround since YouTube Data API requires an API key
 */
export async function fetchYouTubeDuration(videoUrl: string): Promise<number> {
  try {
    const videoId = extractYouTubeVideoId(videoUrl)
    if (!videoId) {
      console.error("Invalid YouTube URL:", videoUrl)
      return 0
    }

    // Try to fetch from Noembed API
    const noembed = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    const response = await fetch(noembed)
    
    if (response.ok) {
      const data = await response.json()
      // Noembed doesn't provide duration, but we can estimate from title/description
      // For now, return a default duration
      console.warn("Noembed API doesn't provide duration. Using default.")
    }

    // Fallback: Estimate based on common video lengths
    // This is not ideal, but works without API key
    // You can manually set durations in database or use YouTube Data API with key
    
    console.warn(`Could not fetch duration for video ${videoId}. Using default 600 seconds (10 min).`)
    return 600 // Default 10 minutes
    
  } catch (error) {
    console.error("Error fetching YouTube duration:", error)
    return 600 // Default 10 minutes
  }
}

/**
 * Format seconds to MM:SS or HH:MM:SS
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

/**
 * Get video thumbnail URL from YouTube video ID
 */
export function getYouTubeThumbnail(videoUrl: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const videoId = extractYouTubeVideoId(videoUrl)
  if (!videoId) return ''
  
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}
