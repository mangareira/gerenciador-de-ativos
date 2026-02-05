import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LicenseOverviewTab } from './licenseOverviewTab'
import { License } from '@/utils/schemas/license.schemas'
import { LicenseFinancialTab } from './licenseFinancialTab'

export const LicenseTabs = ({ license } : {license: License}) => {
  return (
    <Tabs defaultValue="overview" className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="financial">Financeiro</TabsTrigger>
      </TabsList>

      <LicenseOverviewTab license={license} />

      <LicenseFinancialTab license={license} />
    </Tabs>
  )
}
