/* eslint-disable @typescript-eslint/no-explicit-any */
import {  AssetStatus, AssetWithRelations } from "@/utils/schemas/schemas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseAssetDates(asset: any): AssetWithRelations {
  return {
    ...asset,
    createdAt: new Date(asset.createdAt),
    updatedAt: new Date(asset.updatedAt),
    purchaseDate: new Date(asset.purchaseDate),
    warrantyExpiry: new Date(asset.warrantyExpiry),
    lastMaintenanceDate: asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate) : null,
  };
}

export function getAssetStatusColor(status: AssetStatus): string {
  const colors = {
    available: "bg-green-100 text-green-800 border-green-200",
    in_use: "bg-blue-100 text-blue-800 border-blue-200",
    maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
    retired: "bg-gray-100 text-gray-800 border-gray-200",
    lost: "bg-red-100 text-red-800 border-red-200",
  }
  return colors[status]
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: "Disponível",
    in_use: "Em Uso",
    maintenance: "Manutenção",
    retired: "Aposentado",
    lost: "Perdido",
    active: "Ativo",
    expired: "Expirado",
    suspended: "Suspenso",
    pending: "Pendente",
    cancelled: "Cancelado",
    open: "Aberto",
    in_progress: "Em Andamento",
    resolved: "Resolvido",
    closed: "Fechado",
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    critical: "Crítica",
  }
  return labels[status] || status
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`
  }
  return formatCurrency(value)
}
