import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/dashboard";

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=auth_code_missing", req.url));
    }

    const supabase = getSupabaseAdmin();
    
    // Exchange the authorization code token for a verified internal JWT session block
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) throw error;

    // Route structural workspace safely forward following successful handshake execution
    return NextResponse.redirect(new URL(next, req.url));
  } catch (err: any) {
    console.error("OAuth2 handshake fatal loop processing fallback trigger:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
