import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '@models/article.model';
import { DEV_TO_API_URL, DEV_TO_ARTICLES_PER_PAGE } from '@core/constants/dev-to.constants';

/** Thin HTTP client for DEV.to's public articles endpoint. No caching/state — that's the caller's job. */
@Injectable({ providedIn: 'root' })
export class DevToService {
  private readonly http = inject(HttpClient);

  getLatestArticles(perPage: number = DEV_TO_ARTICLES_PER_PAGE): Observable<Article[]> {
    const params = new HttpParams().set('per_page', perPage);
    return this.http.get<Article[]>(DEV_TO_API_URL, { params });
  }
}
