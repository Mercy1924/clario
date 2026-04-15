# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clarios is a camera-first AI mobile assistant that analyzes real-world spaces and generates step-by-step improvement guidance. Built for ADHD brains first — calm, directive, non-overwhelming, action-oriented.

**Core Philosophy:** One step at a time. One room at a time.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo SDK 54) + TypeScript |
| State Management | Zustand |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | OpenAI GPT-4o Vision (via Supabase Edge Functions) |
| Voice | expo-speech (TTS), native STT |
| Camera | expo-camera |
| Navigation | expo-router |

## Monorepo Structure

```
clarios/
├── apps/
│   └── mobile/              # React Native + Expo app
├── packages/
│   └── types/               # Shared TypeScript types
└── supabase/
    ├── config.toml          # Supabase configuration
    └── migrations/          # Database schema migrations
```

## Architecture Summary

**Two Modes:**
- **TIDY** — Declutter, clean, organise (supports voice interaction)
- **RESTRUCTURE** — Rethink layout, reposition furniture (includes AI-generated before/after SVG diagram)

**Core Flow:**
1. Space Description (optional, skippable) — Type or voice input
2. Capture — Live camera only (Photo/Multi/Scan)
3. Analysis — Annotated photo + mode recommendation
4. Guided Execution — Sequential steps, one at a time

**Key Design Constraints:**
- Never show full task list — one card, one step, always
- Description before capture — context must carry through to analysis
- Before/after diagram is Restructure-only — Tidy Mode has no comparison
- Voice mode available only in Tidy Mode — Restructure requires visual diagram reference

## Database Schema

All tables have RLS policies enforcing user ownership:

- `profiles` — User profiles (extends auth.users)
- `sessions` — Sessions with mode (tidy/restructure) and status
- `spaces` — Space metadata, images array
- `analysis` — AI findings, annotated image URL, mode recommendation
- `diagrams` — Before/after SVGs (Restructure only)
- `steps` — Sequential steps with substeps JSONB

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Supabase Storage Buckets

- `space-images` — Captured room photos
- `annotated-images` — AI-annotated photos
- `diagrams` — Before/after SVG diagrams

## Mobile App Structure

```
apps/mobile/app/
├── (auth)/                    # Auth flow
│   ├── welcome.tsx            # OAuth selection (Google/Apple)
│   └── permissions.tsx        # Camera, mic, notifications
├── (tabs)/                    # Main tab navigation
│   ├── index.tsx              # Home dashboard
│   ├── history.tsx            # Space history
│   ├── settings.tsx           # Settings
│   └── profile.tsx            # Profile/sign-out
└── session/                   # Session flow
    ├── description.tsx        # Optional space description
    ├── capture.tsx            # Camera capture
    ├── analysis.tsx           # AI analysis + mode decision
    ├── tidy/                  # Tidy mode screens
    │   ├── mode-select.tsx
    │   ├── step-text.tsx
    │   ├── step-voice.tsx
    │   └── complete.tsx
    └── restructure/           # Restructure mode screens
        ├── generating.tsx
        ├── diagram.tsx
        ├── step.tsx
        └── complete.tsx
```

## State Management (Zustand)

- `stores/session-store.ts` — Session state, steps, mode selection
- `stores/voice-store.ts` — Voice guidance (TTS/STT controls)

## External Integrations

| Integration | Purpose |
|---|---|
| Supabase | Auth (Google/Apple OAuth), PostgreSQL database, Storage |
| OpenAI GPT-4o Vision | Spatial analysis, annotated images, layout diagrams, step generation |
| Native OS | Speech-to-Text, Text-to-Speech |

## Development Commands

```bash
# Install dependencies
pnpm install

# Run mobile app
cd apps/mobile && npx expo start

# Run Supabase locally
supabase start
supabase db reset          # Reset local database
supabase gen types typescript --local > ../apps/mobile/lib/database.types.ts

# Build
pnpm build
```

## Environment Variables

Create `apps/mobile/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Documentation

- `Clarios_PRD.md` — Product requirements, user stories, success metrics, design principles
- `Clarios_IA.md` — Complete screen inventory, user flows, data model
