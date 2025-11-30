import { Card } from "@/components/ui/card"
import { PlayCircle, Eye } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: number
  progress?: number
}

export function VideoCard({ id, title, thumbnail, duration, views, progress = 0 }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Link href={`/video/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <PlayCircle className="h-12 w-12 text-white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {formatDuration(duration)}
          </div>
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{views} views</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
