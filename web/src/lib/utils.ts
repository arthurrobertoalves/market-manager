import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value
  return numeric.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleString("pt-BR")
}
