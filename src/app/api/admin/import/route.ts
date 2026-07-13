import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const payload = await req.json(); // Clean validated JSON payload items parsed from UI layer
    const rows = payload.rows as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Empty batch context array." }, { status: 400 });
    }

    const processedCompanies = [];

    for (const row of rows) {
      const targetSlug = slugify(row.name);

      // Deduplication checking mechanism: verify match across unique slug handles
      const { data: existingBrand } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", targetSlug)
        .maybeSingle();

      if (existingBrand) {
        // Skip entry entirely or perform analytical record updating configuration layers
        continue;
      }

      // Dynamic baseline industry matching framework routing lookups
      let industryId = null;
      if (row.industry_name) {
        const industrySlug = slugify(row.industry_name);
        const { data: indRecord } = await supabase
          .from("industries")
          .select("id")
          .eq("slug", industrySlug)
          .maybeSingle();
        
        if (indRecord) {
          industryId = indRecord.id;
        } else {
          // Dynamically instantiate new operational industries context definitions
          const { data: newInd } = await supabase
            .from("industries")
            .insert({ name: row.industry_name, slug: industrySlug })
            .select("id")
            .single();
          industryId = newInd?.id;
        }
      }

      processedCompanies.push({
        name: row.name,
        slug: targetSlug,
        website: row.website,
        description: row.description || null,
        industry_id: industryId,
        affiliate_program: !!row.affiliate_program,
        creator_program: !!row.creator_program,
        verification_status: "verified",
        popularity_score: Math.floor(Math.random() * 100) + 1,
      });
    }

    if (processedCompanies.length > 0) {
      const { error } = await supabase.from("companies").insert(processedCompanies);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      importedCount: processedCompanies.length,
      skippedCount: rows.length - processedCompanies.length
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
