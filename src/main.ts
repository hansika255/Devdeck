import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  // Top-level bootstrap failure — nothing else can report this, so log directly.
  console.error('Application failed to bootstrap:', err);
});
