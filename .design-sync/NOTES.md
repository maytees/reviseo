# Design-sync notes — Reviseo

- App repo, not a packaged DS: bundle entry is the committed barrel `web/ds-sync.entry.tsx` (cfg.entry). Add new components there AND in `componentSrcMap`.
- `@/lib/utils` imports t3-env (`lib/env.ts` runs `createEnv` at module init → `process is not defined` in a browser bundle). The build maps it to `.design-sync/shims/utils.ts` via `tsconfig.bundle.json` paths. **If `cn` in `web/lib/utils.ts` ever changes, update the shim.**
- CSS: Tailwind v4 compiled by `buildCmd` (`pnpm dlx @tailwindcss/cli@4`) from `.design-sync/tw-entry.css` → `web/.ds-tailwind.css` (gitignored, cssEntry). Entry adds Google-Fonts imports for Inter + JetBrains Mono (app serves them via next/font, which can't ship). **Always run buildCmd before package-build — preview utility classes only exist after recompile** (`@source "./previews"` in tw-entry.css).
- Groups come from `.design-sync/docs/<Name>.md` frontmatter category stubs (Forms/Overlays/Display/Feedback) — real docs don't exist; prompt bodies are synthesized.
- Overlay previews use `open`/`defaultOpen` + `cardMode: single` overrides (Dialog, AlertDialog, DropdownMenu, Popover, Tooltip); Table is `cardMode: column`.
- Skeleton uses `bg-card/20` (white @ 20%) — invisible on white; its preview wraps blocks in a `bg-background` surface like `dashboard/loading.tsx` does.
- Playwright pin: cached chromium build 1234 ⇒ `playwright@1.62.1` in `.ds-sync/node_modules`.

## Known render warns

- `[TOKENS_MISSING]` ~29 vars (`--radix-*`, `--skeleton-width`, `--sidebar-width`, `--x`, `--width`, …) — all runtime-set by components/utilities; rendered previews confirmed fine.
- `[FONT_REMOTE]` Inter / Caudex / JetBrains Mono — deliberate (Google Fonts at runtime, see above).
- `[CSS_IMPORT...]`: none.

## Re-sync risks

- The `cn` shim duplicates 3 lines of `web/lib/utils.ts` — silent rot if the app customizes twMerge config.
- Select open-state, hover states, and drag interactions are not previewed (static-render limits); Select shows closed trigger states only.
- Compiled CSS content-scans `web/**` — a class used ONLY in `.design-sync/previews/` still compiles (via @source), but a class in neither place won't exist for the design agent; conventions.md names only verified classes.
- Fonts fetched from Google at render time — offline viewers fall back to system fonts.
- Component subset is scoped (22 core). ~38 more PascalCase exports live in `web/components/ui` (kanban, sonner, calendar, carousel, sidebar, shadcn-io/*, …) — extend barrel + componentSrcMap + docs stub to add one; `hero-badge.tsx` imports next/* and must NOT enter the barrel.
