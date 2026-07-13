export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string;
  industry_id: string | null;
  country: string | null;
  description: string | null;
  affiliate_program: boolean;
  creator_program: boolean;
  application_url: string | null;
  public_partnership_url: string | null;
  popularity_score: number;
  rating: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  ai_summary: string | null;
  last_updated: string;
  created_at: string;
  industries?: {
    name: string;
    slug: string;
  } | null;
  categories?: Array<{ name: string; slug: string }>;
  creator_sizes?: Array<{ label: string; min_range: number; max_range: number }>;
}

export interface SearchFilters {
  query: string;
  industry: string;
  creatorSize: string;
  affiliateOnly: boolean;
  programOnly: boolean;
  verifiedOnly: boolean;
  sortBy: 'popularity' | 'newest' | 'rating';
  page: number;
}
