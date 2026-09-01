"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { useApi } from "@/lib/use-api";
import { ApiError } from "@/lib/api";
import type { Product, Sale } from "@/lib/types";
import { PAYMENT_METHOD_LABELS } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Period = "week" | "month" | "3months" | "semester";

const PERIOD_LABELS: Record<Period, string> = {
  week: "Última semana",
  month: "Último mês",
  "3months": "Últimos 3 meses",
  semester: "Último semestre",
};

interface RankingEntry {
  product: Product;
  quantitySold: number;
  totalRevenue: string;
}

interface SalesDashboard {
  period: Period;
  mostSold: RankingEntry[];
  leastSold: RankingEntry[];
}

const chartConfig = {
  quantitySold: { label: "Quantidade vendida", color: "var(--chart-1)" },
} satisfies ChartConfig;

function VendasContent() {
  const api = useApi();
  const [period, setPeriod] = useState<Period>("week");
  const [dashboard, setDashboard] = useState<SalesDashboard | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [reason, setReason] = useState("");

  function loadDashboard(selectedPeriod: Period) {
    api<SalesDashboard>(`/dashboard/sales?period=${selectedPeriod}`)
      .then(setDashboard)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar vendas."));
  }

  function loadSales() {
    api<Sale[]>("/sales")
      .then(setSales)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar histórico."));
  }

  useEffect(() => {
    loadDashboard(period);
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, period]);

  async function cancelSale(saleId: string) {
    if (!reason.trim()) {
      toast.error("Informe uma justificativa para o cancelamento.");
      return;
    }
    try {
      await api(`/sales/${saleId}/cancel`, { method: "PATCH", body: { reason } });
      toast.success("Venda cancelada e estoque restaurado.");
      setReason("");
      loadSales();
      loadDashboard(period);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao cancelar venda.");
    }
  }

  const chartData =
    dashboard?.mostSold.map((entry) => ({
      name: entry.product.name,
      quantitySold: entry.quantitySold,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel de Vendas</h1>
          <p className="text-muted-foreground text-sm">
            Produtos mais vendidos e histórico de vendas.
          </p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
              <SelectItem key={key} value={key}>
                {PERIOD_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mais vendidos - {PERIOD_LABELS[period]}</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={140} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantitySold" fill="var(--color-quantitySold)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground">Sem vendas no período selecionado.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mais vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard?.mostSold.map((entry) => (
                  <TableRow key={entry.product.id}>
                    <TableCell>{entry.product.name}</TableCell>
                    <TableCell>{entry.quantitySold}</TableCell>
                    <TableCell>{formatCurrency(entry.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menos vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard?.leastSold.map((entry) => (
                  <TableRow key={entry.product.id}>
                    <TableCell>{entry.product.name}</TableCell>
                    <TableCell>{entry.quantitySold}</TableCell>
                    <TableCell>{formatCurrency(entry.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>CPF na nota</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.createdAt)}</TableCell>
                  <TableCell>{sale.customer?.cpf ?? "—"}</TableCell>
                  <TableCell>{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</TableCell>
                  <TableCell>{formatCurrency(sale.total)}</TableCell>
                  <TableCell>
                    <Badge variant={sale.status === "FINALIZADA" ? "outline" : "destructive"}>
                      {sale.status === "FINALIZADA" ? "Finalizada" : "Cancelada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {sale.status === "FINALIZADA" && (
                      <AlertDialog onOpenChange={(open) => !open && setReason("")}>
                        <AlertDialogTrigger
                          render={
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar venda?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O estoque dos itens será restaurado. Informe uma justificativa.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label>Justificativa</Label>
                            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelSale(sale.id)}>
                              Confirmar cancelamento
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VendasPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <AppShell>
        <VendasContent />
      </AppShell>
    </AuthGuard>
  );
}
