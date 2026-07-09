import { Routes } from '@angular/router';

/**
 * Feature routes are added here as lazy-loaded standalone components.
 * '**' will point to a dedicated NotFoundPage once more feature pages exist.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'github-search',
    loadComponent: () =>
      import('./features/github-search/pages/github-search/github-search.component').then((m) => m.GitHubSearchComponent),
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./features/bookmarks/pages/bookmarks/bookmarks.component').then((m) => m.BookmarksComponent),
  },
];
