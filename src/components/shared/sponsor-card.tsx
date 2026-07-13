import React from "react";
import Image from "next/image";
import Link from "next/Link";
import { CheckCircle2, ArrowUpRight, Award, DollarSign } from "lucide-react";
import { Company } from "@/types";

export function SponsorCard({ company }: { company: Company }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-2">
            <Image
              src={company.logo_url || "/fallback-logo.svg"}
              alt={`${company.name} logo`}
              fill
              className="object-contain"
              priority={false}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-white transition-colors group-hover:text-purple-400">
                {company.name}
              </h3>
              {company.verification_status === "verified" && (
                <CheckCircle2 className="h-4 w-4 fill-blue-500 text-neutral-950" />
              )}
            </div>
            <p className="text-xs text-neutral-400">{company.industries?.name || "General Marketplace"}</p>
          </div>
        </div>
        
        <Link
          href={`/companies/${company.slug}`}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-neutral-300">
        {company.description || "No company description provided."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {company.affiliate_program && (
          <span className="inline-flex mountaineer items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-3 w-3" /> Affiliate
          </span>
        )}
        {company.creator_program && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400 border border-purple-500/20">
            <Award className="h-3 w-3" /> Creator Program
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-neutral-400">
        <span>Score: <b className="text-neutral-200">{company.popularity_score}</b></span>
        <span>Rating: <b className="text-neutral-200">{company.rating || "N/A"} ★</b></span>
      </div>
    </div>
  );
}
