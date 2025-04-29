import React from "react";
import { Metadata } from "next";
import { ConditionForm } from "@/components/custom/condition/condition-form";

export const metadata: Metadata = {
  title: "Añadir Condición | Track your Trade",
  description: "Añade una nueva condición a tu confirmación",
};

interface AddConditionPageProps {
  params: { confirmationId: string };
}

export default async function AddConditionPage({ 
  params 
}: AddConditionPageProps) {
  // En Next.js 15, debemos esperar los parámetros antes de usarlos
  const resolvedParams = await params;
  const confirmationId = parseInt(resolvedParams.confirmationId);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Añadir Condición</h1>
        <p className="text-muted-foreground">
          Añade una nueva condición a tu confirmación para definir cuándo se cumple.
        </p>
        <div className="mt-6">
          <ConditionForm confirmationId={confirmationId} />
        </div>
      </div>
    </div>
  );
} 