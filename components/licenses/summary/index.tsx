import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { License } from '@/utils/schemas/license.schemas'

export const SummaryLicense = ({ licenses } : { licenses: License[] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total de Licenças</div>
          <div className="text-2xl font-bold">{licenses.reduce((sum, l) => sum + l.totalSeats, 0)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Em Uso</div>
          <div className="text-2xl font-bold">{licenses.reduce((sum, l) => sum + (l.users?.length ?? 0), 0)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Taxa de Utilização</div>
          <div className="text-2xl font-bold">
            {Math.round(
              (licenses.reduce((sum, l) => sum + (l.users?.length ?? 0), 0) /
                licenses.reduce((sum, l) => sum + l.totalSeats, 0)) *
                100,
            )}
            %
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Custo Anual Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(licenses.reduce((sum, l) => sum + l.annualCost, 0))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
