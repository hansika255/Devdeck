import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Generic loading indicator. Used both as the global top-bar spinner
 * (see AppComponent) and inline inside any feature component that
 * needs a local loading state.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex animate-[fade-in_150ms_ease-out] items-center justify-center gap-2.5 p-3" role="status" aria-live="polite">
      <span
        class="animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"
        [class]="sizeClasses()"
      ></span>
      @if (label()) {
        <span class="text-sm text-slate-500">{{ label() }}</span>
      }
      <span class="sr-only">Loading</span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly size = input<SpinnerSize>('md');
  readonly label = input<string>('');

  protected sizeClasses(): string {
    const map: Record<SpinnerSize, string> = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-9 w-9',
    };
    return map[this.size()];
  }
}
