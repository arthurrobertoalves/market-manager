"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { useApi } from "@/lib/use-api";
import { ApiError } from "@/lib/api";
import type { PaymentMethod, Sale } from "@/lib/types";
import { PAYMENT_METHOD_LABELS } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClosingReport {
  date: string;
  totalGeral: string;
  totalPorFormaPagamento: Partial<Record<PaymentMethod, string>>;
  quantidadeVendas: number;
  sales: Sale[];
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function FechamentoContent() {
  const api = useApi();
  const [date, setDate] = useState(todayIso());
  const [report, setReport] = useState<ClosingReport | null>(null);

  useEffect(() => {
    api<ClosingReport>(`/sales/closing?date=${date}`)
      .then(setReport)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar fechamento."));
  }, [api, date]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fechamento de Caixa</h1>
          <p className="text-muted-foreground text-sm">
            Relatório diário de fechamento com total vendido e por forma de pagamento.
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="closing-date">Data</Label>
          <Input
            id="closing-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total vendido</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {report ? formatCurrency(report.totalGeral) : "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Vendas finalizadas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{report?.quantidadeVendas ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Ticket médio</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {report && report.quantidadeVendas > 0
              ? formatCurrency(Number(report.totalGeral) / report.quantidadeVendas)
              : "-"}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total por forma de pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Forma</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((method) => (
                <TableRow key={method}>
                  <TableCell>{PAYMENT_METHOD_LABELS[method]}</TableCell>
                  <TableCell>
                    {formatCurrency(report?.totalPorFormaPagamento[method] ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendas do dia</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>CPF na nota</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report?.sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.createdAt)}</TableCell>
                  <TableCell>{sale.customer?.cpf ?? "—"}</TableCell>
                  <TableCell>{sale.user.name}</TableCell>
                  <TableCell>{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</TableCell>
                  <TableCell>{formatCurrency(sale.total)}</TableCell>
                </TableRow>
              ))}
              {report && report.sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma venda finalizada nesta data.
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

export default function FechamentoPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <AppShell>
        <FechamentoContent />
      </AppShell>
    </AuthGuard>
  );
}
