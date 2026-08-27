# Campus Connectivity Nexus

A campus community web app — Chat, Events, Documents, Shop and Kanban — built with Vite + React + TypeScript and Supabase for backend services. Designed as a modular frontend demonstrating a multi-page campus platform with components, shopping/cart support, document editing, real-time-ish chat interfaces, and a kanban board.

Table of contents
- [Features](#features)
- [Stack](#stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Development notes](#development-notes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Features
- Multi-page SPA: Home, Events, Chat, Shop, Profile, Documents, Kanban
- Shopping cart context and components
- Document list + editor
- Kanban board page
- Client-side data fetching/management via @tanstack/react-query
- UI primitives using Radix / shadcn-derived components and Tailwind
- Supabase integration scaffold (config in `supabase/`)
- Notifications with Sonner / Toaster

## Stack
- Language: TypeScript (React)
- Runtime/build: Vite
- Main libraries:
  - React 18, react-router-dom
  - @tanstack/react-query (data fetching/caching)
  - Supabase JS (backend / auth / storage)
  - Tailwind CSS + tailwind-merge
  - Radix UI components + shadcn-style UI primitives
  - Sonner (toasts)
  - Zod (validation)

## Project structure
Annotated top-level view of the important folders and files:

```
public/                 Static assets (favicon, images)
src/
  App.tsx               App entry: routing, providers (QueryClient, CartProvider, TooltipProvider)
  main.tsx              React entrypoint
  index.css             global styles (Tailwind)
  pages/                Page-level components (Index, Chat, Events, Shop, Profile, Documents, KanbanBoard, NotFound)
  components/           Reusable UI and feature components
    cart/               cart components
    documents/          DocumentEditor and document components
    events/             event-related components
    kanban/             kanban components
    layout/             shared layout components
    shop/               product/shop components
    ui/                 local UI primitives (Toast, Tooltip, etc.)
  contexts/             React contexts (CartContext, etc.)
  lib/                  small utilities (API wrappers, helpers)
  hooks/                custom hooks
  integrations/         backend/integration helpers (supabase wrappers etc.)
supabase/                local supabase project config (config.toml)
package.json
vite.config.ts
tailwind.config.ts
tsconfig.json
```

How it fits together:
- `main.tsx` mounts the app and loads global styles.
- `App.tsx` wires up providers (React Query client, CartContext, TooltipProvider) and the router.
- Pages under `src/pages/` render feature views and use components from `src/components/*`.
- Data fetching and persistence are handled through Supabase wrappers and React Query for caching/fetching.

## Getting started
Prerequisites
- Node.js 18+ recommended
- npm (or yarn/pnpm)
- (Optional) Supabase project for backend services

Quickstart
```bash
# clone
git clone <YOUR_REPO_URL>
cd campus-connectivity-nexus

# install
npm install

# run dev server
npm run dev
# open http://localhost:5173 (or the port Vite shows)
```

## Environment variables
Create a `.env.local` (or `.env`) file at the project root with values required by the app. The project expects the Supabase client environment variables (names below are conventional; confirm usage in your Supabase wrapper files):

```
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# any other VITE_ prefixed variables used by your code
```

Important: Vite only exposes env variables prefixed with `VITE_` to the client bundle.

Supabase
- The repository includes `supabase/config.toml` as a starting point. To use Supabase features locally, create a Supabase project, obtain the URL and anon key, and set them in your .env.

## Scripts
- npm run dev — start the Vite dev server
- npm run build — produce a production build
- npm run build:dev — build with development mode
- npm run preview — locally preview the production build
- npm run lint — run ESLint checks

## Development notes & tips
- Code organization follows pages -> components -> contexts pattern. Add new top-level features as new page files and corresponding components.
- Use React Query for async data fetching and caching; check where `QueryClient` is configured in `src/App.tsx`.
- UI primitives live under `src/components/ui/` — extend there for consistent styling.
- Keep environment secrets out of the repo; use project-level env configured in your hosting provider.

## Deployment
This project builds to static assets (Vite). You can deploy to:
- Vercel — recommended for Vite apps (configure env vars in the project settings)
- Netlify — add env vars and set the build command to `npm run build`, publish directory `dist`
- Any static host serving the `dist/` output.

When deploying, ensure your Supabase URL and ANON key are set in the host environment.

## Contributing
- Open an issue to discuss major changes or feature requests.
- Create PRs against `main` (or the main branch your repo uses).
- Run `npm run lint` and ensure TypeScript build passes before requesting review.
- Add small, focused commits with clear messages.

## Troubleshooting
- Blank page / runtime errors: confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set and valid.
- Missing CSS/Styling: ensure you imported `index.css` and Tailwind is configured (see `tailwind.config.ts`).
- React Query network errors: check network tab and Supabase project keys.

## Acknowledgements
Built with: Vite, React, Tailwind CSS, Radix UI, shadcn-style components, TanStack Query, Sonner, Supabase.

## License
Add a LICENSE file to choose a licence (e.g., MIT). If you want, I can add an MIT or other license file next.
