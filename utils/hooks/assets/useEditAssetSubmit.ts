import { useEditAsset } from "@/utils/hooks/assets/useEditAsset";
import { useCreateMovementHistory } from "@/utils/hooks/movementHistory/useCreateMovementHistory";
import { Asset, UpdateAsset } from "@/utils/schemas/assets.schemas";
import { CreateAssetMovement } from "@/utils/schemas/assetsMovementHistory.schemas";

interface UseEditAssetSubmitProps {
  asset: Asset;
  departmentOptions: { value: string; label: string }[];
  assignedOptions?: { value: string; label: string }[];
  onSuccess?: () => void;
}

export function useEditAssetSubmit({
  asset,
  departmentOptions,
  assignedOptions,
  onSuccess,
}: UseEditAssetSubmitProps) {
  const { mutate: editAsset } = useEditAsset(asset.id);
  const { mutate: createMovement } = useCreateMovementHistory();

  const handleSubmit = async (data: UpdateAsset, setLoading?: (loading: boolean) => void, notes?: string, movementDate?: Date) => {
    if (setLoading) setLoading(true);

    return new Promise<void>((resolve, reject) => {
      editAsset(data, {
        onSuccess: (res) => {
          if ('update' in res) {
            const updatedAsset = res.update;
            try {
              const movements: CreateAssetMovement[] = [];
              const statusLabels: Record<string, string> = {
                available: 'Disponível',
                in_use: 'Em Uso',
                maintenance: 'Manutenção',
                retired: 'Aposentado',
                lost: 'Perdido',
              };

              // Departamento alterado
              if (data.departmentId && data.departmentId !== asset.departmentId) {
                const fromDept = departmentOptions.find(d => d.value === asset.departmentId)?.label ?? asset.departmentId;
                const toDept = departmentOptions.find(d => d.value === data.departmentId)?.label ?? data.departmentId;
                movements.push({
                  assetId: updatedAsset.id,
                  type: "transfer",
                  fromUserId: null,
                  toUserId: null,
                  fromLocation: `Departamento: ${fromDept}`,
                  toLocation: `Departamento: ${toDept}`,
                  movementDate:  movementDate ||new Date(),
                  reason: `Transferência de departamento: ${fromDept} → ${toDept}`,
                  authorizedBy: "Sistema",
                  notes: notes || null,
                });
              }

              // Assigned alterado (responsável)
              if ("assignedToId" in data && data.assignedToId !== asset.assignedToId) {
                const fromUser = assignedOptions?.find(u => u.value === asset.assignedToId)?.label || asset.assignedToId || "Sem responsável";
                const toUser = assignedOptions?.find(u => u.value === data.assignedToId)?.label || data.assignedToId || "Sem responsável";
                movements.push({
                  assetId: updatedAsset.id,
                  type: "transfer",
                  fromUserId: asset.assignedToId ?? null,
                  toUserId: data.assignedToId ?? null,
                  fromLocation: `Responsável: ${fromUser}`,
                  toLocation: `Responsável: ${toUser}`,
                  movementDate: movementDate ||new Date(),
                  reason: `Transferência de responsável: ${fromUser} → ${toUser}`,
                  authorizedBy: "Sistema",
                  notes:  notes || null,
                });
              }
              // Localização alterada
              if (data.location && data.location !== asset.location) {
                movements.push({
                  assetId: updatedAsset.id,
                  type: "transfer",
                  fromUserId: null,
                  toUserId: null,
                  fromLocation: asset.location ?? "",
                  toLocation: data.location,
                  movementDate: movementDate ||new Date(),
                  reason: `Mudança de localização: ${asset.location ?? "desconhecido"} → ${data.location}`,
                  authorizedBy: "Sistema",
                  notes:  notes || null,
                });
              }

              // Status alterado
              if (data.status && data.status !== asset.status) {
                if (data.status === "maintenance") {
                  movements.push({
                    assetId: updatedAsset.id,
                    type: "maintenance",
                    fromUserId: null,
                    toUserId: null,
                    fromLocation: asset.location ?? "",
                    toLocation: asset.location ?? "",
                    movementDate: new Date(),
                    reason: `Enviado para ${statusLabels[data.status] ?? data.status}`,
                    authorizedBy: "Sistema",
                    notes: null,
                  });
                } else {
                  const fromLabel = statusLabels[asset.status] ?? asset.status;
                  const toLabel = statusLabels[data.status] ?? data.status;
                  movements.push({
                    assetId: updatedAsset.id,
                    type: "transfer",
                    fromUserId: null,
                    toUserId: null,
                    fromLocation: asset.location ?? "",
                    toLocation: asset.location ?? "",
                    movementDate: new Date(),
                    reason: `Transferência de status: ${fromLabel} → ${toLabel}`,
                    authorizedBy: "Sistema",
                    notes: null,
                  });
                }
              }

              // Se houver mudanças relevantes, enviar os movimentos
              if (movements.length > 0) {
                movements.forEach((m) => {
                  try {
                    createMovement(m);
                  } catch (error) {
                    console.error("Erro ao criar movement", error);
                  }
                });
              }
            } catch (error) {
              console.error("Erro ao montar movimentos", error);
            }
          }
          
          if (onSuccess) onSuccess();
          resolve();
        },
        onError: (error) => {
          console.error("Erro ao atualizar ativo", error);
          reject(error);
        },
      });
    });
  };

  return { handleSubmit };
}