"use client";

import React, { useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User as UserIcon, Chrome } from "lucide-react";
import Link from "next/link";

export default function RegisterWorkspaceView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
      setMessage({ type: "success", text: "Registration processed. Please verify your identity via the confirmation link sent to your email." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An identity runtime validation error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleFederation = async () => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch (err: any) {
      console.error("OAuth loop setup crash configuration paths", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 backdrop-blur-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Create Workspace</h2>
          <p className="mt-2 text-sm text-neutral-400">Join SponsorVault to start unlocking sponsorship matching pipelines.</p>
        </div>

        {message && (
          <div className={`rounded-xl border p-4 text-xs ${message.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
            <Input type="text" placeholder="Creative Full Name" className="pl-11" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
            <Input type="email" placeholder="name@domain.com" className="pl-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
            <Input type="password" placeholder="Secure Password String" className="pl-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-purple-600 font-semibold transition-all hover:bg-purple-500 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Initialize Free Registration Pass"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-white/5" />
          <span className="relative bg-neutral-950 px-3 text-xs uppercase text-neutral-500 tracking-wider">Alternative Ingress Gateway</span>
        </div>

        <button
          onClick={handleGoogleFederation}
          type="button"
          className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 font-medium transition-all hover:bg-white/10"
        >
          <Chrome className="h-4 w-4 text-neutral-300" /> Authenticate via Google Identity Loop
        </button>

        <p className="text-center text-xs text-neutral-500 mt-4">
          Already maintaining an active operational license?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">Log In Here</Link>
        </p>
      </div>
    </div>
  );
}
