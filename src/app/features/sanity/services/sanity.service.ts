import { Injectable } from '@angular/core';
import { createClient } from '@sanity/client';

@Injectable({
  providedIn: 'root'
})
export class SanityService {

  client = createClient({
    projectId: 'rtgu3xc1',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });

  getBlogs() {
    return this.client.fetch(`
      *[_type == "blog"] | order(publishedAt desc) {
        _id,
        title,
        description,
        author,
        tags,
        publishedAt
      }
    `);
  }
}