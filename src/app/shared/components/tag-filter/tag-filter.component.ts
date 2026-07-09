import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Generic single-select chip filter. Knows nothing about articles —
 * just a list of string options and the currently selected one.
 */
@Component({
  selector: 'app-tag-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        type="button"
        class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 active:scale-95"
        [class]="selectedTag() === null ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        [attr.aria-pressed]="selectedTag() === null"
        (click)="tagSelected.emit(null)"
      >
        All
      </button>
      @for (tag of tags(); track tag) {
        <button
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 active:scale-95"
          [class]="selectedTag() === tag ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          [attr.aria-pressed]="selectedTag() === tag"
          (click)="tagSelected.emit(tag)"
        >
          #{{ tag }}
        </button>
      }
    </div>
  `,
})
export class TagFilterComponent {
  readonly tags = input<string[]>([]);
  readonly selectedTag = input<string | null>(null);
  readonly tagSelected = output<string | null>();
}
