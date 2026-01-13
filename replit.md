# Account System

## Overview

This is an Arabic-language accounting and treasury management system built with Next.js. The application provides cash flow management, customer tracking, payments processing, and financial reporting capabilities. The interface is designed for right-to-left (RTL) display to support Arabic language requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router and React Server Components (RSC) enabled
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist and Geist Mono via next/font

### Layout Structure
- RTL (right-to-left) layout for Arabic language support
- Sidebar-based navigation using a custom sidebar component
- Route groups used for page organization (e.g., `(root)` group)

### Backend Architecture
- **API Pattern**: Server Actions for form handling and mutations
- **Validation**: Zod schemas for input validation with Arabic error messages
- **Data Flow**: Server-side form processing with `useFormState` hook for client feedback

### Data Storage
- **Database**: MongoDB with Mongoose ODM
- **Connection Pattern**: Cached connection singleton to prevent multiple connections in development
- **Models**: 
  - Treasury - manages cash accounts with currency and balance settings
  - CashTransaction - tracks money in/out with transaction types, methods, and reasons

### Key Design Decisions

1. **Server Actions over API Routes**: Form submissions use Next.js Server Actions for simpler data mutation handling and automatic revalidation

2. **Mongoose for MongoDB**: Chosen for schema-based modeling with validation, providing type safety for MongoDB documents

3. **Component Organization**: 
   - `components/ui/` - Reusable shadcn/ui base components
   - `components/forms/` - Form-specific components
   - `components/layout/` - Layout components like sidebar
   - `components/pages/` - Page-specific composite components

4. **Path Aliases**: Uses `@/*` import alias for clean imports from project root

## External Dependencies

### Database
- **MongoDB**: Primary database (connection via `MONGODB_URI` environment variable)
- **Mongoose v9**: ODM for MongoDB with schema validation

### UI Libraries
- **Radix UI**: Accessible component primitives (Dialog, Label, Select, Separator, Slot, Tooltip)
- **Chart.js**: Data visualization for financial charts and reports

### Validation
- **Zod v4**: Schema validation for form inputs and data integrity

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string