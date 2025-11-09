# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reviseo is a visual feedback collection platform for web developers and their clients. The application allows:
- **Developers** to create websites/projects and install a feedback widget
- **Clients** to submit visual feedback (screenshots with annotations) on websites
- **Both** to track and manage feedback with status updates and priorities

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with email OTP and GitHub OAuth
- **Storage**: AWS S3 (via custom endpoint) for screenshots and annotations
- **UI**: Radix UI components, Tailwind CSS, shadcn/ui components
- **Email**: Resend for transactional emails
- **Screenshot**: Puppeteer (with @sparticuz/chromium for serverless)

## Development Commands

### Running the app
```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server
```

### Database operations
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
```

Note: Prisma client is generated to `./prisma/generated/client` (custom output path)

### Code quality
The project uses Biome for linting/formatting (configured in package.json as `@biomejs/biome`). There are no scripts defined for linting, so run Biome directly if needed:
```bash
npx biome check .     # Check for issues
npx biome format .    # Format code
```

## Architecture

### Route Groups and Layouts

The app uses Next.js route groups for distinct application sections:

- **`app/(main)`**: Public marketing pages, auth pages, and authenticated sections
  - **`app/(main)/(auth)`**: Login and email verification pages (uses custom auth layout)
  - **`app/(main)/(onboarding)`**: Onboarding flow for new developers (separate layout)
  - **`app/(main)/(dashboard)`**: Main dashboard for developers to manage websites and feedback

- **`app/widget`**: Isolated widget application that runs in client websites
  - `/widget/modal` - Main feedback submission modal (Excalidraw annotations)
  - `/widget/trigger` - Widget trigger button
  - Uses separate layout with custom CSS (`widget.css`)

- **`app/api`**: API routes
  - `/api/auth/[...all]` - Better Auth endpoints
  - `/api/s3/*` - S3 operations (upload, delete, presigned URLs)
  - `/api/puppeteer` - Screenshot generation
  - `/api/websites/verify/[projectId]` - Widget installation verification

### Database Schema (Key Models)

- **Website**: Central model linking developers to projects
  - `projectId` (UUID): Public identifier for widget installation
  - `widgetInstalled` + `verifiedAt`: Track widget installation status
  - `screenshotUrl`: Auto-captured site preview
  - Relations: developer (User), client (User, optional during onboarding), feedback, invites

- **Feedback**: Visual feedback submissions
  - Stores screenshot in S3 (`screenshotKey`)
  - Tracks status (NEW, IN_PROGRESS, RESOLVED), type (BUG, IMPROVEMENT), priority
  - Captures browser metadata (browser, OS, viewport, etc.)
  - Relations: website, author (User, optional for anonymous feedback)

- **User**: Dual-role model (developer or client)
  - `role`: "developer" | "client" | "admin"
  - `hasCompletedOnboarding`: Tracks onboarding completion
  - Better Auth manages sessions and accounts

- **Invite**: Client invitation system
  - Token-based invites with expiration
  - Status: PENDING, ACCEPTED, REVOKED
  - On user creation, checks for pending invites to set role to "client"

### Authentication Flow

- Uses Better Auth with Prisma adapter
- Email OTP authentication (magic links) + GitHub OAuth
- Custom user fields: `role` and `hasCompletedOnboarding`
- Database hook: On user creation, checks for pending invites → assigns "client" role
- Session management with cookies (`sameSite: "none"` for widget cross-origin)
- Auth utility: `requireUser()` in `app/data/require-user.ts` for protected routes

### Data Access Patterns

- **Server-side data fetching**: Use `app/data/` directory for reusable data queries
  - Example: `app/data/user/get-user-data.ts`, `app/data/website/get-website-by-id-and-dev-id.ts`
  - Always use `"server-only"` directive in data files
  - Cache queries with React's `cache()` when appropriate

- **Actions**: Server actions typically colocated in `actions.ts` files within feature directories
  - Example: `app/(main)/(dashboard)/dashboard/websites/actions.ts`

### Component Organization

- **Global components**: `components/` - Reusable UI components
  - `components/ui/` - shadcn/ui and custom UI primitives
  - `components/landing/` - Marketing/landing page sections

- **Feature components**: Colocated in `_components/` directories next to routes
  - Example: `app/(main)/(dashboard)/dashboard/_components/`
  - Naming pattern: PascalCase (e.g., `CreateWebsiteDialog.tsx`)

### Widget System

The feedback widget is a separate Next.js application embedded in client websites:

- Built as iframe or modal injection
- Excalidraw integration for annotations on screenshots
- Network and console logging hooks (`useNetworkLogger`, `useConsoleLogger`)
- Styled with isolated CSS (`widget.css`) to avoid conflicts
- Communicates with main app via API routes

### S3 Storage Buckets

Three separate buckets managed via environment variables:
- `NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS` - Website preview screenshots
- `NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS` - Feedback screenshot annotations
- `NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS` - General file uploads

S3 client configured in `lib/s3client.ts` with custom endpoint support.

### Environment Variables

Managed with `@t3-oss/env-nextjs` in `lib/env.ts`:
- Validates all env vars at build time
- Separates server-only and client vars (`NEXT_PUBLIC_*`)
- Required vars: Database, Auth (Better Auth + GitHub), Resend, AWS S3, Router token

## Development Guidelines

### Path Aliases

TypeScript is configured with `@/*` alias mapping to root:
```typescript
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
```

### Prisma Usage

Always import from the custom generated path:
```typescript
import { PrismaClient } from "@/prisma/generated/client"
```

Use the singleton instance from `lib/db.ts`:
```typescript
import { prisma } from "@/lib/db"
```

### Working with Better Auth

- Auth instance: `lib/auth.ts`
- Client hooks: Use `lib/auth-client.ts`
- Protect routes: Import `requireUser()` from `app/data/require-user.ts`
- API routes: Get session with `auth.api.getSession({ headers })`

### Onboarding Flow

New developers go through a multi-step onboarding:
1. Welcome
2. Create website
3. Install widget (with verification)
4. Invite client (optional)
5. Success

Components in `app/(main)/(onboarding)/onboarding/_components/`

### Screenshot Generation

- Puppeteer endpoint: `/api/puppeteer`
- Uses `@sparticuz/chromium` for serverless compatibility
- Captures website screenshots on-demand
- Stores in S3 site screenshots bucket

## Testing

No testing scripts are currently defined in package.json.

## Common Gotchas

- Dev indicators are disabled (`devIndicators: false` in next.config.ts) to avoid conflicts with widget
- Prisma client output is in `./prisma/generated/client`, not default location
- Better Auth cookies use `sameSite: "none"` for widget cross-origin access
- Widget routes are completely isolated from main app (separate layout)
