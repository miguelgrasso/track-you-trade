"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConditionsStore } from "@/app/stores/conditions-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateConditionData } from "@/app/interface/condition.interface";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ConditionFormProps {
  conditionId?: number;
  confirmationId: number | 0;
  isDialog?: boolean;
}

export function ConditionForm({ conditionId, confirmationId, isDialog = false }: ConditionFormProps) {
  console.log("confirmationId", confirmationId);
  console.log("confirmationId type:", typeof confirmationId);
  const router = useRouter();
  const { addCondition, updateCondition, conditions, getCondition } = useConditionsStore();
  const { refreshConfirmations } = useConfirmationsStore();
  
  const [formData, setFormData] = useState<CreateConditionData>({
    name: "",
    description: "",
    status: "inactive",
    confirmationId: confirmationId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCondition = async () => {
      if (conditionId) {
        try {
          // Primero intentar obtener la condición del estado local
          const localCondition = conditions.find(c => c.id === conditionId);
          
          if (localCondition) {
            setFormData({
              name: localCondition.name,
              description: localCondition.description,
              status: localCondition.status || "inactive",
              confirmationId: localCondition.confirmationId
            });
          } else {
            // Si no está en el estado local, obtenerla de la API
            const condition = await getCondition(conditionId);
            setFormData({
              name: condition.name,
              description: condition.description,
              status: condition.status || "inactive",
              confirmationId: condition.confirmationId
            });
          }
        } catch (err) {
          setError("Error al cargar la condición");
          console.error(err);
        }
      }
    };

    loadCondition();
  }, [conditionId, getCondition, conditions]);

  const handleChange = (field: keyof CreateConditionData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Enviando formulario con datos:", formData);

    // Validar que confirmationId sea un número
    if (!formData.confirmationId || isNaN(Number(formData.confirmationId))) {
      setError(`ID de confirmación inválido: ${formData.confirmationId}`);
      setIsSubmitting(false);
      return;
    }

    try {
      if (conditionId) {
        await updateCondition(conditionId, formData);
        toast.success("Condición actualizada correctamente");
      } else {
        const result = await addCondition(formData);
        console.log("Condición creada:", result);
        toast.success("Condición creada correctamente");
      }

      // Refrescar las confirmaciones para actualizar el contador de condiciones
      await refreshConfirmations();
      
      // Refrescar las condiciones para la confirmación actual
      if (formData.confirmationId) {
        const { refreshConditionsByConfirmation } = useConditionsStore.getState();
        await refreshConditionsByConfirmation(formData.confirmationId);
        console.log(`Condiciones refrescadas para confirmación ${formData.confirmationId}`);
      }

      if (isDialog) {
        setFormData({
          name: "",
          description: "",
          status: "inactive",
          confirmationId: confirmationId
        });
      } else {
        // Redirigir a la página de confirmación
        router.push(`/confirmations/${confirmationId}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      console.error("Error al guardar la condición:", err);
      setError(`Error al guardar la condición: ${errorMessage}`);
      toast.error("Error al guardar la condición");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          autoFocus={false}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descripción
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status === "active"}
          onCheckedChange={handleStatusChange}
        />
        <Label htmlFor="status">Activa</Label>
      </div>

      {/* Campo oculto para confirmationId */}
      <input 
        type="hidden" 
        id="confirmationId" 
        name="confirmationId" 
        value={formData.confirmationId} 
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        {isDialog ? (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mr-2">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : conditionId ? "Actualizar" : "Crear"}
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2" 
              onClick={() => router.push(`/confirmations/${confirmationId}`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : conditionId ? "Actualizar" : "Crear"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
} 