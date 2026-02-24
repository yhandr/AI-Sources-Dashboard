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
npm run build      # production build
npm run lint       # ESLint

npx prisma migrate dev --name <name>   # create and apply a new migration
npx prisma generate                    # regenerate Prisma client after schema changes
npx prisma studio                      # open DB browser GUI
```

## Architecture

Single-page Next.js App Router application. The page (`app/page.tsx`) is a client component that fetches data from its own API routes.

**Data flow:** `page.tsx` → `fetch /api/sources` → `app/api/sources/route.ts` → `lib/prisma.ts` → SQLite `dev.db`

### API routes
- `GET /api/sources?search=&category=` — list with optional search/filter
- `POST /api/sources` — create; requires `name`, `url`, `category`
- `GET|PUT|DELETE /api/sources/[id]` — single record operations

### Database
- **Prisma 7** with `@prisma/adapter-better-sqlite3` driver adapter (required in v7 — no longer optional)
- Schema in `prisma/schema.prisma`; generated client outputs to `lib/generated/prisma/`
- Database URL configured in `prisma.config.ts` (not in `schema.prisma` — this is a Prisma 7 breaking change)
- `DATABASE_URL="file:./dev.db"` in `.env` → DB lives at project root as `dev.db`
- `lib/prisma.ts` uses `path.resolve(process.cwd(), "dev.db")` for the adapter URL; **do not change this to `prisma/dev.db`**

### Prisma 7 client instantiation pattern
```ts
import { PrismaClient } from "./generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
```

### UI components
`components/sources/` contains the four domain components (form, dialog, delete dialog, table). Shadcn/ui primitives are in `components/ui/`. `lib/types.ts` exports the `AISource` interface and the `CATEGORIES` constant used across the app.

### Package name
The npm package name is `ai-sources-dashboard` (the folder name "AI Sources Dashboard" is not valid for npm).
