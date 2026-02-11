import { Contract } from "@/utils/schemas/contracts.schemas"
import { ContractNotes } from "./contractNotes"
import { ContractProgress } from "./contractProgress"
import { FinancialDetails } from "./financialDetails"
import { RelatedAssets } from "./relatedAssets"

export const MainContentDetail = ({contract} : { contract: Contract }) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <ContractProgress contract={contract} />
      <FinancialDetails contract={contract}/>
      <RelatedAssets contract={contract} />
      {contract.notes && (
        <ContractNotes contract={contract} />
      )}
    </div>
  )
}
