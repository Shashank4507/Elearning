"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface WatchHistoryItem {
  _id: string
  videoId: string
  videoTitle: string
  watchedAt: string
  duration: number
  totalDuration: number
  progress: number
  completed: boolean
}

interface WatchHistoryTableProps {
  data: WatchHistoryItem[]
}

export function WatchHistoryTable({ data }: WatchHistoryTableProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Video Title</TableHead>
          <TableHead>Watched At</TableHead>
          <TableHead>Duration Watched</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.videoTitle}</TableCell>
            <TableCell>{format(new Date(item.watchedAt), "MMM dd, yyyy HH:mm")}</TableCell>
            <TableCell>
              {formatDuration(item.duration)} / {formatDuration(item.totalDuration)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                </div>
                <span className="text-sm">{Math.round(item.progress)}%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={item.completed ? "default" : "secondary"}>
                {item.completed ? "Completed" : "In Progress"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
