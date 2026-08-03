# Reviseo

Visual feedback collection platform — agencies and freelancers install a widget on client sites; clients annotate screenshots (Excalidraw) and submit feedback straight to the dashboard.

## Repo layout

- `/web` — Next.js app (dashboard, marketing, widget iframes, API) — https://reviseo.app
- `/widget` — IIFE loader script (Preact + Vite); builds to `web/public/cdn/reviseo.js`
- `/example` — Example site using the widget; `pnpm dev:build` in `/widget` outputs to `/example/dist`

## Local development (local-first)

Everything runs locally: Postgres + MinIO via Docker, emails/OTP codes print to the server console, billing (Polar) is disabled.

```bash
# 1. Start infra (Postgres :5432, MinIO :9000, console :9001)
docker compose up -d

# 2. Install & push schema
cd web
pnpm install
pnpm db:push

# 3. Run the app
pnpm dev
```

Then open http://localhost:3000.

- **Login**: use email OTP — the code is printed in the `pnpm dev` terminal (`[dev-otp] ...`).
- **Emails**: logged to console (`[dev-email] ...`), never sent.
- **S3**: MinIO console at http://localhost:9001 (user `reviseo` / `reviseo_local_dev`).
- **Env**: `web/.env` ships with safe local values. Production values belong in your deployment platform, never in git.

### Widget development

```bash
cd widget
pnpm install
pnpm build        # builds against VITE_WIDGET_ORIGIN → web/public/cdn/reviseo.js
pnpm dev:build    # builds to example/dist for the example site
```

Set `VITE_WIDGET_ORIGIN` in `widget/.env` (`http://localhost:3000` for local, `https://reviseo.app` for production) **before** building — it is baked into the bundle.
