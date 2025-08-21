# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quarter Fusion is a Next.js 15 restaurant website with admin dashboard, order management, and integrated payment/email systems. The application uses TypeScript, MongoDB with Mongoose, NextAuth for authentication, and Tailwind CSS v4 for styling.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbo (preferred)
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run seed` - Initialize database with menu data
- `npm run test:admin` - Test admin access functionality

## Architecture Overview

### Database Layer
- MongoDB with Mongoose ODM
- Models in `lib/models/`: Category, Menu, MenuItem, Order, Settings
- Connection management via `lib/mongodb.ts` with connection caching
- Database seeding via `scripts/seed.ts`

### Authentication & Authorization
- NextAuth.js for authentication
- Role-based access control (admin role required for admin routes)
- Middleware in `middleware.ts` protects admin routes
- Admin credentials managed via environment variables

### API Structure
- REST API routes in `app/api/`
- Protected admin endpoints for CRUD operations
- File upload support via Cloudinary integration
- Email notifications via Nodemailer (Gmail SMTP)

### Frontend Architecture
- Next.js 15 App Router with TypeScript
- Server-side components by default
- Order management via React Context (`app/contexts/OrderContext.tsx`)
- Responsive design with mobile-first approach

### Key Features
- Public restaurant website with menu display
- Admin dashboard for order/menu management
- Order processing (click-and-collect, delivery)
- Email notifications for orders
- Image upload for menu items

## Environment Configuration

Copy `env.example` to `.env.local` and configure:
- `MONGODB_URI` - MongoDB Atlas connection string
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` - NextAuth configuration
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` - Admin credentials
- Email SMTP settings for order notifications
- Cloudinary credentials for image uploads

## File Structure Notes

- `app/data/siteData.ts` - Centralized site configuration and content
- `app/components/` - Reusable UI components
- `app/admin/` - Admin dashboard pages (protected routes)
- `app/commander/` - Order pages for customers
- `lib/` - Shared utilities and database models
- `scripts/` - Database seeding and utility scripts

## Testing & Debugging

- Use `npm run test:admin` to verify admin authentication
- Check `scripts/check-env.js` for environment validation
- MongoDB connection logs appear in console during development

## Important Conventions

- All admin routes require authentication via middleware
- Database operations use cached connections to prevent connection exhaustion
- Email templates are embedded in `lib/email.ts`
- French language content throughout (site is for French restaurant)
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)