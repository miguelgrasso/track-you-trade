import { Metadata } from "next";
import { ConfirmationDetail } from "@/components/custom/confirmation/confirmation-detail";

export const metadata: Metadata = {
  title: "Detalles de Confirmación | Track your Trade",
  description: "Ver detalles de una confirmación y sus condiciones",
};

interface ConfirmationDetailPageProps {
  params: { confirmationId: string };
}

export default async function ConfirmationDetailPage({ 
  params 
}: ConfirmationDetailPageProps) {
  // En Next.js 15, debemos esperar los parámetros antes de usarlos
  const resolvedParams = await params;
  const confirmationId = parseInt(resolvedParams.confirmationId);

  return (
    <div className="flex flex-col min-h-screen">
      <ConfirmationDetail confirmationId={confirmationId} />
    </div>
  );
}