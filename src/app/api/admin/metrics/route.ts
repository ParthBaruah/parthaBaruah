import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Verify requesting security context is administrative
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access path." }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden architectural context elevation." }, { status: 403 });
    }

    // Parallel metric pipeline execution blocks
    const [usersCount, companiesCount, subsCount, pendingCount] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("companies").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    ]);

    // Simple computed MRR aggregation simulation layer ($29 MRR weighted base index metrics)
    const activeSubCount = subsCount.count || 0;
    const computedMrr = activeSubCount * 29;

    return NextResponse.json({
      totalUsers: usersCount.count || 0,
      totalCompanies: companiesCount.count || 0,
      activeSubscriptions: activeSubCount,
      monthlyRecurringRevenue: computedMrr,
      pendingVerifications: pendingCount.count || 0,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
