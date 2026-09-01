export type Role = "ADMIN" | "FUNCIONARIO";

export type PaymentMethod = "CREDITO" | "DEBITO" | "PIX" | "DINHEIRO";

export type SaleStatus = "FINALIZADA" | "CANCELADA";

export type StockAlertLevel = "CRITICO" | "MEDIO";

export type StockStatus = "CRITICO" | "MEDIO" | "OK";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  tag: string;
  price: string;
  unit: string;
  imageUrl: string | null;
  stockQuantity: number;
  criticalLevel: number;
  mediumLevel: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface Customer {
  id: string;
  name: string | null;
  contact: string | null;
  cpf: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  canceled: boolean;
  cancelReason: string | null;
  createdAt: string;
  product: Product;
}

export interface Sale {
  id: string;
  customerId: string;
  userId: string;
  total: string;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  user: { id: string; name: string; email: string };
  items: SaleItem[];
}

export interface StockAlert {
  id: string;
  productId: string;
  level: StockAlertLevel;
  message: string;
  notifiedAt: string;
  resolved: boolean;
  product: Product;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDITO: "Crédito",
  DEBITO: "Débito",
  PIX: "Pix",
  DINHEIRO: "Dinheiro",
};

export const UNIT_OPTIONS = ["UN", "KG", "L", "PCT"] as const;

export const UNIT_LABELS: Record<string, string> = {
  UN: "Unidade",
  KG: "Quilo (kg)",
  L: "Litro (L)",
  PCT: "Pacote",
};

export const TAG_LABELS: Record<string, string> = {
  laticinios: "Laticínios",
  carnes: "Carnes",
  sem_gluten: "Sem Glúten",
  zero_lactose: "Zero Lactose",
  vegetais: "Vegetais",
  doces: "Doces",
};

// Prefixo usado no código do produto (ex.: LAT001 para laticínios) — não é um
// código de barras real, é uma convenção interna por variação/categoria.
export const TAG_CODE_PREFIX: Record<string, string> = {
  laticinios: "LAT",
  carnes: "CAR",
  sem_gluten: "SGL",
  zero_lactose: "ZLA",
  vegetais: "VEG",
  doces: "DOC",
};
