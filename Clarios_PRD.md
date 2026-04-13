# CLARIOS
## Product Requirements Document
**Version 1.0 · April 2026**

> *One step at a time. One room at a time.*

---

## 1. Product Overview

Clarios is a camera-first AI mobile assistant that analyses real-world spaces and generates step-by-step improvement guidance. It is designed from the ground up for people who feel paralysed by cluttered or inefficient spaces — particularly those with ADHD — but benefits anyone who needs a calm, directive, one-task-at-a-time approach to improving their environment.

Rather than presenting an overwhelming plan, Clarios observes a room, prioritises actions, and guides users sequentially — one instruction at a time — until the space is done.

**Core Philosophy:** Clarios is built for ADHD brains first — calm, directive, non-overwhelming, and action-first. Designing for the most constrained user produces a better experience for every user.

---

## 2. Problem Statement

Many people feel overwhelmed by cluttered or inefficient spaces but do not know where to begin. This problem is especially acute for people with ADHD, who experience disproportionate difficulty initiating tasks, tolerating visual chaos, and sustaining effort through multi-step processes.

Existing tools fail this group in predictable ways:

- **Inspiration platforms** (Pinterest, Houzz) show what a space could look like but give no guidance on how to get there
- **Manual layout tools** (IKEA Place, Magicplan) require skill, patience and prior planning
- **General organisation apps** generate long to-do lists that are themselves overwhelming
- **No tool currently** observes a real room and converts it into a calm, sequential, guided execution plan

---

## 3. Target Users

### Primary — ADHD-First Design

- Adults with ADHD (diagnosed or self-identified) who experience task paralysis in cluttered environments
- Late-diagnosed adults discovering organisational tools for the first time
- People who describe themselves as "overwhelmed by mess" regardless of formal diagnosis

**Behavioural characteristics driving design decisions:**

- Difficulty initiating tasks without a clear first step
- Easily overwhelmed by seeing the full scope of work at once
- Benefit significantly from voice guidance and hands-free interaction
- Respond well to a calm, directive, non-judgmental tone
- Need progress to feel visible and achievable

### Secondary — General Consumers

- Apartment dwellers with limited or multi-purpose spaces
- Remote workers whose home office has become chaotic
- Students managing small rooms or shared spaces
- Busy professionals who want results without planning effort
- Early homeowners learning to think about space intentionally

---

## 4. The Two Modes

Clarios operates in two distinct modes. The AI recommends the most appropriate mode after analysis, but the user always has final say.

---

### 🟢 Mode 1 — TIDY
*Declutter, clean, and organise what is already there*

**Covers:**
- Surface clearing and decluttering
- Deep cleaning prioritisation
- Item relocation (keep, donate, bin)
- General tidying and organisation

**Voice interaction:** Full voice mode available

---

### 🟡 Mode 2 — RESTRUCTURE
*Rethink the layout, reposition furniture, optimise the space*

**Covers:**
- Furniture repositioning based on spatial design principles
- Light source, traffic flow and use-case analysis
- AI-generated top-down layout diagram (current vs. suggested arrangement) rendered as a simple labelled SVG, produced by GPT-4o Vision interpreting the photo — no third-party spatial API or depth-sensing hardware required
- Spatial optimisation (improve aesthetics, make the space feel larger, improve light)

**Voice interaction:** Text-guided steps only

---

## 5. Core Features

### 5.1 Authentication

Users sign in via Google OAuth or Apple ID. No email/password registration. Authentication is handled at first launch, before any session begins.

- Google Sign-In
- Sign in with Apple
- Session persisted on device — users do not re-authenticate on every open
- User data (sessions, spaces, preferences) tied to authenticated account

### 5.2 Space Description *(Optional — before capture)*

The first step of a new session is an optional description screen. This appears **before** the camera opens, so the AI has context before it analyses the photo.

- Skip button is the most prominent element on the screen — one tap goes straight to capture
- Input method toggle: Type or Speak
- **Voice input:** user taps microphone, speaks description, transcript shown for review before proceeding
- Fields (all optional): space type (pill selector: Bedroom, Living Room, Home Office, Kitchen, Study, Other), free-text goal ("more space to work", "less clutter"), mode preference (Tidy / Restructure / AI decides)
- CTA reads "Capture my space" — not "Next" — to signal that the description is preparation for the camera, not a detour

### 5.3 Capture

Live capture only — no image import. Ensures the AI always works from the real current state of the space.

- Camera opens immediately after description (or after skipping)
- If description was completed, a "Context set: [space type]" indicator is shown on the camera screen so the user knows their context carried through
- Capture options: single photo, multi-photo, scan (slow pan)
- Retake always available before proceeding

### 5.4 AI Analysis

The AI analyses captured images alongside any description context provided. The analysis is more targeted when description context is present.

**The analysis considers:**
- Clutter density and surface usage
- Dirt, disorder and cleaning requirements
- Furniture positions, light sources, traffic flow and room use case
- Any goal or context provided in the description step

**The analysis produces:**
- Annotated photo — items and areas circled and labelled
- Plain-language summary of findings
- A "Confirmed from your description" row echoing back the user's context (space type, goal) — only shown if description was completed
- Mode recommendation (Tidy or Restructure) with brief rationale personalised to the user's stated goal where available
- If AI recommendation differs from user's mode preference, it flags this and explains why
- User confirms or overrides mode directly on this screen — no separate mode confirmation screen

### 5.5 Guided Execution — Tidy Mode

#### Text Mode
- Steps presented one at a time as large, clear cards
- Each top-level step has collapsible substeps (e.g. "Tidy the desk" → "Remove all items", "Throw away rubbish", "Group remaining items")
- Time estimate displayed per step
- Progress bar visible throughout
- User taps "Done" to advance

#### Voice Mode
- AI speaks each top-level step aloud
- Annotated image highlights exactly what to act on
- No substeps displayed — voice handles all guidance
- No time estimates in voice mode
- User responds vocally ("Done", "Next", "Repeat", "Go back") to advance
- Switchable to text mode at any point mid-session

### 5.6 Guided Execution — Restructure Mode

- AI generates a top-down layout diagram using GPT-4o Vision: interprets the photo to identify furniture, walls, windows and doors, then produces a suggested rearrangement rendered as a simple labelled SVG diagram
- Before/after diagram shown before any steps begin: current arrangement (left) vs. suggested arrangement (right)
- User reviews and can accept or request an alternative arrangement
- Steps do not begin until diagram is confirmed by the user
- Once confirmed, sequential text-guided steps begin
- Steps reference the diagram inline: "Move the desk to the north wall — see diagram position A"
- No voice mode in Restructure — steps require ongoing visual reference to the diagram
- Before/after is specific to Restructure Mode only — Tidy Mode has no before/after comparison at any point in the flow

### 5.7 Progress Tracking & Space History

- Session progress saved automatically
- Users can resume incomplete sessions from the home screen
- Completed spaces stored in a Space History dashboard
- Space History is accessible from the home screen

---

## 6. User Stories

| User Story | Acceptance Criteria | Priority |
|---|---|---|
| As a user with ADHD, I want one task at a time so I don't feel overwhelmed | Steps shown one at a time; full list never displayed upfront | P0 |
| As a user, I want to sign in quickly without creating a password | Google and Apple OAuth available on first launch | P0 |
| As a user, I want to scan my room and get guidance immediately | Description (or skip) → capture → analysis → first step in under 90 seconds | P0 |
| As a user, I want voice mode so I can move around hands-free | Voice reads step, shows annotated image, accepts vocal confirmation | P0 |
| As a user, I want to skip the description step if I'm in a hurry | Skip is the most visible element on the description screen | P1 |
| As a user, I want the AI to use my stated goal when recommending a mode | Analysis recommendation references user's goal where description was provided | P1 |
| As a user, I want to see a layout plan before I start restructuring | Before/after diagram shown and confirmed before any steps begin | P1 |
| As a user, I want to resume a session I didn't finish | Sessions auto-saved; resumable from home screen | P1 |
| As a user, I want to see my past spaces | Space history accessible from home screen | P2 |

---

## 7. Out of Scope

| Feature | Reason |
|---|---|
| Image import | Live capture required for real-time accuracy |
| Full real-time AR overlay | Hardware dependency; beyond MVP scope |
| Third-party spatial/depth sensing API | GPT-4o Vision diagram generation is sufficient for MVP |
| Furniture shopping integration | Outside core guidance loop |
| Social sharing | Not core to ADHD-first use case |
| Community features | Premature before product-market fit |
| Full interior redesign simulation | Out of scope for guidance-first product |

---

## 8. Recommended Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React Native (Expo) | Cross-platform iOS + Android |
| Language | TypeScript | Type safety across codebase |
| State Management | Zustand | Lightweight; suited for step-by-step session state |
| Backend | Node.js + NestJS | Scalable, modular architecture |
| Database | PostgreSQL | Spaces, sessions, steps, user data |
| Cache / Sessions | Redis | Session state and analysis caching |
| AI Vision | OpenAI GPT-4o Vision | Spatial analysis, diagram generation, step generation |
| AI Preprocessing | Python + FastAPI | Image preprocessing microservice |
| Voice (STT) | Native OS Speech-to-Text | On-device, low latency |
| Voice (TTS) | Native OS Text-to-Speech | On-device, no extra cost |
| Auth | Google OAuth + Sign in with Apple | No email/password auth |
| Cloud | AWS or GCP | S3-compatible storage for images and diagrams |

---

## 9. Success Metrics

### Primary
- % of users completing their first guided step
- Session completion rate across both modes

### Secondary
- Time from app open to first actionable step *(target: under 90 seconds)*
- Voice mode adoption rate
- 7-day return rate
- Mode selection split (Tidy vs Restructure)
- Description step completion rate vs skip rate

### ADHD-Specific Signal
- Qualitative feedback: does the product feel calm and manageable?
- Step-abandonment rate: which steps do users drop off at?
- Voice vs text preference split

---

## 10. Design Principles

| Principle | What it means in practice |
|---|---|
| One instruction at a time | Never show the full task list. One card. One step. Always. |
| Action-first interface | Every screen moves the user toward doing something, not reading something |
| Calm and directive tone | No excited copy. Clear, quiet, confident language throughout. |
| Minimal UI friction | As few taps as possible between opening the app and the first step |
| Visible progress | Users must always know how far they've come and that the end is reachable |
| Never overwhelming | No list dumps, no feature tours, no interruptions during a session |
| Everything optional is skippable | Optional steps dismissible with a single tap, always visible |
| Context carries through | Information the user provides at any point is echoed back and used — nothing is silently discarded |

---

*Clarios PRD v1.0 · April 2026*
