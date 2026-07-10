import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Article } from '@models/article.model';

/**
 * Purely presentational card for a single article.
 * Bookmark state and the toggle action are passed in/out — this component
 * has no idea BookmarkService exists, so it stays fully reusable and testable.
 */
@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style="background-color: #FFFFFF"
    >
      @if (article().cover_image) {
        <div class="h-40 overflow-hidden">
          <img
            [src]="article().cover_image"
            [alt]="article().title"
            width="400"
            height="160"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      }

      <div class="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div class="flex items-start justify-between gap-2">
          <a
            [href]="article().url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold leading-snug text-slate-800 transition-colors duration-150 hover:text-brand-600"
          >
            {{ article().title }}
          </a>
          <button
            type="button"
            class="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-brand-600 active:scale-95"
            [attr.aria-pressed]="isBookmarked()"
            [attr.aria-label]="isBookmarked() ? 'Remove bookmark' : 'Add bookmark'"
            (click)="bookmarkToggle.emit(article())"
          >
            @if (isBookmarked()) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-brand-600" viewBox="0 0 24 24"><path d="M6 3a2 2 0 0 0-2 2v16l8-4 8 4V5a2 2 0 0 0-2-2H6Z"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3a2 2 0 0 0-2 2v16l8-4 8 4V5a2 2 0 0 0-2-2H6Z"/></svg>
            }
          </button>
        </div>

        @if (article().description) {
          <p class="line-clamp-2 text-sm leading-relaxed text-slate-500">{{ article().description }}</p>
        }

        @if (article().tag_list.length > 0) {
          <div class="flex flex-wrap gap-1.5">
            @for (tag of article().tag_list; track tag) {
              <span class="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">#{{ tag }}</span>
            }
          </div>
        }

        <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <img [src]="article().user.profile_image_90" [alt]="article().user.name" width="20" height="20" class="h-5 w-5 rounded-full" />
            <span>{{ article().user.name }}</span>
          </div>
          <span>{{ article().published_at | date: 'mediumDate' }}</span>
        </div>

        <div class="flex items-center gap-3 text-xs text-slate-500">
          <span>♥ {{ article().public_reactions_count }}</span>
          <span>💬 {{ article().comments_count }}</span>
        </div>
      </div>
    </article>
  `,
})
export class ArticleCardComponent {
  readonly article = input.required<Article>();
  readonly isBookmarked = input<boolean>(false);
  readonly bookmarkToggle = output<Article>();
}
