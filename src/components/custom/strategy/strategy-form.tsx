"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useStrategiesStore} from "@/app/stores/strategies-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Strategy } from "@/app/interface/strategy.interface";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
});

interface StrategyFormProps {
  strategy?: Strategy;
  onSuccess?: () => void;
}

export function StrategyForm({ strategy, onSuccess }: StrategyFormProps) {
  const router = useRouter();
  const { addStrategy, updateStrategy } = useStrategiesStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: strategy?.name || "",
      description: strategy?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (strategy) {
        await updateStrategy(strategy.id, values);
        toast.success("Estrategia actualizada correctamente");
      } else {
        await addStrategy(values);
        toast.success("Estrategia creada correctamente");
      }
      onSuccess?.();
      router.push("/strategies");
    } catch (error) {
      toast.error("Error al guardar la estrategia");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la estrategia" {...field} />
              </FormControl>
              <FormDescription>
                Este es el nombre que identificará tu estrategia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu estrategia de trading"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explica los detalles y la lógica de tu estrategia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {strategy ? "Actualizar Estrategia" : "Crear Estrategia"}
        </Button>
      </form>
    </Form>
  );
} 