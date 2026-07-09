import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks the number of in-flight HTTP requests so the UI can show
 * a global loading indicator without every feature managing its own flag.
 * Consumed by LoadingInterceptor; read by any component via `isLoading`.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly activeRequests = signal<number>(0);

  readonly isLoading = computed(() => this.activeRequests() > 0);

  show(): void {
    this.activeRequests.update((count) => count + 1);
  }

  hide(): void {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
