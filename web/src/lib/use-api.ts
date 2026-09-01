"use client";

import { useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/api";

export function useApi() {
  const { token } = useAuth();

  return useCallback(
    <T,>(path: string, options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {}) =>
      apiRequest<T>(path, { ...options, token }),
    [token],
  );
}
