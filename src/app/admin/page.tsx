"use client";

import React, { useState, useEffect } from "react";
import { SystemMetrics } from "@/types/admin";
import { Users, Building2, BarChart3, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AdministrativeDashboardView() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [importing, setImporting] = useState<boolean>(false);
  const [csvRawText, setCsvRawText] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSystemMetrics() {
      try {
        const response = await fetch("/api/admin/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Metrics aggregation engine breakdown:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSystemMetrics();
  }, []);

  const handleCsvBulkIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvRawText.trim()) return;
    setImporting(true);
    setStatusMessage(null);

    try {
      // Basic split layout lines parser pipeline
      const lines = csvRawText.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      
      const parsedRows = lines.slice(1).filter(line => line.trim() !== "").map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const rowObj: any = {};
        headers.forEach((header, index) => {
          rowObj[header] = values[index];
        });
        return {
          name: rowObj.name,
          website: rowObj.website,
          industry_name: rowObj.industry || "General",
          description: rowObj.description || "",
          affiliate_program: rowObj.affiliate === "true" || rowObj.affiliate === "1",
          creator_program: rowObj.program === "true" || rowObj.program === "1",
        };
      });

      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows }),
      });
      const result = await response.json();

      if (response.ok) {
        setStatusMessage(`Ingest completed: Imported ${result.importedCount} new entities, skipped ${result.skippedCount} duplicated handles.`);
        setCsvRawText("");
      } else {
        throw new Error(result.error || "Ingestion pipeline validation error.");
      }
    } catch (err: any) {
      setStatusMessage(`Error during execution mapping sequences: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin System Operations</h1>
          <p className="mt-1 text-sm text-neutral-400">Global system runtime operations monitoring and bulk data loading arrays.</p>
        </div>

        {/* Analytic Metrics Row Blocks */}
        {metrics && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/5 bg-neutral-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-400">Total User Base</span>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{metrics.totalUsers}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-neutral-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-400">Tracked Sponsors</span>
                <Building2 className="h-5 w-5 text-purple-400" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{metrics.totalCompanies}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-neutral-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-400">Active Licenses</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{metrics.activeSubscriptions}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-neutral-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-400">Projected MRR Array</span>
                <BarChart3 className="h-5 w-5 text-pink-400" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">${metrics.monthlyRecurringRevenue}</p>
            </div>
          </div>
        )}

        {/* Data Ingestion Workspace Core Grid Interface */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Bulk Entity Data Loader (CSV)</h2>
            </div>
            
            <form onSubmit={handleCsvBulkIngest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Paste Raw Comma Separated Strings. Mandatory columns layout format: <code className="text-purple-400 font-mono">name,website,industry,description,affiliate,program</code>
                </label>
                <textarea
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder="Example Brand,https://example.com,Fintech,Corporate integration buyer,true,false"
                  rows={8}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white placeholder-neutral-600 focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={importing || !csvRawText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-purple-500 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Committing Batch Rows...
                  </>
                ) : (
                  "Execute Structural Data Merge"
                )}
              </button>
            </form>

            {statusMessage && (
              <div className="mt-4 rounded-xl border border-white/5 bg-neutral-900/60 p-4 text-xs text-neutral-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-neutral-900/20 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm">Automated Pipeline Guardrails</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                The administrative processing route automatically strips blank records, builds functional URL normalization rules, compiles custom slugs, and references indexing clusters mapping duplicate records to eliminate database poisoning.
              </p>
            </div>
            <div className="text-[11px] text-neutral-600 font-mono mt-6">System lifecycle status: stable production build operational.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
