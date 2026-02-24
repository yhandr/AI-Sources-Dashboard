# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Node.js requirement

**Always use Node.js v22.22.0.** The default system Node (v22.0.0) is too old for Prisma 7.

```bash
source ~/.nvm/nvm.sh && nvm use 22.22.0
```

A `.nvmrc` is set to `22.22.0`. All dev commands below assume this version is active.

## Commands

```bash
npm run dev        # start dev server (http://localhost:3000)
npm run build      # prisma generate + migrate deploy + next build
npm run lint       # ESLint

npx prisma migrate dev --name <name>   # create and apply a new migration
npx prisma generate                    # regenerate Prisma client after schema changes
npx prisma studio                      # open DB browser GUI
```

## Architecture

Single-page Next.js App Router application. The page (`app/page.tsx`) is a client component that fetches data from its own API routes.

**Data flow:** `page.tsx` → `fetch /api/sources` → `app/api/sources/route.ts` → `lib/prisma.ts` → Neon PostgreSQL

### API routes
- `GET /api/sources?search=&category=` — list with optional search/filter
- `POST /api/sources` — create; requires `name`, `url`, `category`
- `GET|PUT|DELETE /api/sources/[id]` — single record operations

### Database
- **Prisma 7** with `@prisma/adapter-neon` driver adapter + Vercel Postgres (Neon)
- Schema in `prisma/schema.prisma`; generated client outputs to `lib/generated/prisma/`
- URL config is in `prisma.config.ts` (not in `schema.prisma` — Prisma 7 breaking change)
- Two separate connection strings required:
  - `POSTGRES_PRISMA_URL` — pooled, used by the app at runtime (`lib/prisma.ts`)
  - `POSTGRES_URL_NON_POOLING` — direct, used by Prisma CLI for migrations (`prisma.config.ts`)

### Prisma 7 client instantiation pattern
```ts
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.POSTGRES_PRISMA_URL! });
const prisma = new PrismaClient({ adapter });
```

### Local development setup
After creating the Vercel Postgres database, pull the env vars locally:
```bash
vercel env pull .env    # populates POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING
```
The Prisma CLI reads `.env` via `dotenv/config` in `prisma.config.ts`.

### Vercel deployment
`npm run build` automatically runs `prisma generate && prisma migrate deploy && next build`. No extra Vercel build configuration needed — Vercel injects the Postgres env vars automatically.

### UI components
`components/sources/` contains the four domain components (form, dialog, delete dialog, table). Shadcn/ui primitives are in `components/ui/`. `lib/types.ts` exports the `AISource` interface and the `CATEGORIES` constant used across the app.

### Package name
The npm package name is `ai-sources-dashboard` (the folder name "AI Sources Dashboard" is not valid for npm).
