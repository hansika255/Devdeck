import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DevToService } from '@core/services/dev-to.service';
import { BookmarkService } from '@core/services/bookmark.service';
import { Article } from '@models/article.model';
import { ApiError } from '@models/api-error.model';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { TagFilterComponent } from '@shared/components/tag-filter/tag-filter.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleCardComponent, TagFilterComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 class="mb-6 text-2xl font-semibold tracking-tight text-slate-800">Latest articles</h1>

      @if (loading()) {
        <app-loading-spinner size="lg" label="Loading latest articles..." />
      } @else if (error()) {
        <app-error-message [message]="error()!.message" [showRetry]="true" (retry)="loadArticles()" />
      } @else {
        <app-tag-filter class="mb-6 block" [tags]="availableTags()" [selectedTag]="selectedTag()" (tagSelected)="onTagSelected($event)" />

        @if (filteredArticles().length === 0) {
          <app-empty-state title="No articles match this tag" description="Try selecting a different tag or clear the filter." />
        } @else {
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @for (article of filteredArticles(); track article.id) {
              <app-article-card
                class="animate-[fade-in-up_250ms_ease-out]"
                [article]="article"
                [isBookmarked]="bookmarkService.isBookmarked(article.id)"
                (bookmarkToggle)="onBookmarkToggle($event)"
              />
            }
          </div>
        }
      }
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly devToService = inject(DevToService);
  protected readonly bookmarkService = inject(BookmarkService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly articles = signal<Article[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<ApiError | null>(null);
  protected readonly selectedTag = signal<string | null>(null);

  protected readonly availableTags = computed<string[]>(() => {
    const tags = new Set<string>();
    for (const article of this.articles()) {
      for (const tag of article.tag_list) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  });

  protected readonly filteredArticles = computed<Article[]>(() => {
    const tag = this.selectedTag();
    return tag === null ? this.articles() : this.articles().filter((article) => article.tag_list.includes(tag));
  });

  ngOnInit(): void {
    this.loadArticles();
  }

  protected loadArticles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.devToService
      .getLatestArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (articles) => {
          this.articles.set(articles);
          this.loading.set(false);
        },
        error: (apiError: ApiError) => {
          this.error.set(apiError);
          this.loading.set(false);
        },
      });
  }

  protected onTagSelected(tag: string | null): void {
    this.selectedTag.set(tag);
  }

  protected onBookmarkToggle(article: Article): void {
    this.bookmarkService.toggleBookmark(article);
  }
}
