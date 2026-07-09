import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '@models/nav-item.model';

/**
 * Purely presentational, route-agnostic navbar.
 * Receives its brand label and links as inputs — it has no knowledge
 * of which feature routes exist, so it can be reused as-is anywhere.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-40 border-b border-slate-200 backdrop-blur-sm" style="background-color: rgba(255, 250, 230, 0.95)">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <img [src]="brandLogo()" [alt]="brand()" class="h-8 w-8 rounded-md object-contain" />
          <div class="flex flex-col leading-tight">
            <span class="text-base font-semibold tracking-tight text-slate-800 sm:text-lg">{{ brand() }}</span>
            <span class="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Discover • Explore • Bookmark</span>
          </div>
        </div>

        <!-- Desktop links -->
        <ul class="hidden items-center gap-1 md:flex">
          @for (item of navItems(); track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="text-brand-600 bg-brand-50"
                [ariaCurrentWhenActive]="'page'"
                class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-brand-600"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>

        <!-- Mobile toggle -->
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors duration-150 hover:bg-slate-100 active:scale-95 md:hidden"
          [attr.aria-expanded]="isMobileMenuOpen()"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          (click)="toggleMobileMenu()"
        >
          @if (isMobileMenuOpen()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        </button>
      </div>

      <!-- Mobile panel -->
      @if (isMobileMenuOpen()) {
        <ul
          id="mobile-menu"
          class="flex animate-[fade-in-up_150ms_ease-out] flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden"
        >
          @for (item of navItems(); track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="text-brand-600 bg-brand-50"
                [ariaCurrentWhenActive]="'page'"
                class="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100"
                (click)="closeMobileMenu()"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      }
    </nav>
  `,
})
export class NavbarComponent {
  readonly brand = input<string>('App');
  readonly brandLogo = input<string>('favicon.png');
  readonly navItems = input<NavItem[]>([]);

  private readonly mobileMenuOpen = signal<boolean>(false);
  readonly isMobileMenuOpen = this.mobileMenuOpen.asReadonly();

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
