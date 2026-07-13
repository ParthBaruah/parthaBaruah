import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const industry = searchParams.get("industry") || "";
    const creatorSize = searchParams.get("creatorSize") || "";
    const affiliateOnly = searchParams.get("affiliateOnly") === "true";
    const programOnly = searchParams.get("programOnly") === "true";
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sortBy = searchParams.get("sortBy") || "popularity";
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    const limit = 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = getSupabaseAdmin();
    let dbQuery = supabase
      .from("companies")
      .select(`
        *,
        industries:industry_id (name, slug),
        company_categories!inner (category_id),
        company_creator_sizes!inner (creator_size_id)
      `, { count: "exact" });

    // Text Search Configuration via pg vector match
    if (query) {
      dbQuery = dbQuery.textSearch("search_vector", query, {
        config: "english",
        type: "websearch",
      });
    }

    // Dynamic Filter Pipeline
    if (industry) {
      dbQuery = dbQuery.eq("industry_id", industry);
    }
    if (affiliateOnly) {
      dbQuery = dbQuery.eq("affiliate_program", true);
    }
    if (programOnly) {
      dbQuery = dbQuery.eq("creator_program", true);
    }
    if (verifiedOnly) {
      dbQuery = dbQuery.eq("verification_status", "verified");
    }

    // Sorting Pipeline
    if (sortBy === "newest") {
      dbQuery = dbQuery.order("created_at", { ascending: false });
    } else if (sortBy === "rating") {
      dbQuery = dbQuery.order("rating", { ascending: false });
    } else {
      dbQuery = dbQuery.order("popularity_score", { ascending: false });
    }

    const { data, count, error } = await dbQuery.range(from, to);

    if (error) throw error;

    return NextResponse.json({
      companies: data || [],
      meta: {
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
