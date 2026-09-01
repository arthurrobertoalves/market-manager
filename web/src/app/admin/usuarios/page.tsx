"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { useApi } from "@/lib/use-api";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import type { AppUser, Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

const emptyForm = { id: "", name: "", email: "", password: "", role: "FUNCIONARIO" as Role };

function UsuariosContent() {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUsers = useCallback(() => {
    return api<AppUser[]>("/users")
      .then(setUsers)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Erro ao carregar usuários."));
  }, [api]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function openCreate() {
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(user: AppUser) {
    setForm({ id: user.id, name: user.name, email: user.email, password: "", role: user.role });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.name || !form.email) {
      toast.error("Preencha nome e email.");
      return;
    }
    if (!form.id && !form.password) {
      toast.error("Defina uma senha para o novo usuário.");
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (form.id) {
        await api(`/users/${form.id}`, { method: "PATCH", body: payload });
        toast.success("Usuário atualizado.");
      } else {
        await api("/users", { method: "POST", body: payload });
        toast.success("Usuário criado.");
      }
      setDialogOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao salvar usuário.");
    }
  }

  async function remove(id: string) {
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      toast.success("Usuário removido.");
      loadUsers();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erro ao remover usuário.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-muted-foreground text-sm">
          Crie contas de funcionário (ou administrador) a partir de um email e senha.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contas cadastradas</CardTitle>
          <Button onClick={openCreate}>Novo funcionário</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? "Administrador" : "Funcionário"}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={user.id === currentUser?.id}
                          >
                            Excluir
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                          <AlertDialogDescription>
                            A conta &quot;{user.email}&quot; perderá acesso ao sistema
                            imediatamente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(user.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar usuário" : "Novo funcionário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="funcionario@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>{form.id ? "Nova senha (opcional)" : "Senha"}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder={form.id ? "Deixe em branco para manter a atual" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select value={form.role} onValueChange={(value) => value && setForm({ ...form, role: value as Role })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <AppShell>
        <UsuariosContent />
      </AppShell>
    </AuthGuard>
  );
}
