# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reviseo is a visual feedback collection platform for web agencies and freelancers:
- **Workspaces (organizations)** own websites. Every developer gets a personal workspace; agencies invite teammates (owner/admin/member roles).
- **Members** create websites/projects and install the feedback widget.
- **Clients** (external, per-website) submit visual feedback — screenshots annotated in Excalidraw.
- Feedback is tracked with status (NEW/IN_PROGRESS/RESOLVED), type, and priority.

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma 7 (driver adapters: Neon in prod, pg locally)
- **Authentication**: Better Auth — email OTP, GitHub OAuth, **organization plugin** (workspaces/roles)
- **Billing**: Polar via `@polar-sh/better-auth` — optional; disabled when POLAR_* env vars are unset (local dev)
- **Storage**: S3-compatible (Tigris/T3 in prod, MinIO locally) for screenshots, annotations, avatars
- **UI**: Radix UI, Tailwind 4, shadcn/ui
- **Email**: Resend (stubbed to console logs in development)
- **Screenshot**: site-preview capture currently disabled (puppeteer removed — see lib/screenshot.ts note); widget screenshots are client-side via snapdom

## Local development

See the root README. Short version: `docker compose up -d` (postgres + MinIO), `pnpm db:push`, `pnpm dev`. OTP codes and emails print to the dev-server console (`[dev-otp]`, `[dev-email]`, `[dev-org-invite]`).

## Commands

```bash
pnpm dev / build / start
pnpm lint / lint:fix      # Biome (generated code is excluded in biome.json)
pnpm typecheck            # tsc --noEmit
pnpm db:generate / db:push
```

Prisma client output: `./prisma/generated/client` (custom path).

## Architecture

### Route groups

- `app/(main)/(landing)` — marketing, blog, auth (`(auth)`: login, verify-request, invite, accept-invitation), onboarding (`(onboarding)`)
- `app/(main)/(dashboard)/dashboard` — websites, feedback, **team** (org member management), settings
- `app/widget` — isolated iframe app (trigger button + Excalidraw modal), separate root layout
- `app/api` — auth, S3 (presign/serve), widget allowed-check, install verification, Outrank webhook

### Authorization model (important)

- `app/data/require-user.ts` — `requireUser()`: session or redirect (server components only).
- `app/data/require-member.ts` — `requireMember()`: session + active organization + role; **self-heals** missing personal workspaces and stale `activeOrganizationId`. `getAuthorizedWebsite(id)` scopes a website to the caller's active org. `canManage(role)` = owner/admin.
- `app/data/api-auth.ts` — `getApiSession()` (401-friendly, no redirect) and `userCanAccessWebsite()` for route handlers.
- **Every server action and API route must scope by organization** — never trust IDs from the client without an ownership check.
- Route handlers return 401 JSON; never use `requireUser()` (it redirects) inside `app/api`.

### Data access

- Shared Prisma `select` objects live in `app/data/selects.ts` (`userPublicSelect`, `feedbackSelect`, `websiteSelect`, `websiteOverviewSelect`). Never select Better Auth `sessions`/`accounts` into UI payloads.
- `app/data/user/get-user-data.ts` — org-scoped dashboard data (websites named `developerWebsites` for legacy UI compatibility).
- Server-side S3 goes through `lib/storage.ts`; screenshots via `lib/screenshot.ts` (includes the SSRF guard `isSafeExternalUrl`). Never self-fetch our own API routes from server code.

### Organizations (Better Auth)

- Plugin config in `lib/auth.ts`; client in `lib/auth-client.ts` (`authClient.organization.*`, `useListOrganizations`, `useActiveOrganization`).
- Signup hooks: pending feedback-client invite → role `client`; pending org invitation → no personal workspace; otherwise auto-create personal workspace (owner).
- Prisma models `Organization`/`Member`/`Invitation` (+ `Session.activeOrganizationId`). `Website.organizationId` is ownership; `developerId` is the creator/notification target.
- Team UI: `dashboard/team` (invite/remove members, change roles, rename workspace, pending invitations); org switcher in the sidebar.
- Prod migration helper: `prisma/backfill-orgs.ts`.

### Widget system

- `/widget` (Vite + Preact) builds the IIFE loader → `web/public/cdn/reviseo.js`. **`VITE_WIDGET_ORIGIN` is baked in at build time** — set it before `pnpm build`.
- Handshake: trigger iframe retries `HEALTH_CHECK` until parent acks; membership/client check via `/api/widget/allowed` (session-based).
- Snippet generators: `generateWidgetScriptMinified/Formatted` in `lib/utils.ts`; install verification at `/api/websites/verify/[projectId]` matches config + script URL.
- Annotation flow: snapdom screenshot → Excalidraw → SVG (base64-embedded PNG) → presigned PUT (≤15MB) → `Feedback.screenshotKey`.

### Environment variables

`lib/env.ts` (t3-env). POLAR_* are optional — absence disables billing entirely (`billingEnabled` in `lib/polar.ts`). `S3_FORCE_PATH_STYLE=true` for MinIO. Cookies: `sameSite:"none"` only on HTTPS origins (see `lib/auth.ts`).

## Gotchas

- `devIndicators: false` (would overlap the widget).
- Two root layouts (`(main)` and `widget`) — no top-level `app/layout.tsx`.
- Restart `pnpm dev` after `prisma generate` — the global Prisma singleton survives HMR with the old client.
- Use `isPrismaError(e, "P2002")` from `lib/db-errors.ts`, not `instanceof PrismaClientKnownRequestError` (unreliable with the custom client output).
- Widget e2e locally: serve `/example` on localhost (e.g. `python3 -m http.server 5500`) — localhost ports are same-site, so lax cookies work in the iframes.
