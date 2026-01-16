# News Portal - Implementation Plan

## Project Overview
A sophisticated, modern news portal platform built with Next.js 15 (App Router), MongoDB, and designed to serve both web and mobile (Flutter) applications.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose ORM
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Authentication**: NextAuth.js v5
- **API**: RESTful at `/api/v1`
- **Rich Text Editor**: Tiptap

## Phase 1: Foundation & Core Models ✅ In Progress

### 1.1 Database Models
- [ ] User Model (with roles: Admin, Editor, Author, User)
- [ ] Post/Article Model (with slug, status, SEO fields)
- [ ] Category Model (hierarchical support)
- [ ] Tag Model
- [ ] Media/Image Model (for Cloudinary integration)
- [ ] Comment Model (optional)

### 1.2 Authentication Setup
- [ ] Install NextAuth.js v5
- [ ] Configure Email/Password provider
- [ ] Configure Google OAuth provider
- [ ] Create auth middleware for protected routes
- [ ] Setup role-based access control (RBAC)

### 1.3 API Layer (v1)
- [ ] GET /api/v1/posts - List posts with pagination
- [ ] GET /api/v1/posts/[slug] - Get single post
- [ ] POST /api/v1/posts - Create post (Admin only)
- [ ] PATCH /api/v1/posts/[id] - Update post
- [ ] DELETE /api/v1/posts/[id] - Delete post
- [ ] GET /api/v1/categories - List categories
- [ ] POST /api/v1/categories - Create category
- [ ] GET /api/v1/tags - List tags
- [ ] POST /api/v1/upload - Upload images to Cloudinary

## Phase 2: Shadcn/UI + Design System

### 2.1 Install & Configure Shadcn/UI
- [ ] Initialize Shadcn/UI
- [ ] Install core components (Button, Card, Input, Dialog, etc.)
- [ ] Setup theme tokens (colors, typography, spacing)
- [ ] Configure dark mode support

### 2.2 Shared Components
- [ ] Header/Navigation component
- [ ] Footer component
- [ ] Article Card component
- [ ] Category Badge component
- [ ] Loading Skeletons
- [ ] SEO component (metadata wrapper)

## Phase 3: Public Website (Visitors)

### 3.1 Homepage
- [ ] Breaking News Ticker
- [ ] Hero Section (featured article)
- [ ] Category-wise news blocks (grid layout)
- [ ] Trending/Popular articles sidebar
- [ ] Newsletter subscription form
- [ ] Responsive design (mobile-first)

### 3.2 Article Detail Page
- [ ] Dynamic route: `/news/[slug]`
- [ ] Article content with rich text rendering
- [ ] Author info card
- [ ] Related articles section
- [ ] Social share buttons
- [ ] Comment section (optional)
- [ ] SEO metadata (OpenGraph, Twitter Cards)

### 3.3 Category Archive Page
- [ ] Dynamic route: `/category/[slug]`
- [ ] Filtered posts by category
- [ ] Pagination
- [ ] Breadcrumbs

### 3.4 Search Functionality
- [ ] Search page with filters
- [ ] Search API endpoint
- [ ] Search bar in header

### 3.5 Additional Pages
- [ ] About page
- [ ] Contact page
- [ ] Privacy Policy
- [ ] Terms of Service

## Phase 4: Admin Dashboard (CMS)

### 4.1 Dashboard Layout
- [ ] Sidebar navigation
- [ ] Top bar with user menu
- [ ] Protected route middleware
- [ ] Role-based menu items

### 4.2 Analytics Dashboard
- [ ] Total posts count
- [ ] Total views
- [ ] Trending posts chart
- [ ] Recent activity feed
- [ ] User statistics

### 4.3 Post Management
- [ ] Posts list page (with filters, search)
- [ ] Create new post page (with rich text editor)
- [ ] Edit post page
- [ ] Delete confirmation
- [ ] Draft/Published status toggle
- [ ] Featured post toggle
- [ ] SEO fields (meta title, description)

### 4.4 Rich Text Editor
- [ ] Integrate Tiptap editor
- [ ] Image upload button (Cloudinary)
- [ ] Formatting tools (bold, italic, headings, lists)
- [ ] Code blocks
- [ ] Link insertion

### 4.5 Category & Tag Management
- [ ] Categories CRUD
- [ ] Tags CRUD
- [ ] Hierarchical category support

### 4.6 User Management (Optional)
- [ ] Users list
- [ ] Role assignment
- [ ] User creation/deletion

## Phase 5: SEO & Performance

### 5.1 SEO Optimization
- [ ] Dynamic metadata generation
- [ ] OpenGraph tags
- [ ] Structured data (Article schema)
- [ ] XML sitemap generation
- [ ] robots.txt

### 5.2 Performance
- [ ] Image optimization (next/image)
- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Caching strategy
- [ ] CDN setup for static assets

## Phase 6: Polish & Testing

### 6.1 Responsive Design Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet Portrait (481px - 768px)
- [ ] Tablet Landscape (769px - 1024px)
- [ ] Laptop (1025px - 1440px)
- [ ] Desktop (1441px+)

### 6.2 Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 6.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios

## Phase 7: Deployment

- [ ] Environment variables setup
- [ ] Build optimization
- [ ] Deploy to Vercel/Railway
- [ ] MongoDB Atlas configuration
- [ ] Domain configuration
- [ ] SSL certificate

## Dependencies to Install

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta",
    "@auth/mongodb-adapter": "latest",
    "bcryptjs": "^2.4.3",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "cloudinary": "^2.0.0",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.4.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

## Current Status
- ✅ Next.js 15 project initialized
- ✅ Tailwind CSS v4 configured
- ✅ MongoDB connection established
- ✅ Project structure created
- 🔄 Starting Phase 1: Database Models
