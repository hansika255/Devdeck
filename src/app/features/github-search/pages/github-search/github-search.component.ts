import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Subject, of, catchError, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GitHubService } from '@core/services/github.service';
import { BookmarkService } from '@core/services/bookmark.service';
import { GitHubUser, GitHubRepo } from '@models/github.model';
import { ApiError } from '@models/api-error.model';
import { RepoCardComponent } from '@shared/components/repo-card/repo-card.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

/** Outcome of a single search, always resolved (never throws) so the search$ stream never terminates. */
interface SearchResult {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  notFound: boolean;
  error: ApiError | null;
}

@Component({
  selector: 'app-github-search',
  standalone: true,
  imports: [RepoCardComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 class="mb-6 text-2xl font-semibold tracking-tight text-slate-800">GitHub search</h1>

      <form class="mb-8 flex flex-col gap-2 sm:flex-row" (submit)="onSubmit($event)">
        <label for="github-username" class="sr-only">GitHub username</label>
        <input
          #usernameInput
          id="github-username"
          type="text"
          placeholder="Search a GitHub username..."
          class="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm transition-colors duration-150 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          class="shrink-0 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700 active:scale-95"
        >
          Search
        </button>
      </form>

      @if (loading()) {
        <app-loading-spinner size="lg" label="Searching GitHub..." />
      } @else if (notFound()) {
        <app-empty-state title="User not found" description="No GitHub account matches that username. Check the spelling and try again." />
      } @else if (error()) {
        <app-error-message [message]="error()!.message" [showRetry]="true" (retry)="onRetry()" />
      } @else if (profile()) {
        <div class="mb-6 flex animate-[fade-in-up_200ms_ease-out] flex-col items-center gap-4 rounded-lg border border-slate-200 p-5 text-center shadow-sm sm:flex-row sm:text-left" style="background-color: #FFFFFF">
          <img
            [src]="profile()!.avatar_url"
            [alt]="profile()!.login"
            width="64"
            height="64"
            class="h-16 w-16 shrink-0 rounded-full"
          />
          <div>
            <a
              [href]="profile()!.html_url"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-slate-800 transition-colors duration-150 hover:text-brand-600"
            >
              {{ profile()!.name ?? profile()!.login }}
            </a>
            @if (profile()!.bio) {
              <p class="mt-0.5 text-sm leading-relaxed text-slate-500">{{ profile()!.bio }}</p>
            }
            <div class="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-500 sm:justify-start">
              <span>{{ profile()!.followers }} followers</span>
              <span>{{ profile()!.following }} following</span>
              <span>{{ profile()!.public_repos }} repos</span>
            </div>
          </div>
        </div>

        @if (repos().length === 0) {
          <app-empty-state title="No public repositories" description="This user hasn't published any public repositories yet." />
        } @else {
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @for (repo of repos(); track repo.id) {
              <app-repo-card
                class="animate-[fade-in-up_250ms_ease-out]"
                [repo]="repo"
                [isBookmarked]="bookmarkService.isRepoBookmarked(repo.id)"
                (bookmarkToggle)="onBookmarkToggle($event)"
              />
            }
          </div>
        }
      } @else {
        <app-empty-state title="Search for a GitHub user" description="Enter a username above to view their profile and repositories." />
      }
    </section>
  `,
})
export class GitHubSearchComponent {
  private readonly gitHubService = inject(GitHubService);
  protected readonly bookmarkService = inject(BookmarkService);
  private readonly destroyRef = inject(DestroyRef);

  /** Angular-idiomatic reference to the input — replaces the previous manual querySelector lookup. */
  private readonly usernameInput = viewChild.required<ElementRef<HTMLInputElement>>('usernameInput');

  protected readonly profile = signal<GitHubUser | null>(null);
  protected readonly repos = signal<GitHubRepo[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<ApiError | null>(null);
  protected readonly notFound = signal<boolean>(false);

  private lastQuery = '';

  /**
   * Every search goes through this Subject. switchMap guarantees that firing a
   * new search cancels any still-in-flight previous request, so a slow stale
   * response can never overwrite a newer one.
   */
  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.notFound.set(false);
          this.profile.set(null);
          this.repos.set([]);
        }),
        switchMap((username) => this.fetchUserAndRepos(username)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.loading.set(false);
        if (result.notFound) {
          this.notFound.set(true);
          return;
        }
        if (result.error) {
          this.error.set(result.error);
          return;
        }
        this.profile.set(result.user);
        this.repos.set(result.repos);
      });
  }

  /**
   * Fetches the user first, then only fetches repos once the user is confirmed
   * to exist — avoids wasting a request (and rate-limit quota) on repos for a
   * username that returns a 404. Never throws: all outcomes resolve to a SearchResult.
   */
  private fetchUserAndRepos(username: string) {
    return this.gitHubService.getUser(username).pipe(
      switchMap((user) =>
        this.gitHubService.getUserRepos(user.login).pipe(
          map((repos): SearchResult => ({ user, repos, notFound: false, error: null })),
        ),
      ),
      catchError((apiError: ApiError) =>
        of<SearchResult>({
          user: null,
          repos: [],
          notFound: apiError.status === 404,
          error: apiError.status === 404 ? null : apiError,
        }),
      ),
    );
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const username = this.usernameInput().nativeElement.value.trim();
    if (!username) {
      return;
    }
    this.lastQuery = username;
    this.search$.next(username);
  }

  protected onRetry(): void {
    if (this.lastQuery) {
      this.search$.next(this.lastQuery);
    }
  }

  protected onBookmarkToggle(repo: GitHubRepo): void {
    this.bookmarkService.toggleRepoBookmark(repo);
  }
}
