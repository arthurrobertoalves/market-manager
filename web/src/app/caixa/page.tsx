"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { ProductImage } from "@/components/product-image";
import { useApi } from "@/lib/use-api";
import { ApiError } from "@/lib/api";
import type { PaymentMethod, Product, Sale } from "@/lib/types";
import { PAYMENT_METHOD_LABELS, TAG_LABELS, UNIT_LABELS } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  product: Product;
  quantity: number;
}

const PAYMENT_METHODS: PaymentMethod[] = ["CREDITO", "DEBITO", "PIX", "DINHEIRO"];

function CaixaContent() {
  const api = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerCpf, setCustomerCpf] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("DINHEIRO");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Sale | null>(null);

  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<Product | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = useCallback(() => {
    return api<Product[]>("/products")
      .then(setProducts)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar produtos."));
  }, [api]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Simula a tecla de ativação do leitor de código de barras (F2): foca o
  // campo de leitura a qualquer momento, mesmo com o cursor em outro campo.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "F2") {
        event.preventDefault();
        barcodeInputRef.current?.focus();
        barcodeInputRef.current?.select();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.code.includes(term) ||
        product.category.name.toLowerCase().includes(term) ||
        (TAG_LABELS[product.tag] ?? product.tag).toLowerCase().includes(term),
    );
  }, [products, search]);

  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  function addToCart(product: Product) {
    let blocked = false;
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      const currentQty = existing?.quantity ?? 0;
      if (currentQty + 1 > product.stockQuantity) {
        blocked = true;
        return current;
      }
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    if (blocked) {
      toast.error(`Estoque insuficiente para "${product.name}".`);
    }
    return !blocked;
  }

  async function handleScan() {
    const code = barcode.trim();
    if (!code) return;

    setScanning(true);
    try {
      const product = await api<Product>(`/products/code/${encodeURIComponent(code)}`);
      const added = addToCart(product);
      if (added) {
        setLastScanned(product);
        toast.success(`${product.name} adicionado.`);
      }
    } catch (err) {
      setLastScanned(null);
      toast.error(err instanceof ApiError ? err.message : "Código não encontrado.");
    } finally {
      setBarcode("");
      setScanning(false);
      barcodeInputRef.current?.focus();
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    setCart((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  function removeFromCart(productId: string) {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }

  function resetSale() {
    setCart([]);
    setCustomerCpf("");
    setPaymentMethod("DINHEIRO");
    setLastScanned(null);
  }

  async function finalizeSale() {
    if (cart.length === 0) {
      toast.error("Adicione ao menos um produto ao carrinho.");
      return;
    }

    setSubmitting(true);
    try {
      const sale = await api<Sale>("/sales", {
        method: "POST",
        body: {
          customer: customerCpf ? { cpf: customerCpf } : undefined,
          items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          paymentMethod,
        },
      });
      setReceipt(sale);
      await loadProducts();
      resetSale();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao finalizar a venda.");
    } finally {
      setSubmitting(false);
      barcodeInputRef.current?.focus();
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leitura de código de barras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="barcode">
                Bipe o produto ou digite o código e pressione Enter (atalho: F2 foca aqui)
              </Label>
              <Input
                id="barcode"
                ref={barcodeInputRef}
                autoFocus
                autoComplete="off"
                value={barcode}
                disabled={scanning}
                onChange={(event) => setBarcode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleScan();
                  }
                }}
                placeholder="0000000000000"
                className="font-mono text-lg h-12"
              />
            </div>

            <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-4 py-2 min-w-64">
              {lastScanned ? (
                <>
                  <ProductImage
                    src={lastScanned.imageUrl}
                    alt={lastScanned.name}
                    className="h-14 w-14 shrink-0"
                  />
                  <div className="text-sm">
                    <p className="font-medium leading-tight">{lastScanned.name}</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(lastScanned.price)} / {UNIT_LABELS[lastScanned.unit] ?? lastScanned.unit}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aguardando leitura do produto...</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Busca manual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Buscar por nome, código, categoria ou variação..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="max-h-[360px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead />
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <ProductImage src={product.imageUrl} alt={product.name} className="h-10 w-10" />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {TAG_LABELS[product.tag] ?? product.tag} · {product.code}
                          </div>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>
                          {formatCurrency(product.price)} / {UNIT_LABELS[product.unit] ?? product.unit}
                        </TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            disabled={product.stockQuantity === 0}
                            onClick={() => {
                              if (addToCart(product)) {
                                setLastScanned(product);
                              }
                            }}
                          >
                            Adicionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum produto no carrinho.</p>
              )}
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-2 text-sm">
                  <ProductImage src={item.product.imageUrl} alt={item.product.name} className="h-9 w-9 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.product.price)} / {UNIT_LABELS[item.product.unit] ?? item.product.unit}
                    </p>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={item.product.stockQuantity}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                    className="w-16"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)}>
                    Remover
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-3 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CPF na nota (opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerCpf">CPF do cliente</Label>
                <Input
                  id="customerCpf"
                  value={customerCpf}
                  onChange={(event) => setCustomerCpf(event.target.value)}
                  placeholder="000.000.000-00 (deixe em branco se não quiser)"
                />
              </div>
              <div className="space-y-2">
                <Label>Forma de pagamento</Label>
                <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {PAYMENT_METHOD_LABELS[method]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled={submitting} onClick={finalizeSale}>
                {submitting ? "Finalizando..." : "Finalizar venda"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!receipt}
        onOpenChange={(open) => {
          if (!open) {
            setReceipt(null);
            barcodeInputRef.current?.focus();
          }
        }}
      >
        <DialogContent className="max-w-md print:shadow-none">
          <DialogHeader>
            <DialogTitle>Nota Fiscal Simplificada</DialogTitle>
          </DialogHeader>
          {receipt && (
            <div id="receipt" className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{formatDate(receipt.createdAt)}</span>
                <Badge variant="secondary">{PAYMENT_METHOD_LABELS[receipt.paymentMethod]}</Badge>
              </div>
              {receipt.customer && (
                <div>
                  <p className="text-xs text-muted-foreground">CPF na nota: {receipt.customer.cpf}</p>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Unit.</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(receipt.total)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()}>
              Imprimir
            </Button>
            <Button onClick={() => setReceipt(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CaixaPage() {
  return (
    <AuthGuard>
      <AppShell>
        <CaixaContent />
      </AppShell>
    </AuthGuard>
  );
}
