/** Subset of the DEV.to article fields the app actually uses. */
export interface Article {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  url: string;
  published_at: string;
  tag_list: string[];
  comments_count: number;
  public_reactions_count: number;
  user: {
    name: string;
    profile_image_90: string;
  };
}
