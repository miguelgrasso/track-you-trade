import { Strategy } from "@/app/interface/strategy.interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function StrategyCard({ strategy }: { strategy: Strategy }) {
  return (
    <Card>
      <div className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{strategy.name}</CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
        </CardHeader>
      </div>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Estado:</span>
          <span className="text-sm text-muted-foreground">{strategy.status}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Creada:</span>
          <span className="text-sm text-muted-foreground">
            {new Date(strategy.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <div className="flex gap-2">
        <button className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
        <button className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
        </div>
      </CardFooter>
    </Card>
  );
} 