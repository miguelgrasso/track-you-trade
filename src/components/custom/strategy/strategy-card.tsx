import { Strategy } from "@/app/interface/strategy.interface";
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
import { useStrategiesStore } from "@/app/stores/strategies-store";

export function StrategyCard({ strategy }: { strategy: Strategy }) {
  const router = useRouter();
  const { deleteStrategy } = useStrategiesStore();

  const handleCardClick = () => {
    router.push(`/strategies/${strategy.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que navegue a la página de detalles
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${strategy.name}"?`)) {
      try {
        await deleteStrategy(strategy.id);
      } catch (error) {
        console.error("Error al eliminar la estrategia:", error);
        alert("Error al eliminar la estrategia. Inténtalo de nuevo.");
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
        title="Eliminar estrategia"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{strategy.name}</CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
        </CardHeader>
      </div>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Estado:</span>
          <Badge variant={strategy.status === "active" ? "default" : "secondary"}>
            {strategy.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Creada:</span>
          <span className="text-sm text-muted-foreground">
            {new Date(strategy.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 