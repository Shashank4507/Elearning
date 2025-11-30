"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface AnalyticsChartsProps {
  watchData: any[]
  categoryData: any[]
}

export function AnalyticsCharts({ watchData, categoryData }: AnalyticsChartsProps) {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Watch Time Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Watch Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={watchData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="minutes" stroke="#3b82f6" name="Minutes Watched" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Videos by Category */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Videos by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Completion Rate Bar Chart */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Course Completion Rates</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completion" fill="#10b981" name="Completion Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
