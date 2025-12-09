import { CreateAssetMovement } from "@/utils/schemas/assetsMovementHistory.schemas";
import { Asset, UpdateAsset } from "@/utils/schemas/assets.schemas";

export interface DepartmentOption {
  value: string;
  label: string;
}

// Mapeamento de status (inglês -> português)
const statusLabels: Record<string, string> = {
  available: 'Disponível',
  in_use: 'Em Uso',
  maintenance: 'Manutenção',
  retired: 'Aposentado',
  lost: 'Perdido',
};

export function generateAssetMovements(
  updatedAsset: Asset,
  originalAsset: Asset,
  data: UpdateAsset,
  departmentOptions: DepartmentOption[]
): CreateAssetMovement[] {
  const movements: CreateAssetMovement[] = [];

  // Departamento alterado
  if (data.departmentId && data.departmentId !== originalAsset.departmentId) {
    const fromDept = departmentOptions.find(d => d.value === originalAsset.departmentId)?.label ?? originalAsset.departmentId;
    const toDept = departmentOptions.find(d => d.value === data.departmentId)?.label ?? data.departmentId;
    movements.push({
      assetId: updatedAsset.id,
      type: "transfer",
      fromUserId: null,
      toUserId: null,
      fromLocation: `Departamento: ${fromDept}`,
      toLocation: `Departamento: ${toDept}`,
      movementDate: new Date(),
      reason: `Transferência de departamento: ${fromDept} → ${toDept}`,
      authorizedBy: "Sistema",
      notes: null,
    });
  }

  // Localização alterada
  if (data.location && data.location !== originalAsset.location) {
    movements.push({
      assetId: updatedAsset.id,
      type: "transfer",
      fromUserId: null,
      toUserId: null,
      fromLocation: originalAsset.location ?? "",
      toLocation: data.location,
      movementDate: new Date(),
      reason: `Mudança de localização: ${originalAsset.location ?? "desconhecido"} → ${data.location}`,
      authorizedBy: "Sistema",
      notes: null,
    });
  }

  // Status alterado
  if (data.status && data.status !== originalAsset.status) {
    if (data.status === "maintenance") {
      movements.push({
        assetId: updatedAsset.id,
        type: "maintenance",
        fromUserId: null,
        toUserId: null,
        fromLocation: originalAsset.location ?? "",
        toLocation: originalAsset.location ?? "",
        movementDate: new Date(),
        reason: `Enviado para ${statusLabels[data.status] ?? data.status}`,
        authorizedBy: "Sistema",
        notes: null,
      });
    } else {
      const fromLabel = statusLabels[originalAsset.status] ?? originalAsset.status;
      const toLabel = statusLabels[data.status] ?? data.status;
      movements.push({
        assetId: updatedAsset.id,
        type: "transfer",
        fromUserId: null,
        toUserId: null,
        fromLocation: originalAsset.location ?? "",
        toLocation: originalAsset.location ?? "",
        movementDate: new Date(),
        reason: `Transferência de status: ${fromLabel} → ${toLabel}`,
        authorizedBy: "Sistema",
        notes: null,
      });
    }
  }

  return movements;
}