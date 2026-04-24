# Clarios

> *One step at a time. One room at a time.*

Clarios is a camera-first AI mobile assistant that analyzes real-world spaces and generates step-by-step improvement guidance. Built for ADHD brains first — calm, directive, non-overwhelming, action-oriented.

## Core Philosophy

Many people feel paralysed by cluttered or inefficient spaces. Clarios observes a room, prioritises actions, and guides users sequentially — one instruction at a time — until the space is done.

**Designing for the most constrained user produces a better experience for every user.**

## Features

### Two Modes

- **TIDY** — Declutter, clean, and organise what is already there (full hands-free voice mode available)
- **RESTRUCTURE** — Rethink layout and reposition furniture (includes AI-generated before/after SVG diagram)

### Core Flow

1. **Space Description** — Optional type or voice input to set context
2. **Capture** — Live camera capture (single photo, multi-photo, or scan)
3. **Analysis** — AI-annotated photo with mode recommendation
4. **Guided Execution** — Sequential steps, one card at a time

### Key Design Principles

- Never show full task list — one card, one step, always
- Before/after diagram is Restructure-only — Tidy Mode has no comparison
- Voice mode: TIDY supports full hands-free; RESTRUCTURE is voice-assisted (diagram must remain visible)
- Step cards show zoomed/cropped photo of the active area with highlight ring

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo SDK 54) + TypeScript |
| State Management | Zustand |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | Google Gemini 2.0 Flash (via Supabase Edge Functions) |
| Voice | expo-speech (TTS), native STT |
| Camera | expo-camera |
| Navigation | expo-router |

## Project Structure

```
clarios/
├── apps/
│   └── mobile/              # React Native + Expo app
├── packages/
│   └── types/               # Shared TypeScript types
└── supabase/
    ├── config.toml          # Supabase configuration
    └── functions/           # Edge Functions for AI analysis
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase CLI (for local development)
- Expo CLI

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/mobile/.env.example apps/mobile/.env
# Edit with your Supabase credentials
```

### Development

```bash
# Run mobile app
cd apps/mobile && npx expo start

# Run Supabase locally
supabase start
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > ../apps/mobile/lib/database.types.ts
```

### Environment Variables

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Documentation

- [CLAUDE.md](./CLAUDE.md) — Development guidelines and architecture details
- [Clarios_PRD.md](./Clarios_PRD.md) — Product requirements and user stories
- [Clarios_IA.md](./Clarios_IA.md) — Screen inventory and user flows

## License

MIT
