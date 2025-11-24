'use client'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useGetAsset } from "@/utils/hooks/assets/useGetAsset"
import { useParams } from "next/navigation"
import { EditAssetModal } from "@/components/assets/editAssetModal"
import { useGetDepartments } from "@/utils/hooks/department/useGetDepartments"
import InfoAssetCard from "@/components/assets/infoAssetCard"
import SpecificationsAssetCard from "@/components/assets/specificationsAssetCard"
import QuickActionsCard from "@/components/assets/quickActionsCard"
import MovementHistoryCard from "@/components/assets/movementHistoryCard"

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data: asset } = useGetAsset(id)
  const { data: departments } = useGetDepartments();
  

  if(!asset) return null;

  const departmentOptions = (departments ?? []).map((department) => ({
    label: department.name,
    value: department.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/assets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
            <p className="text-muted-foreground">
              {asset.manufacturer} {asset.model}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <EditAssetModal 
            asset={asset} 
            departmentOptions={departmentOptions}
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <InfoAssetCard asset={asset} />
        <div className="space-y-6">
          <SpecificationsAssetCard asset={asset} />
          <QuickActionsCard />
        </div>
      </div>
      <MovementHistoryCard  asset={asset} />
    </div>
  )
}
