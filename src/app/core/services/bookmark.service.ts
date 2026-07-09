import { Injectable, WritableSignal, signal } from '@angular/core';
import { Article } from '@models/article.model';
import { GitHubRepo } from '@models/github.model';

const ARTICLE_STORAGE_KEY = 'bookmarked-article-ids';
const REPO_STORAGE_KEY = 'bookmarked-repo-ids';
const ARTICLE_ITEMS_STORAGE_KEY = 'bookmarked-articles';
const REPO_ITEMS_STORAGE_KEY = 'bookmarked-repos';

/**
 * App-wide bookmark state, persisted to localStorage so it survives reloads.
 * Maintains two independent sets — articles and GitHub repos — so bookmarking
 * a repo can never collide with an article id that happens to match.
 */
@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly bookmarkedArticleIds = signal<ReadonlySet<number>>(this.loadIdsFromStorage(ARTICLE_STORAGE_KEY));
  private readonly bookmarkedRepoIds = signal<ReadonlySet<number>>(this.loadIdsFromStorage(REPO_STORAGE_KEY));

  readonly bookmarkedArticles = signal<Article[]>(this.loadArticlesFromStorage());
  readonly bookmarkedRepos = signal<GitHubRepo[]>(this.loadReposFromStorage());

  constructor() {
    this.syncIdsFromStoredItems();
  }

  isBookmarked(articleId: number): boolean {
    return this.bookmarkedArticleIds().has(articleId);
  }

  toggleBookmark(articleOrId: Article | number): void {
    if (typeof articleOrId === 'number') {
      this.toggle(this.bookmarkedArticleIds, articleOrId, ARTICLE_STORAGE_KEY);
      return;
    }

    const article = articleOrId;
    const currentIds = new Set(this.bookmarkedArticleIds());
    const currentArticles = [...this.bookmarkedArticles()];
    const existingIndex = currentArticles.findIndex((item) => item.id === article.id);

    if (existingIndex >= 0) {
      currentArticles.splice(existingIndex, 1);
      currentIds.delete(article.id);
    } else {
      currentArticles.push(article);
      currentIds.add(article.id);
    }

    this.bookmarkedArticleIds.set(currentIds);
    this.bookmarkedArticles.set(currentArticles);
    this.saveToStorage(ARTICLE_STORAGE_KEY, currentIds);
    this.saveArticlesToStorage(currentArticles);
  }

  isRepoBookmarked(repoId: number): boolean {
    return this.bookmarkedRepoIds().has(repoId);
  }

  toggleRepoBookmark(repoOrId: GitHubRepo | number): void {
    if (typeof repoOrId === 'number') {
      this.toggle(this.bookmarkedRepoIds, repoOrId, REPO_STORAGE_KEY);
      return;
    }

    const repo = repoOrId;
    const currentIds = new Set(this.bookmarkedRepoIds());
    const currentRepos = [...this.bookmarkedRepos()];
    const existingIndex = currentRepos.findIndex((item) => item.id === repo.id);

    if (existingIndex >= 0) {
      currentRepos.splice(existingIndex, 1);
      currentIds.delete(repo.id);
    } else {
      currentRepos.push(repo);
      currentIds.add(repo.id);
    }

    this.bookmarkedRepoIds.set(currentIds);
    this.bookmarkedRepos.set(currentRepos);
    this.saveToStorage(REPO_STORAGE_KEY, currentIds);
    this.saveReposToStorage(currentRepos);
  }

  private toggle(state: WritableSignal<ReadonlySet<number>>, id: number, storageKey: string): void {
    const current = new Set(state());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    state.set(current);
    this.saveToStorage(storageKey, current);
  }

  private syncIdsFromStoredItems(): void {
    const articleIds = new Set(this.bookmarkedArticleIds());
    for (const article of this.bookmarkedArticles()) {
      articleIds.add(article.id);
    }
    if (articleIds.size !== this.bookmarkedArticleIds().size || this.bookmarkedArticles().length > 0) {
      this.bookmarkedArticleIds.set(articleIds);
      this.saveToStorage(ARTICLE_STORAGE_KEY, articleIds);
    }

    const repoIds = new Set(this.bookmarkedRepoIds());
    for (const repo of this.bookmarkedRepos()) {
      repoIds.add(repo.id);
    }
    if (repoIds.size !== this.bookmarkedRepoIds().size || this.bookmarkedRepos().length > 0) {
      this.bookmarkedRepoIds.set(repoIds);
      this.saveToStorage(REPO_STORAGE_KEY, repoIds);
    }
  }

  private loadIdsFromStorage(storageKey: string): ReadonlySet<number> {
    try {
      const raw = localStorage.getItem(storageKey);
      const ids: unknown[] = raw ? JSON.parse(raw) : [];
      return new Set(ids.filter((id): id is number => typeof id === 'number'));
    } catch {
      return new Set();
    }
  }

  private loadArticlesFromStorage(): Article[] {
    try {
      const raw = localStorage.getItem(ARTICLE_ITEMS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((item): item is Article => typeof item === 'object' && item !== null && 'id' in item)
        : [];
    } catch {
      return [];
    }
  }

  private loadReposFromStorage(): GitHubRepo[] {
    try {
      const raw = localStorage.getItem(REPO_ITEMS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((item): item is GitHubRepo => typeof item === 'object' && item !== null && 'id' in item)
        : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(storageKey: string, ids: ReadonlySet<number>): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(ids)));
    } catch {
      // Ignore storage write failures (e.g. private browsing quota) — in-memory state still works.
    }
  }

  private saveArticlesToStorage(articles: Article[]): void {
    try {
      localStorage.setItem(ARTICLE_ITEMS_STORAGE_KEY, JSON.stringify(articles));
    } catch {
      // Ignore storage write failures (e.g. private browsing quota) — in-memory state still works.
    }
  }

  private saveReposToStorage(repos: GitHubRepo[]): void {
    try {
      localStorage.setItem(REPO_ITEMS_STORAGE_KEY, JSON.stringify(repos));
    } catch {
      // Ignore storage write failures (e.g. private browsing quota) — in-memory state still works.
    }
  }
}
