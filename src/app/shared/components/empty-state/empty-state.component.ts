import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shown wherever a list/collection has loaded successfully but contains
 * no items. Kept generic and content-driven so every feature can reuse it.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex animate-[fade-in-up_200ms_ease-out] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 px-6 py-14 text-center"
      style="background-color: #FFFFFF"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V20a2 2 0 0 1-2 2Z" />
      </svg>
      <p class="text-base font-medium text-slate-700">{{ title() }}</p>
      @if (description()) {
        <p class="max-w-sm text-sm leading-relaxed text-slate-500">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input<string>('Nothing here yet');
  readonly description = input<string>('');
}
