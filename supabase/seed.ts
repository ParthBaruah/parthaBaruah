import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing configuration credentials. Aborting seed operation.");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function executeSeedingPipeline() {
  console.log("Initializing database seed operations...");

  // 1. Seed Core Industry Categorization Structs
  const industriesPayload = [
    { name: "Fintech Platforms", slug: "fintech-platforms" },
    { name: "Developer Tools & SaaS", slug: "developer-tools-saas" },
    { name: "Consumer Electronics Hardware", slug: "consumer-electronics-hardware" },
  ];

  const { data: seededIndustries, error: indError } = await supabaseAdmin
    .from("industries")
    .upsert(industriesPayload, { onConflict: "slug" })
    .select();

  if (indError) {
    console.error("Failed to seed industries:", indError);
    return;
  }
  console.log(`Seeded ${seededIndustries.length} industry categories successfully.`);

  // 2. Map Mock Brand Accounts across Generated Category IDs
  const fintechId = seededIndustries.find(i => i.slug === "fintech-platforms")?.id;
  const devToolsId = seededIndustries.find(i => i.slug === "developer-tools-saas")?.id;

  const companiesPayload = [
    {
      name: "Apex Ledger Vault",
      slug: "apex-ledger-vault",
      website: "https://apex-ledger-example.io",
      description: "High-yield digital asset custodial architecture scaling corporate processing tiers.",
      industry_id: fintechId,
      affiliate_program: true,
      creator_program: true,
      verification_status: "verified",
      popularity_score: 88,
    },
    {
      name: "CompileFlow AI",
      slug: "compileflow-ai",
      website: "https://compileflow-ai-example.com",
      description: "Contextual continuous integration instrumentation engines for distributed tech operations workspaces.",
      industry_id: devToolsId,
      affiliate_program: false,
      creator_program: true,
      verification_status: "verified",
      popularity_score: 94,
    }
  ];

  const { error: compError } = await supabaseAdmin
    .from("companies")
    .upsert(companiesPayload, { onConflict: "slug" });

  if (compError) {
    console.error("Failed to seed company directories database metrics:", compError);
    return;
  }

  console.log("SponsorVault local data parsing seed operations completed successfully.");
}

executeSeedingPipeline();
