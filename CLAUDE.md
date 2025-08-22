# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quarter Fusion is a Next.js 15 restaurant website with admin dashboard, order management, and integrated payment/email systems. The application uses TypeScript, MongoDB with Prisma ORM, NextAuth v5 for authentication, and Tailwind CSS v4 for styling.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbo (preferred)
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run seed:prisma` - Initialize database with Prisma seeding
- `npm run test:admin` - Test admin access functionality
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client after schema changes

## Architecture Overview

### Database Layer
- MongoDB with Prisma ORM (migrated from Mongoose)
- Models: Category, Menu, Order, Settings, User (defined in `prisma/schema.prisma`)
- Connection management via `lib/prisma.ts` with singleton pattern
- Both `.env` and `.env.local` files needed (Prisma reads `.env`, Next.js reads `.env.local`)
- Database seeding via `scripts/seed-prisma.ts`

### Authentication & Authorization
- NextAuth.js v5 (migrated from v4)
- Credentials provider with bcrypt password hashing
- Role-based access control (admin role required for admin routes)
- Middleware in `middleware.ts` protects admin routes
- Custom AuthContext in `contexts/AuthContext.tsx` handles hydration issues
- Admin users stored in database with hashed passwords

### API Structure
- REST API routes in `app/api/`
- Protected admin endpoints for CRUD operations
- Consistent response format: `{ success: boolean, data/error: any }`
- Special endpoint `/api/menu/best-sellers` for dynamic homepage content
- All admin APIs require authentication and admin role verification

### Frontend Architecture
- Next.js 15 App Router with TypeScript
- Server-side components by default
- Modal-based admin interface for better UX:
  - `EditCategoryModal` - Modal for category editing
  - `DeleteCategoryModal` - Warning modal for category deletion
  - `EditMenuModal` - Modal for menu item editing
  - `LoginModal` - Modal-based admin authentication
- Custom hooks: `useHydrated` prevents SSR/client mismatches
- Order management via React Context in `contexts/OrderContext.tsx`

### Key Features
- Public restaurant website with menu display
- Modal-based admin dashboard for categories and menu management
- Auto-generated category slugs (non-editable)
- Compact admin table layouts for better space utilization
- Dynamic homepage with database-driven best sellers (HOT/NEW/TOP badges)
- Order processing (click-and-collect, delivery)
- Email notifications for orders

## Environment Configuration

Requires both `.env` and `.env.local` files:

**`.env` (for Prisma):**
```
DATABASE_URL="mongodb://connection-string"
```

**`.env.local` (for Next.js):**
- `DATABASE_URL` - MongoDB Atlas connection string
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` - NextAuth configuration
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` - Admin credentials
- Email SMTP settings for order notifications
- Cloudinary credentials for image uploads

## Database Schema Notes

Key models and relationships:
- `Category` has many `Menu` items (one-to-many)
- `Menu` items have badges (HOT, NEW, TOP) for homepage display
- `Menu` availability controlled by: `available`, `availableForClickAndCollect`, `availableForDelivery`
- Proper indexing on frequently queried fields
- Cascade deletion: deleting category removes associated menus

## Admin Interface Patterns

- All edit operations use modals instead of separate pages
- Category slugs are auto-generated and read-only
- Delete operations show warning modals with context (e.g., menu count)
- Tables use compact layouts with reduced padding and smaller images
- Consistent error handling with user-friendly messages
- Real-time updates after CRUD operations

## Common Development Issues

- **Hydration Errors**: Use `useHydrated` hook for client-only features
- **DarkReader Extension**: May cause hydration warnings (disable for localhost)
- **API Response Format**: Always include `_count` relations when frontend expects them
- **Port Conflicts**: Use `npx kill-port 3000` to free up development port
- **Prisma Schema Changes**: Run `npx prisma db push` and `npx prisma generate`

## File Structure Notes

- `components/admin/` - Modal components for admin interface
- `contexts/` - React context providers for state management  
- `hooks/` - Custom React hooks (useHydrated, useMenuData)
- `lib/prisma.ts` - Database connection singleton
- `lib/auth.ts` - NextAuth v5 configuration
- `prisma/schema.prisma` - Database schema definition
- `scripts/seed-prisma.ts` - Database seeding script

## Important Conventions

- All admin routes require authentication via middleware
- Database operations use singleton Prisma client to prevent connection exhaustion
- French language content throughout (site is for French restaurant)
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Modal components follow consistent naming: Edit[Model]Modal, Delete[Model]Modal
- API endpoints return consistent structure with include relations when needed