"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateConfirmationData } from "@/app/interface/confirmation.interface";
import { DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ConfirmationFormProps {
  confirmationId?: number;
  isDialog?: boolean;
}

export function ConfirmationForm({ confirmationId, isDialog = false }: ConfirmationFormProps) {
  const router = useRouter();
  const { addConfirmation, updateConfirmation, confirmations } = useConfirmationsStore();
  
  const [formData, setFormData] = useState<CreateConfirmationData>({
    name: "",
    description: "",
    status: "inactive"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (confirmationId) {
      const confirmation = confirmations.find((c) => c.id === confirmationId);
      if (confirmation) {
        setFormData({
          name: confirmation.name,
          description: confirmation.description,
          status: confirmation.status
        });
      }
    }
  }, [confirmationId, confirmations]);

  const handleChange = (field: keyof CreateConfirmationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (confirmationId) {
        await updateConfirmation(confirmationId, formData);
        toast.success("Confirmación actualizada correctamente");
      } else {
        await addConfirmation(formData);
        toast.success("Confirmación creada correctamente");
      }
      
      // Solo redireccionar si no es un diálogo
      if (!isDialog) {
        router.push("/confirmations");
      } else {
        // Reset form if in dialog mode
        setFormData({
          name: "",
          description: "",
          status: "inactive"
        });
      }

    } catch (err) {
      setError((err as Error).message);
      toast.error("Error al guardar la confirmación");
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        {isDialog ? (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mr-2">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : confirmationId ? "Actualizar" : "Crear"}
            </Button>
          </>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : confirmationId ? "Actualizar" : "Crear"}
          </Button>
        )}
      </div>
    </form>
  );
} 