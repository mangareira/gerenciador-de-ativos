import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Asset } from '@/utils/schemas/assets.schemas'

function SpecificationsAssetCard({ asset }:{ asset: Asset }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Especificações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(asset.specifications ?? {}).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">{key}:</span>
              <span className="font-medium text-right">{String(value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SpecificationsAssetCard