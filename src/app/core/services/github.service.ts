import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GitHubUser, GitHubRepo } from '@models/github.model';
import { GITHUB_API_URL, GITHUB_REPOS_PER_PAGE } from '@core/constants/github.constants';

/** Thin HTTP client for GitHub's public REST API. No caching/state — caller owns that. */
@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly http = inject(HttpClient);

  getUser(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`${GITHUB_API_URL}/users/${encodeURIComponent(username)}`);
  }

  getUserRepos(username: string, perPage: number = GITHUB_REPOS_PER_PAGE): Observable<GitHubRepo[]> {
    const params = new HttpParams().set('sort', 'updated').set('per_page', perPage);
    return this.http.get<GitHubRepo[]>(`${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos`, { params });
  }
}
