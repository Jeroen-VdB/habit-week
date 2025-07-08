# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev      # Start development server (port 4321)
npm run build    # Build for production - includes TypeScript type checking
npm run preview  # Preview production build locally
```

### Code Quality

```bash
npm run lint        # Run ESLint and Stylelint
npm run lint:fix    # Auto-fix linting issues
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check  # TypeScript type checking + Astro check
```

The project uses:
- **Prettier** for code formatting (Astro, Svelte, TypeScript, Tailwind CSS)
- **ESLint** for JavaScript/TypeScript linting
- **Stylelint** for CSS linting
- **Strict TypeScript** checking during builds

## Architecture Overview

### Tech Stack

- **Astro 5** - Static site generator handling routing and build
- **Svelte 5** - Reactive UI components with TypeScript support
- **TypeScript** - Strict mode enabled, validated during build
- **Tailwind CSS 4** - Utility-first styling framework
- **shadcn-svelte** - UI component library in `src/lib/components/ui/`

### Core Architecture

#### Data Flow

1. **Local Storage** - Primary data store for habits and progress
2. **Svelte Stores** (`src/lib/stores/`) - Reactive state management
3. **Google Drive Sync** - Optional backup via `src/lib/googleDrive.ts`

#### Key Components

- `HabitTracker.svelte` - Main application component orchestrating the UI
- `WeekView.astro` - Astro component wrapping the Svelte habit tracker
- `HabitSlot.svelte` - Individual habit slot component
- `HabitEditor.svelte` - Modal for adding/editing habits

#### Important Services

- **Google Drive Integration** (`src/lib/googleDrive.ts`) - OAuth flow and file sync
- **Analytics** (`src/lib/analytics.ts`) - Umami integration for privacy-focused tracking
- **Error Tracking** (`src/lib/sentry.ts`) - Sentry setup for production monitoring

### Environment Configuration

Required environment variables (see `.env.example`):

- `PUBLIC_GOOGLE_CLIENT_ID` - Required for Google Drive sync
- `PUBLIC_REDIRECT_URI` - Required for OAuth redirect
- Optional: Sentry DSN, Umami tracking IDs

### Path Aliases

Use `$lib/*` to import from `src/lib/*` in both TypeScript and Svelte files.

### Deployment

The app is configured for Render.com static hosting. The `render.yaml` defines:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables must be configured in Render dashboard
