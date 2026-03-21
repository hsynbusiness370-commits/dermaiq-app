# AGENTS.md

This document is the canonical implementation guide for contributors and AI coding agents working on **dermaiq-app**.

## Product Goal

Build an AI-powered skincare scanner web app that analyzes user skin signals and profile data, then returns personalized skincare insights and product recommendations.

## Core Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase (PostgreSQL + Auth)**

## Architecture Guidelines

Organize code using clear domain boundaries:

- `components/` - Reusable UI components (prefer composition; keep presentational concerns here)
- `services/` - Business logic and orchestration (analysis pipelines, recommendation logic)
- `state/` - Shared app state (React Context API by default)
- `app/` - Next.js App Router routes, layouts, server components, API route handlers
- `public/` - Static assets
- `styles/` - Global styles and theme tokens
- `utils/` - Utility helpers and pure functions

If legacy `pages/` code exists, avoid extending it unless required for compatibility; prefer App Router.

## Coding Standards

- Follow official Next.js + TypeScript best practices.
- Use **PascalCase** for React components and service classes/modules.
- Use **camelCase** for variables, functions, and object keys.
- Keep logic strongly typed; avoid `any` unless unavoidable and documented.
- Build small, testable units in `services/` for analysis/recommendation flows.

## Feature Priorities

Implement and maintain these primary capabilities:

1. **Skin Analysis**
   - Analyze uploaded or captured skin inputs.
   - Generate structured analysis outputs for downstream recommendations.
2. **User Profile**
   - Store skin type, concerns, preferences, and relevant history.
3. **Product Recommendations**
   - Produce personalized product suggestions from analysis + profile.
4. **Product Database Integration**
   - Persist product catalog metadata, ratings, and suitability tags.

## API and Data Rules

- Use Next.js route handlers under `app/api/**`.
- Keep API contracts typed and explicit (request/response schemas).
- Supabase is the system of record for:
  - User profiles
  - Skin analysis results
  - Product catalog + recommendation metadata
- Use Supabase Auth for authentication and authorization.
- Validate inputs at API boundaries before running business logic.

## Delivery Expectations for Agents

- Make minimal, focused changes per task.
- Prefer server-side data handling for sensitive operations.
- Add or update docs when introducing new architectural decisions.
- Do not introduce a new state management library unless explicitly requested.
- Do not replace the core stack without clear approval and migration rationale.

## Definition of Done (per change)

- Types compile without introducing new TypeScript errors.
- Lint checks pass for touched code.
- New/changed behavior is covered by tests where practical.
- API and schema changes are reflected in docs and migration files.

