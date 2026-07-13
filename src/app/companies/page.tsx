"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchFilters, Company } from "@/types";
import { Input } from "@/components/ui/input";
import { SponsorCard } from "@/components/shared/sponsor-card";
import { Search, SlidersHorizontal, Loader2, Sparkles } from "lucide-react";

export default function SearchMarketplace() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    industry: "",
    creatorSize: "",
    affiliateOnly: false,
    programOnly: false,
    verifiedOnly: false,
    sortBy: "popularity",
    page: 1,
  });

  const debouncedQuery = useDebounce(filters.query, 350);

  const executeFetch = useCallback(async (filterSet: SearchFilters, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: debouncedQuery,
        industry: filterSet.industry,
        creatorSize: filterSet.creatorSize,
        affiliateOnly: String(filterSet.affiliateOnly),
        programOnly: String(filterSet.programOnly),
        verifiedOnly: String(filterSet.verifiedOnly),
        sortBy: filterSet.sortBy,
        page: String(filterSet.page),
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const payload = await response.json();
      
      if (append) {
        setCompanies((prev) => [...prev, ...payload.companies]);
      } else {
        setCompanies(payload.companies);
      }
      setHasMore(filterSet.page < payload.meta.totalPages);
    } catch (err) {
      console.error("Execution failure fetching query layers", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    executeFetch({ ...filters, query: debouncedQuery, page: 1 }, false);
  }, [debouncedQuery, filters.industry, filters.affiliateOnly, filters.programOnly, filters.verifiedOnly, filters.sortBy]);

  const loadNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = filters.page + 1;
      setFilters((prev) => ({ ...prev, page: nextPage }));
      executeFetch({ ...filters, page: nextPage }, true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Segment */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Sponsor Database</h1>
            <p className="mt-2 text-sm text-neutral-400">Instantly query real world active corporate production channels.</p>
          </div>
        </div>

        {/* Filters Matrix Grid Control Panel */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3 relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search by company name, keywords or niche parameters..."
              className="pl-11"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            />
          </div>
          
          <div>
            <select
              className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md focus:border-purple-500/50 focus:outline-none"
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest Matrix Entry</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Checkbox Switches Sub-Row Layout */}
        <div className="mt-4 flex flex-wrap gap-4 items-center border-b border-white/5 pb-6">
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
              className="rounded border-white/10 bg-black/40 text-purple-600 focus:ring-0"
            />
            Verified Sponsors Only
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.affiliateOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, affiliateOnly: e.target.checked }))}
              className="rounded border-white/10 bg-black/40 text-purple-600 focus:ring-0"
            />
            Has Affiliate Program
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.programOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, programOnly: e.target.checked }))}
              className="rounded border-white/10 bg-black/40 text-purple-600 focus:ring-0"
            />
            Has Creator Program
          </label>
        </div>

        {/* Result Renderer Dynamic Grid Workspace */}
        <div className="mt-8">
          {companies.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-neutral-900/20 py-24 text-center">
              <Sparkles className="h-10 w-10 text-neutral-600" />
              <h3 className="mt-4 text-lg font-medium text-white">No sponsors discovered</h3>
              <p className="mt-2 text-sm text-neutral-400 max-w-xs">Try loosening execution query properties parameters filter fields.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <SponsorCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {/* Infinite Scroll Execution Action Interface Boundary Row */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadNextPage}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" /> Processing...
                  </>
                ) : (
                  "Load More Sponsors"
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
