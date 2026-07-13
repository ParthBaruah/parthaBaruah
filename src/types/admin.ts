export interface SystemMetrics {
  totalUsers: number;
  totalCompanies: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  pendingVerifications: number;
}

export interface IngestionPreviewRow {
  name: string;
  website: string;
  industry_name: string;
  description?: string;
  affiliate_program: boolean;
  creator_program: boolean;
  is_duplicate: boolean;
  matched_id?: string;
}
