"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { useApi } from "@/lib/use-api";
import { ApiError } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { TAG_CODE_PREFIX, TAG_LABELS, UNIT_LABELS, UNIT_OPTIONS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";

const emptyProductForm = {
  id: "",
  code: "",
  name: "",
  categoryId: "",
  tag: "",
  price: "",
  unit: "UN",
  imageUrl: "",
  stockQuantity: "",
  criticalLevel: "5",
  mediumLevel: "15",
};

const emptyCategoryForm = { id: "", name: "", tags: "" };

function ProdutosContent() {
  const api = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api<Product[]>("/products"),
        api<Category[]>("/categories"),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao carregar dados.");
    }
  }, [api]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load on mount
    loadData();
  }, [loadData]);

  const visibleProducts =
    categoryFilter === "all" ? products : products.filter((p) => p.categoryId === categoryFilter);

  function openCreateProduct() {
    setProductForm({ ...emptyProductForm, categoryId: categories[0]?.id ?? "" });
    setProductDialogOpen(true);
  }

  function openEditProduct(product: Product) {
    setProductForm({
      id: product.id,
      code: product.code,
      name: product.name,
      categoryId: product.categoryId,
      tag: product.tag,
      price: product.price,
      unit: product.unit,
      imageUrl: product.imageUrl ?? "",
      stockQuantity: String(product.stockQuantity),
      criticalLevel: String(product.criticalLevel),
      mediumLevel: String(product.mediumLevel),
    });
    setProductDialogOpen(true);
  }

  async function saveProduct() {
    const payload = {
      code: productForm.code,
      name: productForm.name,
      categoryId: productForm.categoryId,
      tag: productForm.tag,
      price: Number(productForm.price),
      unit: productForm.unit,
      imageUrl: productForm.imageUrl || undefined,
      stockQuantity: Number(productForm.stockQuantity),
      criticalLevel: Number(productForm.criticalLevel),
      mediumLevel: Number(productForm.mediumLevel),
    };

    try {
      if (productForm.id) {
        await api(`/products/${productForm.id}`, { method: "PATCH", body: payload });
        toast.success("Produto atualizado.");
      } else {
        await api("/products", { method: "POST", body: payload });
        toast.success("Produto criado.");
      }
      setProductDialogOpen(false);
      loadData();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao salvar produto.");
    }
  }

  async function deleteProduct(id: string) {
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      toast.success("Produto removido.");
      loadData();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao remover produto.");
    }
  }

  function openCreateCategory() {
    setCategoryForm(emptyCategoryForm);
    setCategoryDialogOpen(true);
  }

  function openEditCategory(category: Category) {
    setCategoryForm({ id: category.id, name: category.name, tags: category.tags.join(", ") });
    setCategoryDialogOpen(true);
  }

  async function saveCategory() {
    const payload = {
      name: categoryForm.name,
      tags: categoryForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (categoryForm.id) {
        await api(`/categories/${categoryForm.id}`, { method: "PATCH", body: payload });
        toast.success("Categoria atualizada.");
      } else {
        await api("/categories", { method: "POST", body: payload });
        toast.success("Categoria criada.");
      }
      setCategoryDialogOpen(false);
      loadData();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao salvar categoria.");
    }
  }

  async function deleteCategory(id: string) {
    try {
      await api(`/categories/${id}`, { method: "DELETE" });
      toast.success("Categoria removida.");
      loadData();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao remover categoria.");
    }
  }

  function suggestCode(tag: string) {
    const prefix = TAG_CODE_PREFIX[tag];
    if (!prefix) return "";
    const usedNumbers = products
      .filter((product) => product.code.startsWith(prefix))
      .map((product) => Number(product.code.slice(prefix.length)))
      .filter((n) => !Number.isNaN(n));
    const next = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
    return `${prefix}${String(next).padStart(3, "0")}`;
  }

  const availableTags = categories.find((c) => c.id === productForm.categoryId)?.tags ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Produtos e Categorias</h1>
        <p className="text-muted-foreground text-sm">
          Cadastro de produtos por categoria, quantidade e preço.
        </p>
      </div>

      <Tabs defaultValue="produtos">
        <TabsList>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produtos</CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => value && setCategoryFilter(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria">
                      {(value: string) =>
                        value === "all"
                          ? "Todas as categorias"
                          : (categories.find((category) => category.id === value)?.name ?? "Categoria")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={openCreateProduct}>Novo produto</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Variação</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <ProductImage src={product.imageUrl} alt={product.name} className="h-10 w-10" />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {product.code}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>{TAG_LABELS[product.tag] ?? product.tag}</TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>{UNIT_LABELS[product.unit] ?? product.unit}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button variant="destructive" size="sm">
                                Excluir
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O produto &quot;{product.name}&quot;
                                será removido permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categorias</CardTitle>
              <Button onClick={openCreateCategory}>Nova categoria</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tags/Variações</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="space-x-1">
                        {category.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {TAG_LABELS[tag] ?? tag}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button variant="outline" size="sm" onClick={() => openEditCategory(category)}>
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button variant="destructive" size="sm">
                                Excluir
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Produtos vinculados a &quot;{category.name}&quot; precisam ser
                                movidos antes da exclusão.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(category.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{productForm.id ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Código do produto</Label>
                <Input
                  value={productForm.code}
                  onChange={(event) =>
                    setProductForm({ ...productForm, code: event.target.value.toUpperCase() })
                  }
                  placeholder="LAT001"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Prefixo da variação + número, ex.: LAT001. Sugerido automaticamente ao escolher
                  a variação.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Foto do produto (URL)</Label>
                <Input
                  value={productForm.imageUrl}
                  onChange={(event) => setProductForm({ ...productForm, imageUrl: event.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={productForm.name}
                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={productForm.categoryId}
                onValueChange={(value) =>
                  value && setProductForm({ ...productForm, categoryId: value, tag: "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string) =>
                      categories.find((category) => category.id === value)?.name ?? "Selecione"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Variação</Label>
              <Select
                value={productForm.tag}
                onValueChange={(value) =>
                  value &&
                  setProductForm({
                    ...productForm,
                    tag: value,
                    code: productForm.code || suggestCode(value),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string) => TAG_LABELS[value] ?? value ?? "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {TAG_LABELS[tag] ?? tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade de venda</Label>
                <Select
                  value={productForm.unit}
                  onValueChange={(value) => value && setProductForm({ ...productForm, unit: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>{(value: string) => UNIT_LABELS[value] ?? value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {UNIT_LABELS[unit]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estoque</Label>
                <Input
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(event) =>
                    setProductForm({ ...productForm, stockQuantity: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nível crítico</Label>
                <Input
                  type="number"
                  value={productForm.criticalLevel}
                  onChange={(event) =>
                    setProductForm({ ...productForm, criticalLevel: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nível médio</Label>
                <Input
                  type="number"
                  value={productForm.mediumLevel}
                  onChange={(event) =>
                    setProductForm({ ...productForm, mediumLevel: event.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProduct}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{categoryForm.id ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={categoryForm.tags}
                onChange={(event) => setCategoryForm({ ...categoryForm, tags: event.target.value })}
                placeholder="laticinios, carnes, sem_gluten"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <AppShell>
        <ProdutosContent />
      </AppShell>
    </AuthGuard>
  );
}
