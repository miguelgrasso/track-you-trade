import { Confirmation } from "@/app/interface/confirmation.interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";

export function ConfirmationCard({ confirmation }: { confirmation: Confirmation }) {
  const router = useRouter();
  const { deleteConfirmation } = useConfirmationsStore();

  const handleCardClick = () => {
    router.push(`/confirmations/${confirmation.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que navegue a la página de detalles
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${confirmation.name}" y todas sus condiciones asociadas?`)) {
      try {
        await deleteConfirmation(confirmation.id);
      } catch (error) {
        console.error("Error al eliminar la confirmación:", error);
        alert("Error al eliminar la confirmación. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow relative" 
      onClick={handleCardClick}
    >
      {/* Botón de eliminar (X) */}
      <button
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-red-100 transition-colors text-gray-500 hover:text-red-600 z-10"
        onClick={handleDelete}
        title="Eliminar confirmación"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col h-full">
        <CardHeader>
          <div className="flex flex-col">
            <CardTitle>{confirmation.name}</CardTitle>
            <CardDescription>{confirmation.description}</CardDescription>
          </div>
        </CardHeader>
      </div>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Estado:</span>
          <Badge variant={confirmation.status === "active" ? "outline" : "secondary"}>
              {confirmation.status}
            </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Creada:</span>
          <span className="text-sm text-muted-foreground">
            {new Date(confirmation.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Condiciones:</span>
          <span className="text-sm text-muted-foreground">
            {confirmation.conditions?.length || 0}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 