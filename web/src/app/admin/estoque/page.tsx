"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { useApi } from "@/lib/use-api";
import { ApiError } from "@/lib/api";
import type { Product, StockAlert, StockStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StockDashboard {
  critical: (Product & { status: StockStatus })[];
  medium: (Product & { status: StockStatus })[];
  ok: (Product & { status: StockStatus })[];
}

const STATUS_VARIANT: Record<StockStatus, "destructive" | "secondary" | "outline"> = {
  CRITICO: "destructive",
  MEDIO: "secondary",
  OK: "outline",
};

const STATUS_LABEL: Record<StockStatus, string> = {
  CRITICO: "Crítico",
  MEDIO: "Médio",
  OK: "OK",
};

function EstoqueContent() {
  const api = useApi();
  const [dashboard, setDashboard] = useState<StockDashboard | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    Promise.all([api<StockDashboard>("/dashboard/stock"), api<StockAlert[]>("/stock/alerts?resolved=false")])
      .then(([stock, alertsData]) => {
        setDashboard(stock);
        setAlerts(alertsData);
      })
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar estoque."));
  }, [api]);

  const rows = dashboard ? [...dashboard.critical, ...dashboard.medium, ...dashboard.ok] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Painel de Estoque</h1>
        <p className="text-muted-foreground text-sm">
          Produtos em estado crítico e médio de estoque.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Crítico</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-destructive">
            {dashboard?.critical.length ?? "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Médio</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{dashboard?.medium.length ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">OK</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{dashboard?.ok.length ?? "-"}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[product.status]}>
                      {STATUS_LABEL[product.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas automáticos (fornecedor/gerente)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{formatDate(alert.notifiedAt)}</TableCell>
                  <TableCell>{alert.product.name}</TableCell>
                  <TableCell>
                    <Badge variant={alert.level === "CRITICO" ? "destructive" : "secondary"}>
                      {alert.level === "CRITICO" ? "Crítico" : "Médio"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alert.message}</TableCell>
                </TableRow>
              ))}
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum alerta pendente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EstoquePage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <AppShell>
        <EstoqueContent />
      </AppShell>
    </AuthGuard>
  );
}
