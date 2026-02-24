'use client'
import { AssetDistributionChart } from "@/components/dashboard/assetDistributionChart";
import { MetricCard } from "@/components/dashboard/metricsCard";
import { TicketStatusChart } from "@/components/dashboard/ticketStatusChart";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { useGetAssets } from "@/utils/hooks/assets/useGetAssets";
import { useGetAllLicenses } from "@/utils/hooks/licenses/useGetAllLicenses";
import { useGetAllTickets } from "@/utils/hooks/tickets/useGetAllTickets";
import { useGetAllContracts } from "@/utils/hooks/contracts/useGetAllContracts";
import { computeDashboardMetrics } from "@/lib/utils";
import { addDays, isWithinInterval, startOfDay } from "date-fns";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, DollarSign, FileKey, FileText, Package, Ticket, TrendingUp } from "lucide-react";
import { RecentTickets } from "@/components/dashboard/recentTickets";
import { ExpiringItems } from "@/components/dashboard/expiredItems";

export default function Home() {
  const { data: assets } = useGetAssets()
  const { data: licenses } = useGetAllLicenses()
  const { data: tickets } = useGetAllTickets()
  const { data: contracts } = useGetAllContracts()

  if(!assets || !licenses || !tickets || !contracts) return null

  const metrics = computeDashboardMetrics({ assets, licenses, contracts, tickets })

  const assetsInUse = assets.filter((a) => a.status === "in_use").length
  const assetsAvailable = assets.filter((a) => a.status === "available").length
  const assetsInMaintenance = assets.filter((a) => a.status === "maintenance").length

  const openTickets = tickets.filter((a) => a.status === "open").length
  const criticalTickets = tickets.filter((a) => a.priority === "critical").length

  const today = startOfDay(new Date())
  const sixtyDaysFromNow = addDays(today, 60)

  const expiringLicenses = licenses.filter(license => {
    if (!license.expiryDate) return false
    const expiry = startOfDay(new Date(license.expiryDate))
    return isWithinInterval(expiry, { start: today, end: sixtyDaysFromNow })
  }).length


  return (
     <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos ativos e serviços de TI</p>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Ativos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total de Ativos" value={assets.length} icon={Package} variant="default" />
          <MetricCard
            title="Em Uso"
            value={assetsInUse}
            subtitle={`${Math.round((assetsInUse / assets.length) * 100)}% utilização`}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard title="Disponíveis" value={assetsAvailable} icon={Clock} variant="default" />
          <MetricCard
            title="Em Manutenção"
            value={assetsInMaintenance}
            icon={AlertTriangle}
            variant={assetsInMaintenance > 0 ? "warning" : "default"}
          />
        </div>
      </div>

      {/* License & Ticket Metrics */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Licenças e Chamados</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Licenças"
            value={licenses.length}
            subtitle={`${Math.round(
              (licenses.reduce((sum, l) => sum + (l.users?.length ?? 0), 0) /
                licenses.reduce((sum, l) => sum + l.totalSeats, 0)) *
                100,
            )}% em uso`}
            icon={FileKey}
            variant="default"
          />
          <MetricCard
            title="Licenças Expirando"
            value={expiringLicenses}
            subtitle="Próximos 60 dias"
            icon={AlertCircle}
            variant={expiringLicenses > 0 ? "warning" : "success"}
          />
          <MetricCard
            title="Chamados Abertos"
            value={openTickets}
            icon={Ticket}
            variant={openTickets > 5 ? "warning" : "default"}
          />
          <MetricCard
            title="Chamados Críticos"
            value={criticalTickets}
            icon={AlertTriangle}
            variant={criticalTickets > 0 ? "danger" : "success"}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetDistributionChart assets={assets} />
        <TicketStatusChart tickets={tickets} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Financeiro e Contratos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Gasto Total"
            value={formatCompactCurrency(metrics.totalSpend)}
            subtitle="Ativos + Licenças + Contratos"
            icon={DollarSign}
            variant="default"
          />
          <MetricCard
            title="Custo Mensal"
            value={formatCurrency(metrics.monthlySpend)}
            subtitle="Licenças e contratos recorrentes"
            icon={TrendingUp}
            variant="default"
          />
          <MetricCard
            title="Contratos Expirando"
            value={metrics.contractsExpiringSoon}
            subtitle="Próximos 90 dias"
            icon={FileText}
            variant={metrics.contractsExpiringSoon > 0 ? "warning" : "success"}
          />
          <MetricCard
            title="Tempo Médio de Resolução"
            value={`${metrics.averageResolutionTime}h`}
            subtitle="Chamados resolvidos"
            icon={Clock}
            variant="default"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentTickets tickets={tickets} />
        <ExpiringItems contracts={contracts} licenses={licenses}  />
      </div>
    </div>
  );
}
