/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaintenanceRecord } from "@/types/maintence-props";
import { Asset} from "@/utils/schemas/assets.schemas";
import { AssetStatus, ContractStatus, LicenseStatus, TicketPriorityType, TicketStatusType } from "@/utils/schemas/enums.schemas";
import { License } from "@/utils/schemas/license.schemas";
import { clsx, type ClassValue } from "clsx"
import { subMonths } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseAssetDates(asset: any): Asset {
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

// Date utility functions

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return "agora há pouco"
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `há ${hours} hora${hours > 1 ? "s" : ""}`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `há ${days} dia${days > 1 ? "s" : ""}`
  }
  return formatDate(d)
}

export function isExpiringSoon(date: Date | string, daysThreshold = 30): boolean {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInDays = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays >= 0 && diffInDays <= daysThreshold
}

export function isExpired(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date
  return d.getTime() < new Date().getTime()
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function computeRenewalDate(expiryDate?: Date | string | null): Date | null {
  if (!expiryDate) return null

  const date = expiryDate instanceof Date ? expiryDate : new Date(expiryDate)
  if (Number.isNaN(date.getTime())) return null

  return subMonths(date, 1)
}

export function formatDuration(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate
  const end = typeof endDate === "string" ? new Date(endDate) : endDate

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  const parts: string[] = []
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "ano" : "anos"}`)
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mes" : "meses"}`)
  }
  if (parts.length === 0) {
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} ${days === 1 ? "dia" : "dias"}`
  }

  return parts.join(" e ")
}

export function formatRemainingDuration(endDate: Date | string): string {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate
  const now = new Date()

  if (end.getTime() < now.getTime()) {
    return "Vencido"
  }

  return formatDuration(now, end)
}


export const maintenanceTypeLabels: Record<MaintenanceRecord["maintenanceType"], string> = {
  preventive: "Preventiva",
  corrective: "Corretiva",
  upgrade: "Upgrade",
  inspection: "Inspeção",
  cleaning: "Limpeza"
}

export const maintenanceTypeColors: Record<MaintenanceRecord["maintenanceType"], string> = {
  preventive: "bg-blue-100 text-blue-800 border-blue-200",
  corrective: "bg-orange-100 text-orange-800 border-orange-200",
  upgrade: "bg-purple-100 text-purple-800 border-purple-200",
  inspection: "bg-green-100 text-green-800 border-green-200",
  cleaning: "bg-red-100 text-red-800 border-red-200"
}


export function getTicketStatusColor(status: TicketStatusType): string {
  const colors = {
    open: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-purple-100 text-purple-800 border-purple-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  }
  return colors[status]
}

export function getTicketPriorityColor(priority: TicketPriorityType): string {
  const colors = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }
  return colors[priority]
}

export function getLicenseStatusColor(status: LicenseStatus): string {
  const colors = {
    active: "bg-green-100 text-green-800 border-green-200",
    expired: "bg-red-100 text-red-800 border-red-200",
    suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }
  return colors[status]
}

export function getContractStatusColor(status: ContractStatus): string {
  const colors = {
    active: "bg-green-100 text-green-800 border-green-200",
    expired: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  }
  return colors[status]
}

export function getLicenseTypeLabel(type: string) {
  const labels: Record<string, string> = {
    subscription: "Assinatura",
    perpetual: "Perpétua",
    concurrent: "Concorrente",
    "named-user": "Por Usuário",
  }
  return labels[type] || type
}

export function getLicenseDetails(license: License) {
  const utilizationPercent = Math.round(((license.users?.length || 0) / license.totalSeats) * 100)
  const isExpiring = license.expiryDate && isExpiringSoon(license.expiryDate, 60)
  const daysUntilExpiry = license.expiryDate ? getDaysUntil(license.expiryDate) : null
  const renewalDate = license.expiryDate ? computeRenewalDate(license.expiryDate) : null

  return { utilizationPercent, isExpiring, daysUntilExpiry, renewalDate }
} 

export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  const onlyNumbers = value.replace(/[^\d]/g, '');
  
  if (!onlyNumbers) return 0;
  
  return parseFloat(onlyNumbers) / 100;
};

export const handleCurrencyChange = <T>(
  fieldName: keyof T,
  value: string,
  setValue: (name: keyof T, value: number) => void
) => {
  const numericValue = parseCurrency(value);
  setValue(fieldName, numericValue);
};

export const handleSimpleNumberChange = <T>(
  fieldName: keyof T,
  value: string,
  setValue: (name: keyof T, value: number) => void
) => {
  const onlyNumbers = value.replace(/\D/g, '');
  const numericValue = onlyNumbers ? parseInt(onlyNumbers, 10) : 0;
  setValue(fieldName, numericValue);
};
