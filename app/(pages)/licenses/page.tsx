'use client'
import CreateLicenseModal from "@/components/licenses/createLicenseModal";
import SearchTool from "@/components/search"
import { statusOptions, typeOptions } from "@/utils/constants/licenses-options-search";
import { useGetDepartments } from "@/utils/hooks/department/useGetDepartments";
import { useState } from "react";

export default function LicensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: departments } = useGetDepartments();
  
  const departmentOptions = (departments ?? []).map((department) => ({
    label: department.name,
    value: department.id,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenças de Software</h1>
          <p className="text-muted-foreground">Gerencie licenças e subscrições</p>
        </div>
        <CreateLicenseModal departamentsOptions={departmentOptions}/>
      </div>
      <SearchTool 
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        titlePlaceholder="Buscar por software, fornecedor ou chave..."
      />

      {/* <div className="grid gap-4">
        {filteredLicenses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileKey className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-medium text-lg mb-1">Nenhuma licença encontrada</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Tente ajustar sua busca" : "Adicione uma nova licença para começar"}
              </p>
            </CardContent>
          </Card>
        ) : null}
        {filteredLicenses.map((license) => {
          const department = mockDepartments.find((d) => d.id === license.departmentId)
          const utilizationPercent = Math.round((license.usedSeats / license.totalSeats) * 100)
          const isExpiring = license.expiryDate && isExpiringSoon(license.expiryDate, 60)
          const daysUntilExpiry = license.expiryDate ? getDaysUntil(license.expiryDate) : null

          return (
            <Card key={license.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <FileKey className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{license.softwareName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{license.vendor}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={getLicenseStatusColor(license.status)}>
                      {getStatusLabel(license.status)}
                    </Badge>
                    {isExpiring && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Expira em {daysUntilExpiry} dias
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Utilização
                      </span>
                      <span className="font-medium">{utilizationPercent}%</span>
                    </div>
                    <Progress value={utilizationPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {license.usedSeats} de {license.totalSeats} licenças em uso
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Datas</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Compra: </span>
                        <span>{formatDate(license.purchaseDate)}</span>
                      </div>
                      {license.expiryDate && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Expira: </span>
                          <span className={isExpiring ? "font-semibold text-yellow-600" : ""}>
                            {formatDate(license.expiryDate)}
                          </span>
                        </div>
                      )}
                      {license.renewalDate && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Renovação: </span>
                          <span>{formatDate(license.renewalDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Tipo: </span>
                        <Badge variant="outline" className="text-xs">
                          {license.licenseType === "subscription" && "Assinatura"}
                          {license.licenseType === "perpetual" && "Perpétua"}
                          {license.licenseType === "concurrent" && "Concorrente"}
                          {license.licenseType === "named-user" && "Por Usuário"}
                        </Badge>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Departamento: </span>
                        <span className="font-medium">{department?.name}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Centro de Custo: </span>
                        <span className="font-mono">{department?.costCenter}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Custo</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Anual: </span>
                        <span className="font-semibold text-primary">{formatCurrency(license.annualCost)}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Por Licença: </span>
                        <span>{formatCurrency(license.annualCost / license.totalSeats)}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Mensal: </span>
                        <span>{formatCurrency(license.annualCost / 12)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {license.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{license.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <LicenseDetailsModal license={license} department={department} />
                  <ManageAllocationsModal license={license} users={mockUsers} />
                  {license.licenseType === "subscription" && (
                    <RenewLicenseModal license={license} />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div> */}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total de Licenças</div>
            <div className="text-2xl font-bold">{mockLicenses.reduce((sum, l) => sum + l.totalSeats, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Em Uso</div>
            <div className="text-2xl font-bold">{mockLicenses.reduce((sum, l) => sum + l.usedSeats, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Taxa de Utilização</div>
            <div className="text-2xl font-bold">
              {Math.round(
                (mockLicenses.reduce((sum, l) => sum + l.usedSeats, 0) /
                  mockLicenses.reduce((sum, l) => sum + l.totalSeats, 0)) *
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
              {formatCurrency(mockLicenses.reduce((sum, l) => sum + l.annualCost, 0))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
