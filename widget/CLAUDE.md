# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **feedback widget** built with Preact that can be embedded as a self-contained IIFE bundle into any website. The widget allows users to submit feedback with annotated screenshots of the current viewport.

### Key Architecture

- **Build Target**: Single-file IIFE bundle (`dist/feedback-widget.iife.js`) for easy embedding
- **Framework**: Preact (React alternative) with `preact/compat` for React ecosystem compatibility
- **Auto-initialization**: Widget automatically initializes on DOM ready and injects itself into the page
- **Shadow DOM Strategy**: Trigger button lives in shadow DOM for style isolation; dialog portal renders to regular DOM to allow Excalidraw's own shadow DOM to work properly
- **CSS Injection**: Widget styles injected both into shadow DOM (for trigger) and document head (for dialog/Excalidraw)
- **Screenshot Capture**: Uses `html2canvas-pro` to capture the current viewport, excluding the widget itself via `ignoreElements`
- **Annotation Canvas**: Integrates `@excalidraw/excalidraw` for drawing annotations on screenshots
- **UI Components**: Built with `@base-ui-components/react` (headless components) and styled with Tailwind CSS 4.x

### Component Structure

- **`src/index.tsx`**: Entry point with dual CSS injection strategy
  - Injects styles into document head for dialog/Excalidraw (global)
  - Creates shadow DOM for trigger button with scoped styles
  - Creates portal container in regular DOM (not shadow DOM) for dialog
- **`src/FeedbackWidget.tsx`**: Main component managing dialog state, screenshot capture, and form submission
  - Trigger button renders in shadow DOM (isolated from page styles)
  - Dialog portal renders to regular DOM via `portalContainer` prop
  - Opens a full-screen dialog with split layout: canvas (8/12) + form (4/12)
  - Captures screenshot on dialog open using `html2canvas` with viewport-only capture
  - Screenshot excludes elements by ID (`formId`, `triggerId`) and `data-html2canvas-ignore` attribute
- **`src/ExCanvas.tsx`**: Excalidraw canvas wrapper
  - Uses `useEffect` + `useState` to load image and set `initialData` (not Promise)
  - Screenshot loaded as locked image element that cannot be unlocked
  - Disabled UI features: export, clear canvas, theme toggle, save, background color change
- **`src/components/`**: Reusable UI components (Button, Input, Textarea) using `class-variance-authority` for variant management

### Important Configuration

- **React/Preact Aliasing**: `tsconfig.json` aliases `react` and `react-dom` to `preact/compat` for library compatibility
- **Vite Build**: Configured for library mode with `inlineDynamicImports: true` to ensure single-file output
- **Environment Variable**: Sets `process.env.IS_PREACT = "true"` for Excalidraw compatibility
- **Biome**: Code formatting uses tabs, double quotes, and organizes imports automatically

## Development Commands

```bash
# Start development server at http://localhost:5173/
pnpm dev

# Build production bundle to dist/feedback-widget.iife.js
pnpm build

# Preview production build at http://localhost:4173/
pnpm preview

# Format and lint code (Biome)
pnpm biome format --write .
pnpm biome lint --write .
pnpm biome check --write .
```

## Key Implementation Details

### Screenshot Capture Flow
1. Dialog opens → triggers `useEffect` in `FeedbackWidget.tsx:32`
2. `html2canvas` captures visible viewport only (not full page scroll)
3. Screenshot excludes widget UI by checking element IDs and `data-html2canvas-ignore` attribute
4. Uses `useTransition` to show loading state while capturing
5. Data URL passed to `ExCanvas` for annotation

### Form Submission
Currently stubbed out (`submitForm` function simulates 1s delay). Form has title (required, max 100 chars) and description (optional, max 1000 chars) fields.

### Styling Approach
- Tailwind CSS 4.x with Vite plugin
- Components use semantic color tokens (`foreground`, `background`, `primary`, `accent`, `destructive`, etc.)
- Button variants managed via CVA (class-variance-authority)
