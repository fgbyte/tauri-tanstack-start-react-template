# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-27
**Commit:** 1f522e3
**Branch:** (current)

## OVERVIEW

Tauri 2.0 desktop app with TanStack Start (React 19) frontend. TypeScript + Rust monorepo using Bun package manager.

## STRUCTURE

```
./
├── src/                    # Frontend (TypeScript/React)
│   ├── routes/             # TanStack Router file-based routes
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   └── lib/                # Utilities
├── src-tauri/              # Backend (Rust)
│   ├── src/                # Rust source (lib.rs, main.rs)
│   ├── Cargo.toml          # Rust dependencies + clippy config
│   └── tauri.conf.json     # Tauri app config
├── .github/workflows/      # CI/CD (6 workflows)
├── biome.json              # TS/JS linting + formatting
├── vite.config.ts          # Vite + TanStack Router config
└── vitest.config.ts        # Test config
```

## WHERE TO LOOK

| Task          | Location                    | Notes                                  |
| ------------- | --------------------------- | -------------------------------------- |
| Add route     | `src/routes/`               | File-based routing via TanStack Router |
| Add component | `src/components/`           | Follow existing RoundedButton pattern  |
| UI components | `src/components/ui/`        | shadcn/ui - use `npx shadcn add`       |
| Tauri config  | `src-tauri/tauri.conf.json` | Window, permissions, bundle settings   |
| Rust backend  | `src-tauri/src/lib.rs`      | IPC commands go here                   |
| Tests         | `src/**/*.test.tsx`         | Vitest + Testing Library               |

## CONVENTIONS (THIS PROJECT)

- **Linting/Formatting:** Biome (NOT ESLint)
  - Run: `bun lint`, `bun format`, `bun fix`
  - Indent: 2 spaces, quotes: double
- **TypeScript:** Strict mode enabled
- **React:** Hooks at top level (biome rule)
- **Rust:** clippy + rustfmt enforced, `unsafe_code = forbid`
- **Testing:** Vitest, co-located `*.test.tsx` files

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** use `unsafe_code` in Rust
- **NEVER** use `unwrap()` or `expect()` in Rust (denied by clippy)
- **NEVER** use ESLint - this project uses Biome only
- **AVOID** opening Tauri URLs in standalone browser - use Tauri webview
- **AVOID** module-level Tauri API imports (causes SSR errors)

## COMMANDS

```bash
# Dev
bun dev                 # Frontend only (localhost:3000)
bun dev:tauri          # Full Tauri + frontend dev
bun dev:android        # Android dev mode

# Build
bun build              # Frontend only (Vite)
bun build:tauri        # Full Tauri build
bun build:android      # Android APK build

# Test & Lint
bun run test               # Run Vitest
bun run lint               # Biome check
bun run format             # Biome format
bun run fix                # Biome auto-fix
```

## PRERENDERING

Two modes controlled by `USE_SSR_PRERENDER_MODE` env:

- **SPA (default):** Single `index.html`, client-side routing
- **SSR:** Crawls links, generates per-route HTML

Most users: SPA mode is sufficient.

## GOTCHAS

- Tauri API (`invoke`) only works in webview, not standalone browser
- Change app identifier in `tauri.conf.json` before release build
- `src/routeTree.gen.ts` is auto-generated - DO NOT EDIT
