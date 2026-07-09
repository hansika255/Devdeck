import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { NavItem } from '@models/nav-item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar [brand]="'DevDeck'" [brandLogo]="'favicon.png'" [navItems]="navItems" />

    @if (loadingService.isLoading()) {
      <app-loading-spinner class="fixed inset-x-0 top-0 z-50 animate-[fade-in_150ms_ease-out] shadow-sm backdrop-blur-sm" style="background-color: rgba(255, 250, 230, 0.9)" />
    }

    <router-outlet />
  `,
})
export class AppComponent {
  protected readonly loadingService = inject(LoadingService);

  protected readonly navItems: NavItem[] = [
    { label: 'Home', path: '/home' },
    { label: 'GitHub Search', path: '/github-search' },
    { label: 'Bookmarks', path: '/bookmarks' },
  ];
}
