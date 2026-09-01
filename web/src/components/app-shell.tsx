"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

const ADMIN_NAV: NavItem[] = [
  { href: "/caixa", label: "Caixa" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/estoque", label: "Estoque" },
  { href: "/admin/vendas", label: "Vendas" },
  { href: "/admin/fechamento", label: "Fechamento" },
  { href: "/admin/usuarios", label: "Usuários" },
];

const FUNCIONARIO_NAV: NavItem[] = [{ href: "/caixa", label: "Caixa" }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const nav = user?.role === "ADMIN" ? ADMIN_NAV : FUNCIONARIO_NAV;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r bg-card px-4 py-6 flex flex-col gap-6">
        <div>
          <p className="font-semibold text-lg leading-tight">Mercado</p>
          <p className="text-xs text-muted-foreground">Sistema de Caixa</p>
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{user?.name}</p>
            <p>{user?.role === "ADMIN" ? "Administrador" : "Funcionário"}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
