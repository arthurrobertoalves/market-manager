"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role === "ADMIN") {
      router.replace("/admin/produtos");
    } else {
      router.replace("/caixa");
    }
  }, [loading, user, router]);

  return (
    <div className="flex h-screen items-center justify-center text-muted-foreground">
      Carregando...
    </div>
  );
}
