import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BookmarkService } from '@core/services/bookmark.service';
import { Article } from '@models/article.model';
import { GitHubRepo } from '@models/github.model';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { RepoCardComponent } from '@shared/components/repo-card/repo-card.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [ArticleCardComponent, RepoCardComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 class="mb-6 text-2xl font-semibold tracking-tight text-slate-800">Bookmarks</h1>

      @if (bookmarkedArticles().length === 0 && bookmarkedRepos().length === 0) {
        <app-empty-state
          title="No bookmarks yet"
          description="Save articles or repositories to see them here."
        />
      } @else {
        @if (bookmarkedArticles().length > 0) {
          <div class="mb-10">
            <h2 class="mb-4 text-lg font-semibold tracking-tight text-slate-800">Saved articles</h2>
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              @for (article of bookmarkedArticles(); track article.id) {
                <app-article-card
                  class="animate-[fade-in-up_250ms_ease-out]"
                  [article]="article"
                  [isBookmarked]="bookmarkService.isBookmarked(article.id)"
                  (bookmarkToggle)="onArticleBookmarkToggle($event)"
                />
              }
            </div>
          </div>
        }

        @if (bookmarkedRepos().length > 0) {
          <div>
            <h2 class="mb-4 text-lg font-semibold tracking-tight text-slate-800">Saved repositories</h2>
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              @for (repo of bookmarkedRepos(); track repo.id) {
                <app-repo-card
                  class="animate-[fade-in-up_250ms_ease-out]"
                  [repo]="repo"
                  [isBookmarked]="bookmarkService.isRepoBookmarked(repo.id)"
                  (bookmarkToggle)="onRepoBookmarkToggle($event)"
                />
              }
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class BookmarksComponent {
  protected readonly bookmarkService = inject(BookmarkService);

  protected readonly bookmarkedArticles = this.bookmarkService.bookmarkedArticles;
  protected readonly bookmarkedRepos = this.bookmarkService.bookmarkedRepos;

  protected onArticleBookmarkToggle(article: Article): void {
    this.bookmarkService.toggleBookmark(article);
  }

  protected onRepoBookmarkToggle(repo: GitHubRepo): void {
    this.bookmarkService.toggleRepoBookmark(repo);
  }
}
