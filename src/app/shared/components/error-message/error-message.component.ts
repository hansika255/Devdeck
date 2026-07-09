import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Displays a user-facing error, with an optional retry action.
 * Feature components pass the normalized message produced by
 * the error interceptor — never a raw HttpErrorResponse.
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex animate-[fade-in-up_200ms_ease-out] flex-col items-center gap-3 rounded-lg border border-rose-100 bg-rose-50 px-6 py-10 text-center"
      role="alert"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <p class="text-sm font-medium leading-relaxed text-rose-700">{{ message() }}</p>
      @if (showRetry()) {
        <button
          type="button"
          class="rounded-md bg-rose-600 px-4 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-rose-700 active:scale-95"
          style="color: #FFFAE6"
          (click)="retry.emit()"
        >
          Try again
        </button>
      }
    </div>
  `,
})
export class ErrorMessageComponent {
  readonly message = input<string>('Something went wrong.');
  readonly showRetry = input<boolean>(false);
  readonly retry = output<void>();
}
