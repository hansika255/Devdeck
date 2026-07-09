# Internship Assessment App

## Folder structure

```
src/
├── app/
│   ├── core/                  # App-wide singletons — imported once, never per-feature
│   │   ├── constants/          # API URLs, config values
│   │   ├── interceptors/       # errorInterceptor, loadingInterceptor
│   │   └── services/           # LoadingService, etc.
│   ├── models/                 # Shared TS interfaces (ApiError, ApiResponse, PaginatedResponse)
│   ├── shared/
│   │   └── components/         # Reusable, stateless UI: spinner, empty-state, error-message
│   ├── features/                # (empty for now) each feature gets its own folder here
│   ├── app.component.ts        # Root shell: router-outlet + global loading indicator
│   ├── app.config.ts           # providers: router, HttpClient, interceptors
│   └── app.routes.ts           # route table (lazy-loaded feature routes go here)
├── environments/
├── styles.css                  # Tailwind import + design tokens
└── main.ts
```

## Conventions

- **Path aliases**: use `@core/*`, `@shared/*`, `@models/*`, `@env/*` instead of relative `../../..` imports.
- **Strict TypeScript**: `strict`, `noUncheckedIndexedAccess`, and `strictTemplates` are on — no `any`.
- **Standalone only**: no NgModules. Every component declares its own `imports`.
- **Change detection**: `OnPush` by default (set in `angular.json` schematics), so new components generated via `ng generate` inherit it automatically.
- **HTTP errors**: never handle raw `HttpErrorResponse` in a feature component — the `errorInterceptor` normalizes everything into `ApiError` first.
- **Loading state**: don't manage per-request loading flags manually; `LoadingService.isLoading()` reflects any in-flight request app-wide, and `LoadingSpinnerComponent` can be reused inline where local feedback is needed.
- **New features**: add a folder under `app/features/<name>/` with its own `pages/`, `services/`, and feature-specific models; register its routes as lazy `loadComponent` entries in `app.routes.ts`.

## Setup

```bash
npm install
npm start
```
