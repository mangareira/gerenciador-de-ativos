import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetTab } from "./assetsTab"
import { Report } from "@/utils/schemas/report.schemas"
import { LicensesTab } from "./licensesTab"
import { FinancialTab } from "./financialTab"
import { TicketsTab } from "./ticketsTab"

export const ReportTable = ({ report } : { report: Report }) => {
  return (
    <Tabs defaultValue="assets" className="space-y-6">
      <TabsList>
        <TabsTrigger value="assets">Ativos</TabsTrigger>
        <TabsTrigger value="licenses">Licenças</TabsTrigger>
        <TabsTrigger value="financial">Financeiro</TabsTrigger>
        <TabsTrigger value="tickets">Chamados</TabsTrigger>
      </TabsList>

      <AssetTab assets={report.assets} departments={report.departments} />
      <LicensesTab licenses={report.licenses} />
      <FinancialTab report={report} />
      <TicketsTab tickets={report.tickets} />
    </Tabs>
  )
}
