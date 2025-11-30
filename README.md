# 🎓 E-Learning Platform

A modern, full-stack e-learning platform built with Next.js and MongoDB, featuring video streaming, watch history tracking, and comprehensive analytics.

## ✨ Overview

This platform enables students to watch educational videos, track their progress, and analyze their learning patterns through an intuitive dashboard and powerful analytics. Built with modern web technologies, it provides a seamless learning experience with real-time progress tracking and insightful data visualizations.

## 🚀 Key Features

### 📺 Video Learning
- HTML5 video player with full controls (play/pause, seek, volume, fullscreen)
- Auto-save progress every 30 seconds
- Resume from where you left off
- Skip forward/backward (10-second intervals)
- Automatic completion tracking (marks complete at 90%)

### 📊 Analytics Dashboard
- Total watch time and videos completed
- Learning streak tracking (consecutive days)
- Average completion rate
- Weekly watch time charts
- Category distribution analysis
- Performance metrics by course category

### 👨‍🎓 Student Dashboard
- Real-time learning statistics
- Video library with thumbnails
- Complete watch history
- Progress tracking for each video
- Responsive design for all devices

### 🔐 Authentication
- Secure sign-in/sign-up with NextAuth.js
- Email-based authentication
- Protected routes and API endpoints
- Session management

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5.9.3
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** TailwindCSS 3.4.18
- **Charts:** Recharts 3.5.0
- **Icons:** Lucide React
- **Theme:** Dark/Light mode with next-themes

### Backend
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js
- **API:** Next.js API Routes
- **Video Source:** YouTube integration

### Additional Tools
- **Forms:** React Hook Form with Zod validation
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Deployment Ready:** Optimized for Vercel

## 📦 What's Included

- 🎨 50+ pre-built UI components (shadcn/ui)
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🎯 Real-time data synchronization
- 📈 Interactive data visualizations
- 🔒 Secure authentication system
- 🎬 Custom video player with advanced controls
- 📊 Comprehensive analytics engine

## 🎯 Use Cases

- **Students:** Track learning progress, watch educational videos, analyze study patterns
- **Educators:** Monitor student engagement and completion rates
- **Organizations:** Manage online training programs with detailed analytics

## 🏗️ Architecture

### Database Collections
- **students** - User profiles and enrolled courses
- **videos** - Video metadata, URLs, and thumbnails
- **courses** - Course information and categories
- **watchHistory** - Viewing sessions with timestamps and progress
- **users** - Authentication and account data

### API Endpoints
- Video management (CRUD operations)
- Watch history tracking and retrieval
- Analytics data aggregation
- YouTube video information fetching
- User authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- pnpm package manager

### Quick Setup
1. Clone the repository
2. Install dependencies with `pnpm install`
3. Create `.env.local` with your MongoDB URI and other credentials
4. Run `pnpm dev` to start development server
5. Open `http://localhost:3000`

## 🎨 Design Philosophy

Built with a focus on user experience, the platform features:
- Clean, modern interface
- Intuitive navigation
- Smooth animations and transitions
- Accessible design patterns
- Mobile-first responsive layout

## 📄 License

MIT

---

**Built with ❤️ using Next.js and MongoDB**
