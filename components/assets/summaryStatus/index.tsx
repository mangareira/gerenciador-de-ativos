import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "../../ui/card";
import { Asset } from "@/utils/schemas/assets.schemas";

export default function SummaryStatus({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total de Ativos</div>
          <div className="text-2xl font-bold">{assets.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Valor Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(assets.reduce((sum, a) => sum + a.currentValue, 0))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Taxa de Utilização</div>
          <div className="text-2xl font-bold">
            {Math.round((assets.filter((a) => a.status === "in_use").length / assets.length) * 100)}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Em Manutenção</div>
          <div className="text-2xl font-bold">{assets.filter((a) => a.status === "maintenance").length}</div>
        </CardContent>
      </Card>
    </div>
  )
}
