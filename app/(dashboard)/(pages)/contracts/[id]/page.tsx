'use client'

import { MainContentDetail } from "@/components/contracts/contractDetails/mainContenteDetails";
import { ManageContractAssetsModal } from "@/components/contracts/contractDetails/manageContractAssetsModal";
import { SideBarDetails } from "@/components/contracts/contractDetails/sideBarDetails";
import { SummaryCardDetails } from "@/components/contracts/contractDetails/summaryCardDetails";
import { EditContractModal } from "@/components/contracts/editContractModal";
import { RenewContractModal } from "@/components/contracts/renewContractModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContractDetails, getContractStatusColor, getStatusLabel} from "@/lib/utils";
import useGetContract from "@/utils/hooks/contracts/useGetContract";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailsContract() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: contract } = useGetContract(id)

  if(!contract) return null

  const { isExpiring, daysUntilEnd } = getContractDetails(contract)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-balance">{contract.title}</h1>
              <Badge variant="outline" className={getContractStatusColor(contract.status)}>
                {getStatusLabel(contract.status)}
              </Badge>
              {isExpiring && daysUntilEnd >= 0 && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Vence em {daysUntilEnd} dias
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-1">{contract.contractNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ManageContractAssetsModal
            contract={contract}
          />
          <RenewContractModal contract={contract} />
          <EditContractModal contract={contract} />
        </div>
      </div>

      <SummaryCardDetails contract={contract} />

      <div className="grid gap-6 md:grid-cols-3">
        <MainContentDetail contract={contract} />
        <SideBarDetails contract={contract} />
      </div>
    </div>
  )
}
