import { Contract } from "@/utils/schemas/contracts.schemas"
import { ContractInfo } from "./conrtactInfo"
import { ContactCard } from "./contactCard"
import { DatesCard } from "./datesCard"

export const SideBarDetails = ({ contract } : { contract: Contract }) => {
  return (
    <div className="space-y-6">
      <ContractInfo contract={contract} />
      <ContactCard contract={contract} />
      <DatesCard contract={contract} />
    </div>
  )
}
