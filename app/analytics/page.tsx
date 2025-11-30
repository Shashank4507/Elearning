"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, LayoutDashboard, Settings, LogOut } from "lucide-react"
import { AnalyticsSummary } from "@/components/analytics-summary"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.id) return

      try {
        const res = await fetch(`/api/analytics?studentId=${session.user.id}`)
        const analytics = await res.json()
        setData(analytics)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchAnalytics()
    }
  }, [session])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block border-r bg-background/50 backdrop-blur">
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">ELearn</span>
          </div>
          <nav className="space-y-2 px-2 py-4">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="default" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Downloads
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Analytics</h1>
            <p className="text-muted-foreground">Track your learning progress and performance metrics</p>
          </div>

          {data && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <AnalyticsSummary stats={data.stats} />

              {/* Charts */}
              <AnalyticsCharts watchData={data.weekData} categoryData={data.categoryData} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
