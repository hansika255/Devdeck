/** A single navbar link. Kept generic so the Navbar has no knowledge of specific features/routes. */
export interface NavItem {
  label: string;
  path: string;
}
