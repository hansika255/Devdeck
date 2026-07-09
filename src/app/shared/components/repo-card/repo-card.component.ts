import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GitHubRepo } from '@models/github.model';

/** Purely presentational card for a single GitHub repository. */
@Component({
  selector: 'app-repo-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="flex h-full flex-col gap-2.5 rounded-lg border border-slate-200 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      style="background-color: #FFFAE6"
    >
      <div class="flex items-start justify-between gap-2">
        <a
          [href]="repo().html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-semibold leading-snug text-slate-800 transition-colors duration-150 hover:text-brand-600"
        >
          {{ repo().name }}
        </a>
        <button
          type="button"
          class="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-brand-600 active:scale-95"
          [attr.aria-pressed]="isBookmarked()"
          [attr.aria-label]="isBookmarked() ? 'Remove bookmark' : 'Add bookmark'"
          (click)="bookmarkToggle.emit(repo())"
        >
          @if (isBookmarked()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-brand-600" viewBox="0 0 24 24"><path d="M6 3a2 2 0 0 0-2 2v16l8-4 8 4V5a2 2 0 0 0-2-2H6Z"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3a2 2 0 0 0-2 2v16l8-4 8 4V5a2 2 0 0 0-2-2H6Z"/></svg>
          }
        </button>
      </div>

      @if (repo().description) {
        <p class="line-clamp-2 text-sm leading-relaxed text-slate-500">{{ repo().description }}</p>
      }

      <div class="mt-auto flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        @if (repo().language) {
          <span class="font-medium text-slate-600">{{ repo().language }}</span>
        }
        <span>★ {{ repo().stargazers_count }}</span>
        <span>⑂ {{ repo().forks_count }}</span>
      </div>
    </article>
  `,
})
export class RepoCardComponent {
  readonly repo = input.required<GitHubRepo>();
  readonly isBookmarked = input<boolean>(false);
  readonly bookmarkToggle = output<GitHubRepo>();
}
