import { Card, CardContent } from "../../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Laptop, MoreVertical, Network, Package, Printer, Server, Smartphone } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getAssetStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { AssetWithRelations } from "@/utils/schemas/assets.schemas";

const assetIcons = {
  desktop: Package,
  laptop: Laptop,
  server: Server,
  network: Network,
  mobile: Smartphone,
  printer: Printer,
  other: Package,
}

export default function AssetsCard({ asset }: { asset: AssetWithRelations }) {
  const Icon = assetIcons[asset.type];
  return (
    <Card key={asset.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Link href={`/assets/${asset.id}`}>
                <h3 className="font-semibold hover:underline">{asset.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">{asset.model}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/assets/${asset.id}`}>Ver Detalhes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Mover/Alocar</DropdownMenuItem>
              <DropdownMenuItem>Histórico</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Aposentar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-xs">{asset.id}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Serial:</span>
            <span className="font-mono text-xs">{asset.serialNumber}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className={getAssetStatusColor(asset.status)}>
              {getStatusLabel(asset.status)}
            </Badge>
          </div>

          {asset.assignedTo && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usuário:</span>
              <span className="font-medium">{asset.assignedTo.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Departamento:</span>
            <span className="font-medium">{asset.department.name}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Local:</span>
            <span className="truncate ml-2 max-w-[150px]" title={asset.location}>
              {asset.location}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Valor Atual:</span>
            <span className="font-semibold text-primary">{formatCurrency(asset.currentValue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
