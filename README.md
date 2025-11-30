# E-Learning Video Watch History Platform

A MongoDB-based application for tracking and analyzing e-learning video watch history with real-time analytics.

## 🎯 Project Overview

This application demonstrates big data storage and processing using MongoDB for an e-learning platform. It tracks student video watch history, processes viewing patterns, and provides comprehensive analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- pnpm package manager

### Installation

1. **Install dependencies:**
```bash
pnpm install
```

2. **Configure MongoDB:**

Create a `.env.local` file in the root directory:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/elearning

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/elearning?retryWrites=true&w=majority
```

3. **Start MongoDB (if using local):**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

4. **Run the development server:**
```bash
pnpm dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
Elearning/
├── app/
│   ├── api/
│   │   ├── analytics/route.ts      # Analytics data processing
│   │   ├── videos/route.ts         # Video CRUD operations
│   │   └── watch-history/route.ts  # Watch history tracking
│   ├── analytics/page.tsx          # Analytics dashboard
│   ├── video/[id]/page.tsx         # Video player page
│   └── page.tsx                    # Student dashboard (home)
├── components/
│   ├── ui/                         # shadcn/ui components (50+)
│   ├── student-dashboard.tsx       # Main dashboard component
│   ├── video-player.tsx            # Custom video player
│   ├── analytics-charts.tsx        # Data visualizations
│   └── ...                         # Other custom components
├── lib/
│   ├── mongodb.ts                  # MongoDB connection
│   └── collections.ts              # Database collections
└── .env.local                      # Environment variables (create this)
```

## 🗄️ Database Schema

### Collections

#### `students`
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  enrolledCourses: [ObjectId],
  createdAt: Date
}
```

#### `videos`
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  courseId: ObjectId,
  duration: Number,        // in seconds
  url: String,
  thumbnail: String,
  uploadedAt: Date,
  views: Number
}
```

#### `watchHistory`
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  videoId: ObjectId,
  watchedAt: Date,
  duration: Number,        // seconds watched
  totalDuration: Number,   // total video duration
  completed: Boolean,      // auto-marked at 90%
  progress: Number         // percentage (0-100)
}
```

#### `courses`
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructor: String,
  category: String,
  price: Number,
  thumbnail: String,
  createdAt: Date
}
```

## 🎨 Features Implemented

### ✅ Student Dashboard
- Real-time statistics (videos watched, completed, hours, completion rate)
- Video grid with thumbnails
- Watch history table
- Responsive sidebar navigation
- Link to analytics

### ✅ Video Player
- Custom HTML5 video player with controls
- Play/pause, seek, volume, fullscreen
- Skip forward/backward (10 seconds)
- Automatic progress tracking (saves every 30 seconds)
- Progress indicator
- Completion tracking (auto-marks at 90%)

### ✅ Analytics Dashboard
- Total minutes watched
- Videos completed count
- Current streak (consecutive days)
- Average completion rate
- Weekly watch time chart (last 7 days)
- Category distribution pie chart
- Completion rates by category

### ✅ API Endpoints

**GET /api/videos**
- Fetch all videos or filter by courseId
- Returns video metadata with view counts

**POST /api/videos**
- Create new video entry
- Requires: title, courseId, duration, url

**GET /api/watch-history?studentId={id}**
- Fetch watch history for a student
- Sorted by most recent

**POST /api/watch-history**
- Save watch progress
- Auto-increments video view count
- Marks completion at 90% progress

**GET /api/analytics?studentId={id}**
- Complex analytics calculations
- Aggregates watch patterns
- Calculates streaks and averages
- Returns weekly and category data

## 🛠️ Technology Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5.9.3
- **Database:** MongoDB 7.0.0
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** TailwindCSS 3.4.18
- **Charts:** Recharts 3.5.0
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Theme:** next-themes

## 📊 Big Data Features

### Data Collection
- Automatic watch event tracking
- Timestamp-based recording
- Progress percentage calculation
- Completion status detection

### Data Processing
- Aggregation of watch time across students
- Time-series analysis (daily, weekly patterns)
- Category-based grouping
- Streak calculation algorithm
- Average completion rate computation

### Data Visualization
- Bar charts for time-series data
- Pie charts for category distribution
- Progress indicators
- Summary statistics cards
- Real-time updates

## 🔧 Troubleshooting

### Error: "MONGODB_URI environment variable is not defined"
**Solution:** Create `.env.local` file with your MongoDB connection string

### Error: "Cannot connect to MongoDB"
**Solutions:**
1. Ensure MongoDB is running (local)
2. Check connection string format
3. Verify network access (Atlas)
4. Check username/password (Atlas)

### No data showing
**Solution:** You need to seed the database with sample data. Create a seed script or manually insert data using MongoDB Compass or mongosh.

## 📝 Sample Data

### Insert Sample Video (using mongosh)
```javascript
use elearning

db.videos.insertOne({
  title: "Introduction to React Hooks",
  description: "Learn React Hooks basics",
  courseId: ObjectId(),
  duration: 600,
  url: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
  thumbnail: "/placeholder.jpg",
  uploadedAt: new Date(),
  views: 0
})
```

### Insert Sample Student
```javascript
db.students.insertOne({
  name: "John Doe",
  email: "john@example.com",
  enrolledCourses: [],
  createdAt: new Date()
})
```

## 🎓 Assignment Alignment

This project fulfills the assignment requirements:

**Requirement:** "Implement MongoDB based application to store big data for data processing and analyzing the results"

**Implementation:**
- ✅ MongoDB for data storage
- ✅ Watch history as big data source
- ✅ Complex data processing (analytics)
- ✅ Result analysis (charts and metrics)
- ✅ E-Learning platform context

## 🚧 Future Enhancements

- [ ] Course catalog page with search/filters
- [ ] Course detail page with enrollment
- [ ] Curriculum sidebar in video player
- [ ] Notes and discussion features
- [ ] Certificates section
- [ ] Achievement badges
- [ ] Database seed script
- [ ] User authentication
- [ ] Instructor dashboard

## 📄 License

MIT

## 👤 Author

Student Project - MongoDB Big Data Assignment
