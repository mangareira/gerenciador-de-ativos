'use client'

import { ReportTable } from "@/components/reports/reportTable";
import { ReportTableSkeleton } from "@/components/reports/reportTable/ReportTableSkeleton";
import { SummaryCard } from "@/components/reports/summaryCard";
import SummaryCardSkeleton from "@/components/reports/summaryCard/SummaryCardSkeleton";
import { Button } from "@/components/ui/button";
import useGetReports from "@/utils/hooks/reports/useGetReports";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const { data: report, isLoading } = useGetReports() 

  return (
     <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Análise detalhada de ativos, custos e performance</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatórios
        </Button>
      </div>

      {
        isLoading && !report ? 
        (
          <SummaryCardSkeleton />
        ) : report ? 
        (
          <SummaryCard 
            report={report}
          />
        ) : null
      }

      {
        !report && (
          <ReportTableSkeleton />
        )
      }

      {report && (
        <ReportTable 
          report={report}
        />
      )}
    </div>
  )
}
