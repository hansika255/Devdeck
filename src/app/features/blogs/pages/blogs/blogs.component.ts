import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SanityService } from '../../../sanity/services/sanity.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [DatePipe, EmptyStateComponent, ErrorMessageComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 class="mb-6 text-2xl font-semibold tracking-tight text-slate-800">Blogs</h1>

      @if (loading()) {
        <app-loading-spinner size="lg" label="Loading blogs..." />
      } @else if (errorMessage()) {
        <app-error-message [message]="errorMessage()" [showRetry]="true" (retry)="loadBlogs()" />
      } @else {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          @for (blog of blogs; track blog._id) {
            <article class="animate-[fade-in-up_250ms_ease-out] rounded-lg border border-slate-200 p-5 shadow-sm" style="background-color: #FFFFFF">
              <h2 class="text-lg font-semibold tracking-tight text-slate-800">{{ blog.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ blog.description }}</p>

              <dl class="mt-4 space-y-2 text-sm">
                <div class="flex gap-2">
                  <dt class="font-medium text-slate-700">Author:</dt>
                  <dd class="text-slate-600">{{ blog.author }}</dd>
                </div>
                <div class="flex gap-2">
                  <dt class="font-medium text-slate-700">Published:</dt>
                  <dd class="text-slate-600">{{ blog.publishedAt | date: 'mediumDate' }}</dd>
                </div>
              </dl>

              @if (blog.tags?.length) {
                <div class="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                  @for (tag of blog.tags; track tag) {
                    <span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">{{ tag }}</span>
                  }
                </div>
              } @else {
                <p class="mt-4 text-xs text-slate-500">No tags</p>
              }
            </article>
          } @empty {
            <app-empty-state title="No blogs available" description="Check back later for new posts." />
          }
        </div>
      }
    </section>
  `,
})
export class BlogsComponent implements OnInit {
  private readonly sanityService = inject(SanityService);

  blogs: any[] = [];
  protected readonly loading = signal<boolean>(false);
  protected readonly errorMessage = signal<string>('');

  ngOnInit(): void {
    void this.loadBlogs();
  }

  protected async loadBlogs(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      this.blogs = await this.sanityService.getBlogs();
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load blogs. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
