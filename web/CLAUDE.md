# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reviseo is a visual feedback tool for websites. It allows developers to collect annotated screenshots from clients, managing feedback through a developer-client relationship model. The application uses Next.js 15 with React 19, TypeScript, Prisma ORM, and Better Auth for authentication.

## Commands

### Development
```bash
pnpm dev                # Start development server with Turbopack
pnpm build              # Build for production with Turbopack
pnpm start              # Start production server
```

### Database
```bash
pnpm db:generate        # Generate Prisma client
pnpm db:push            # Push schema changes to database
```

Note: Prisma client is generated to `./prisma/generated/client` (not the default location).

### Deployment
```bash
pnpm vercel-build       # Production build command for Vercel (pushes DB + builds)
```

## Architecture

### App Structure (Next.js App Router)

The application uses Next.js route groups for organization:

- **`(auth)/`** - Authentication pages (login, verify-request)
- **`(dashboard)/`** - Authenticated dashboard routes (dashboard, websites, clients, settings)
- **`(onboarding)/`** - Onboarding flow for new developers
- **`api/`** - API routes (auth, s3, websites)
- **`data/`** - Server-side data access layer

### Key Patterns

**Data Access Layer**: All database queries should go through the `app/data/` directory. Server components fetch data using functions from this layer.

**Authentication**: The app uses Better Auth with:
- GitHub OAuth provider
- Email OTP for passwordless login
- Custom `requireUser()` helper at `app/data/require-user.ts` for protected routes

**Database Schema**: The core data model revolves around:
- `User` - Both developers and clients (distinguished by relationships)
- `Website` - Projects owned by developers, optionally linked to clients via `clientId`
- `Feedback` - Visual feedback items with annotated SVG screenshots
- `Invite` - Client invitation system for website access

Each `Website` has a unique `projectId` used for widget installation.

**Onboarding Flow**: Multi-step process for new developers:
1. Welcome screen
2. Create website
3. Install widget (provides projectId-based snippet)
4. Invite client (optional)
5. Success/completion

The flow uses React state and `useTransition` for optimistic UI updates. Website creation happens at step 2, generating a `projectId` that's used in step 3 for widget installation.

### UI Components

Uses shadcn/ui component library with:
- Path alias: `@/` maps to project root
- Components in `components/ui/` (excluded from ESLint)
- Custom components in `components/` (site-header, app-sidebar, nav-main, etc.)
- Multiple registry support: @reui, @aceternity, @magicui

Theme: "new-york" style with neutral base color and CSS variables.

### Environment Variables

Environment variables are validated at build time using `@t3-oss/env-nextjs` (see `lib/env.ts`).

Required server variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` & `BETTER_AUTH_URL`
- `AUTH_GITHUB_CLIENT_ID` & `AUTH_GITHUB_SECRET`
- `RESEND_API_KEY` - For transactional emails
- AWS S3 credentials (5 variables for custom S3-compatible storage)

Required client variables:
- `NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS`

### File Storage

The app uses S3-compatible storage (configured via AWS SDK) for:
- User-uploaded feedback screenshots
- Annotated SVG files

See `lib/s3client.ts` for the S3 client configuration.

### Authentication Flow

Better Auth configuration at `lib/auth.ts` includes:
- Prisma adapter with PostgreSQL
- Custom `hasCompletedOnboarding` field on User model (cannot be set by users directly)
- Email OTP plugin with 10-minute expiry
- Transactional emails via Resend

Use `requireUser()` in Server Components to enforce authentication. It redirects to `/login` if unauthenticated.

### Important Files

- `lib/validations.ts` - Zod schemas for form validation
- `lib/try-catch.ts` - Error handling utility for async operations
- `lib/getDomain.ts` - Domain extraction utility
- `components/email/` - React Email templates
- `prisma/schema.prisma` - Database schema with Better Auth integration

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Module resolution: bundler (for Next.js 15 compatibility)

## Development Notes

- The app uses **pnpm** as the package manager (lockfile present)
- Database migrations use `prisma db push` (schema-first development, not migration files)
- Prisma generates client to non-standard location: `prisma/generated/client`
- ESLint ignores: node_modules, .next, build, generated files, and `components/ui/**`
- No test suite currently configured
- Biome is available for formatting but no config file present (using defaults)
