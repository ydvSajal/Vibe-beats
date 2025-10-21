# Agent Context — Vibe Beats

Date: 2025-10-21

This single-file report captures what I found when scanning the repository for the web app "Vibe Beats". It is intended as a compact context file an automated agent can use to understand the app flow, backend surface, PWA behaviour, which features currently work (including offline/demo fallbacks), and any mismatches or missing pieces that need attention.

## High-level summary

- App type: React + Vite (TypeScript / TSX). UI heavily client-side with graceful demo/mock fallbacks. Uses Supabase Edge Function (Deno/Hono) as the server/backend and a Supabase table used as a KV store.
- PWA: manifest + service worker + client-side install prompt utilities are included. Service worker uses a mix of network-first (navigation) and cache-first strategies.
- Edge function code is present under `src/supabase/functions/server/index.tsx` and implements most server endpoints the client expects (auth, profile, matches, messages, leaderboard) using a Supabase-backed KV table (`kv_store_2e8e40fd`).
- Many client screens include mock/demo data and will continue to function when the backend is unavailable.

## Project entry / main flow

- Entry: `src/main.tsx` -> renders `App` component (`src/App.tsx`).
- App state machine (in `App.tsx`):
  - app states: `landing` -> `onboarding` -> `profile-creation` -> `main`
  - `main` contains tabbed screens: `pool` (SwipePoolScreen), `leaderboard` (LeaderboardScreen), `inbox` (InboxScreen), `profile` (ProfileScreen).
  - On mount App registers the service worker (`registerServiceWorker`) and sets up the PWA install prompt (`setupInstallPrompt`).
  - Auth check in App is rudimentary: it reads a local token via `getAuthToken()` and if present moves to `main` (no server-side verification by default).

## Key client components and their backend usages

- `src/components/SwipePoolScreen.tsx`:
  - Calls: `api.matches.getPotential()` (GET `/matches/potential`) and `api.matches.swipe(targetUserId, direction)` (POST `/matches/swipe`).
  - Fallback: If API call fails, uses `mockProfiles` — full demo flow available offline.

- `src/components/ProfileCreationScreen.tsx`:
  - Calls: `api.profile.create(...)` (POST `/profile`) when user saves their profile.
  - Connect Spotify is simulated client-side; there is no real Spotify OAuth wiring in repo.

- `src/components/InboxScreen.tsx`:
  - Calls: `api.messages.getConversations()` (GET `/messages/conversations`) and (intended) `api.messages.get(conversationId)` (GET `/messages/:conversationId`) and `api.messages.send(conversationId, text)` (POST `/messages/send`).
  - Important mismatch: the component uses `api.messages.get(conversationId)` but `src/utils/api.ts` exposes this method as `getMessages(conversationId)`. This is a client-side naming bug (see "Mismatches/missing items").
  - Fallback: uses `mockConversations` / `mockMessages` when API calls fail.

- `src/components/LeaderboardScreen.tsx`:
  - Calls `api.leaderboard.get(category?)` (GET `/leaderboard`) to fetch leaderboard data.
  - Fallback: uses `mockLeaderboard` when API fails.

- `src/components/ProfileScreen.tsx`, `PublicProfileView`, etc. — mostly client UI that call `api.profile.get(userId)` occasionally.

- Utilities: `src/utils/api.ts` builds requests directed to a Supabase Edge Function base URL. Authentication token management is provided via `setAuthToken`/`getAuthToken` which persists token to localStorage.

## Backend (Edge function) — location and implementation

- Location: `src/supabase/functions/server/index.tsx`.
- Framework: Hono on Deno. The function uses `kv_store.tsx` (which is a Supabase table wrapper) to store key/value data.
- Required environment variables (used by the function and its DB wrapper):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY (used by kv store write/upsert)
  - SUPABASE_ANON_KEY (used in a sign-in path experimentation)

- KV store table: `kv_store_2e8e40fd` (see `src/supabase/functions/server/kv_store.tsx`). Table schema is shown in that file and is expected to exist in Supabase.

- Implemented routes (prefix used in code: `/make-server-2e8e40fd/...`)
  - GET  /make-server-2e8e40fd/health
  - POST /make-server-2e8e40fd/auth/signup
    - Input: { email, name }
    - Behaviour: validates @bennett.edu.in emails, creates user via Supabase admin.createUser, stores initial profile in KV, responds { success, userId }
  - POST /make-server-2e8e40fd/auth/verify-otp
    - Input: { email, otp }
    - Behaviour: demo logic — accepts any 6-digit OTP and returns success.
  - POST /make-server-2e8e40fd/auth/signin
    - Input: { email }
    - Behaviour: demo/magic-link simulation — does not provide a real token reliably, returns success message in many demo cases.
  - GET  /make-server-2e8e40fd/auth/me
    - Requires Authorization header Bearer <token>, verifies user with Supabase auth.getUser(token), returns profile stored in KV.
  - POST /make-server-2e8e40fd/profile
    - Requires auth; updates profile in KV store. Returns updated profile.
  - GET  /make-server-2e8e40fd/profile/:userId
    - Returns stored profile or 404.
  - GET  /make-server-2e8e40fd/matches/potential
    - Requires auth; enumerates `profiles:all` from KV and filters by existing songs and not-yet-swiped.
  - POST /make-server-2e8e40fd/matches/swipe
    - Requires auth; body { targetUserId, direction } — records swipe in KV, checks reciprocity, creates matches list and conversation if reciprocal.
  - GET /make-server-2e8e40fd/matches
    - Requires auth; returns matched profiles.
  - GET /make-server-2e8e40fd/messages/conversations
    - Requires auth; for each match returns conversation metadata (isLocked if no messages yet).
  - GET /make-server-2e8e40fd/messages/:conversationId
    - Requires auth; returns stored messages array from KV (key `messages:<conversationId>`).
  - POST /make-server-2e8e40fd/messages/send
    - Requires auth; body { conversationId, text } — creates an in-KV message, updates conversation.lastMessage, returns saved message.
  - GET /make-server-2e8e40fd/leaderboard
    - Query param `category`. Reads `profiles:all` and sorts by `stats.rightSwipes`, assigns rank.

## Client <-> Server mapping notes

- Base URL on client is built in `src/utils/api.ts` using `projectId` and `publicAnonKey` from `src/utils/supabase/info.tsx`.
  - BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2e8e40fd`
  - Client appends endpoints like `/auth/signup`, resulting in final path `.../functions/v1/make-server-2e8e40fd/auth/signup`.

- The Edge function file expects requests with paths starting `/make-server-2e8e40fd/` — the client path matches that layout because the client hits the function named `make-server-2e8e40fd`. This is unusual but consistent in the repo (the server is dispatching by checking the path prefix).

## Mismatches, missing functions and potential bugs (actionable)

1. Client API method name mismatch in `InboxScreen`:
   - `InboxScreen.loadMessages` calls `api.messages.get(conversationId)` but `src/utils/api.ts` exports `getMessages(conversationId)` (name mismatch). Result: runtime error `api.messages.get is not a function` unless patched. Fix: change `InboxScreen` to call `api.messages.getMessages(conversationId)` or add `get: api.messages.getMessages` alias in `api.ts`.

2. Auth flow is demo/simplified:
   - `auth/verify-otp` simply accepts any 6-digit code. `auth/signin` is a demo stub that does not reliably create an access token for the client. The client-side `App.tsx` only checks localStorage token and does not verify it with server by default.
   - If you need production-ready auth, implement a proper OTP or magic-link flow and return a JWT/session token to the client.

3. Sensitive keys and auto-generated info file in repo:
   - `src/utils/supabase/info.tsx` contains `projectId` and `publicAnonKey` embedded in the repository. `publicAnonKey` is typically safe to be public, but the presence of `SUPABASE_SERVICE_ROLE_KEY` in other deployment docs is sensitive — avoid committing service role keys to the repo and ensure they are injected as environment variables in deployment.

4. Service worker caches source files that don't exist in the production build:
   - `service-worker.js` is precaching `'/App.tsx'` and `'/styles/globals.css'`. On production the built assets are under `build/` and paths differ. Precaching should target built assets like `index.html`, `assets/*.js`, `assets/*.css` or use a build-time generated precache manifest.

5. Edge function KV store expectation:
   - The function uses a DB table `kv_store_2e8e40fd`. You must run the SQL in `DEPLOY.md` and deploy the Edge function for everything to work. The repository contains deployment instructions in `DEPLOY.md` — follow those precisely.

6. Service worker network strategy vs API calls:
   - SW explicitly skips caching `/functions/v1/` routes (it does a network-only fetch). That is correct for API freshness, but combined with demo auth, network failures will fall back to mock data on client screens.

## Progressive Web App behavior (what's present and what works)

- `public/manifest.json` is present with icons and standalone display mode configured. Good for installability.
- Service worker `src/service-worker.js` is registered by `src/utils/pwa.ts`. Key behaviors:
  - Precaches a handful of assets (but current precache targets are source files; needs adapting for build output).
  - Network-first for navigations: tries network then caches fallback — good for updates and offline fallback to cached pages.
  - Cache-first for other assets (images/styles/scripts) with background update behavior.
  - Explicitly bypasses caching for API endpoints.
- `setupInstallPrompt()` and `promptInstall()` exist. UI emits a `pwa-install-available` event so components (like `InstallPrompt`) can show an install CTA.
- Push notifications: there is a stub to subscribe to push notifications and expects a VAPID key placeholder — not configured.

Offline behavior summary:
- Many UI screens intentionally fallback to mock/demo data when the API fails (SwipePool, Inbox, Leaderboard, Profile creation UI partially). This makes the app progressively usable offline or in demo mode.
- Things that require the backend to persist or coordinate state:
  - Authenticating users and issuing/verifying tokens.
  - Persisting profile changes to the KV store.
  - Messages exchange persisted across users (although messages stored in KV when messages are posted).
  - Leaderboard computation is server-side but client has mock fallback.

## File & env checklist to run backend locally (quick)

1. Create a Supabase project or reuse existing one. Ensure the following exist:
   - Table `kv_store_2e8e40fd` (see SQL in `kv_store.tsx` comment or DEPLOY.md).
2. Deploy Supabase Edge Function contained in `src/supabase/functions/server` (function name in repo: `make-server-2e8e40fd`).
3. Environment variables for the function (set in Supabase dashboard):
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY (sensitive; keep secret)
   - SUPABASE_ANON_KEY

4. Client side environment: `src/utils/supabase/info.tsx` already contains `projectId` and `publicAnonKey` for the sample project. For other projects, regenerate or update that file or use Vite env variables.

## Quick actionable next steps (priority sorted)

1. Fix method name mismatch in `InboxScreen` (high): either change `InboxScreen` to call `api.messages.getMessages(conversationId)` or add `get` alias in `src/utils/api.ts`.
2. Replace demo auth with a more realistic flow (medium): implement proper OTP token generation or magic links and return a usable session/access token to the client. Right now `auth/signin` and `auth/verify-otp` are placeholders.
3. Update service worker precache list to use actual build artifacts (low-medium): generate a precache manifest during build or cache `index.html` and `assets/*` paths under `build/`.
4. Secure sensitive keys (high): ensure service role keys are never committed; use environment variables in deployment.
5. Add more robust token verification on App startup (medium): `App` should call `api.auth.getMe()` when a token is present and handle invalid tokens cleanly.
6. Add tests or a small script that exercises the function endpoints locally (low): unit tests for the Edge function and a tiny e2e script that uses the client `api` against a local/deployed function.

## Quick reference: important files

- App entry: `src/main.tsx`, `src/App.tsx`
- API client: `src/utils/api.ts`
- Supabase info (client): `src/utils/supabase/info.tsx` (auto-generated)
- Edge function: `src/supabase/functions/server/index.tsx`
- KV helper: `src/supabase/functions/server/kv_store.tsx`
- Service worker: `src/service-worker.js` and `public/service-worker.js` (build copies exist under `build/` and `public/`)
- PWA utilities: `src/utils/pwa.ts`

## Final notes

This repository is intentionally friendly to demo and offline use. Most UI flows have mock data fallbacks so the app remains interactive even with backend unavailable. The Edge function provides a simple in-Supabase KV-backed backend that implements the client-required endpoints, but the auth flow is simplified and should be replaced for production usage.

If you want, I can implement the small fixes and improvements now (fix the `api.messages.get` mismatch, update service worker precache to built files, add an alias in `api.ts` for `get` → `getMessages`, or add a small local test harness). Tell me which items you want prioritized and I will start making changes and run quick validations.

----

Generated by agent scan of repository `Vibe-beats` on 2025-10-21.
