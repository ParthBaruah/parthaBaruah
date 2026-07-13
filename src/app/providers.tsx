"use client";

import React from "react";
import { AuthProvider } from "@/hooks/use-auth";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return React.createElement(AuthProvider, null, children);
}
