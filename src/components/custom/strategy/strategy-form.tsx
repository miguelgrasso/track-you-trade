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
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  status: z.string().optional(),
});

interface StrategyFormProps {
  strategyId?: number; 
  isDialog?: boolean;
  onSuccess?: () => void;
}

export function StrategyForm({ strategyId, isDialog = false, onSuccess }: StrategyFormProps) {
  const router = useRouter();
  const { strategies, addStrategy, updateStrategy } = useStrategiesStore();

  const strategy = strategyId 
    ? strategies.find(s => s.id === strategyId) 
    : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "inactive",
    },
  });

  useEffect(() => {
    if (strategy) {
      form.reset({
        name: strategy.name,
        description: strategy.description,
        status: strategy.status
      });
    }
  }, [strategy, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (strategyId) {
        await updateStrategy(strategyId, values);
        toast.success("Estrategia actualizada correctamente");
      } else {
        await addStrategy(values);
        toast.success("Estrategia creada correctamente");
      }
      
      if (!isDialog) {
        router.push("/strategies");
      } else {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.error("Error al guardar la estrategia");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Activar Estrategia
                </FormLabel>
                <FormDescription>
                  Activa o desactiva esta estrategia en tu sistema.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "active"}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? "active" : "inactive");
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {isDialog ? (
            <>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="mr-2">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {strategyId ? "Actualizar" : "Crear"}
              </Button>
            </>
          ) : (
            <Button type="submit">
              {strategyId ? "Actualizar Estrategia" : "Crear Estrategia"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
} 