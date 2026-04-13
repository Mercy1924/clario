# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clarios is a camera-first AI mobile assistant that analyzes real-world spaces and generates step-by-step improvement guidance. Built for ADHD brains first — calm, directive, non-overwhelming, action-oriented.

**Core Philosophy:** One step at a time. One room at a time.

## Tech Stack (Planned)

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) + TypeScript |
| State Management | Zustand |
| Backend | Node.js + NestJS |
| Database | PostgreSQL |
| Cache | Redis |
| AI Vision | OpenAI GPT-4o Vision |
| Voice | Native OS Speech-to-Text + Text-to-Speech |
| Auth | Google OAuth + Sign in with Apple |

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

## Documentation

- `Clarios_PRD.md` — Product requirements, user stories, success metrics, design principles
- `Clarios_IA.md` — Complete screen inventory, user flows, data model

## Current Status

Pre-implementation. Repository contains PRD and IA documentation only. No codebase exists yet.
