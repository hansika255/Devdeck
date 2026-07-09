import { environment } from '@env/environment';

/** Single source of truth for the API base URL — feature services import this, never hardcode it. */
export const API_BASE_URL = environment.apiBaseUrl;
