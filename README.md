# Stitch POS

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/naitwabenja/tailor-shop-pos-management)

A production-ready full-stack Point of Sale (POS) application built on Cloudflare Workers. This template provides a modern React frontend with shadcn/ui components, Tailwind CSS styling, and a robust backend using Durable Objects for real-time state management. Designed for scalability, performance, and ease of deployment on Cloudflare's global edge network.

## Features

- **Full-Stack TypeScript**: End-to-end type safety across frontend and Workers backend.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom design system, dark mode support.
- **State Management**: Cloudflare Durable Objects for entities (users, chats/orders, etc.) with indexing for efficient listing.
- **API-First Backend**: Hono routing with CORS, authentication-ready, real-time capabilities.
- **React Ecosystem**: TanStack Query, React Router, React Hook Form, Framer Motion, Sonner toasts.
- **Developer Experience**: Hot reload, error boundaries, theme toggle, mobile-responsive.
- **Production-Ready**: ESBuild optimization, Tailwind purging, Cloudflare observability.
- **Extensible**: Easy entity CRUD via `worker/entities.ts` and `worker/user-routes.ts`.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, TanStack Query.
- **Backend**: Cloudflare Workers, Hono, Durable Objects, SQLite (via DO storage).
- **Utilities**: clsx, tailwind-merge, Zod validation, Immer, UUID.
- **Dev Tools**: Bun, ESLint, Wrangler, Cloudflare Vite plugin.

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`).
   - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (`bunx wrangler@latest`).

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd stitch-pos-uuvnzbdoizcdy9wybjhxn
   bun install
   ```

3. **Generate Types** (from Cloudflare bindings):
   ```bash
   bun run cf-typegen
   ```

4. **Development**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:3000` (or `$PORT`).

## Local Development

- **Frontend**: Vite dev server with HMR, proxies API to Workers.
- **Backend**: Workers run locally via Wrangler.
- **Scripts**:
  | Command | Description |
  |---------|-------------|
  | `bun run dev` | Start dev server (frontend + Workers) |
  | `bun run build` | Production build |
  | `bun run lint` | Lint codebase |
  | `bun run preview` | Local preview of production build |
- **Customizing**:
  - UI: Edit `src/pages/HomePage.tsx`, add routes in `src/main.tsx`.
  - Backend: Extend entities in `worker/entities.ts`, add routes in `worker/user-routes.ts`.
  - Styles: `tailwind.config.js`, `src/index.css`.
  - Seed data: `shared/mock-data.ts`, auto-seeded on first API call.

## API Usage

Backend exposes RESTful endpoints under `/api/*`. Examples (using `src/lib/api-client.ts`):

```typescript
// List users
const { items: users, next } = await api('/api/users');

// Create chat
const chat = await api('/api/chats', { method: 'POST', body: { title: 'New Order' } });

// Send message
const msg = await api(`/api/chats/${chatId}/messages`, {
  method: 'POST',
  body: { userId: 'u1', text: 'Hello' }
});
```

Full API in `worker/user-routes.ts`.

## Deployment

1. **Build & Deploy**:
   ```bash
   bun run deploy
   ```
   Deploys to Cloudflare Workers with assets (SPA handling).

2. **Custom Domain**:
   ```bash
   wrangler deploy --var CLOUDFLARE_NAMESPACE_ID:your-namespace
   wrangler pages publish dist
   ```

3. **One-Click Deploy**:
   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/naitwabenja/tailor-shop-pos-management)

**Notes**:
- Durable Objects auto-migrate via `wrangler.jsonc`.
- Assets served as SPA (client-side routing).
- Observability enabled by default.

## Architecture

```
Frontend (Vite/React) → Workers (Hono) → Durable Objects (Entities + Indexes)
├── src/          # React app
├── worker/       # API + DO logic
├── shared/       # Shared types
└── GlobalDurableObject # KV-like storage for all entities
```

## Contributing

1. Fork & PR.
2. Follow ESLint/TypeScript rules.
3. Update tests if adding features.

## License

MIT. See [LICENSE](LICENSE) for details.