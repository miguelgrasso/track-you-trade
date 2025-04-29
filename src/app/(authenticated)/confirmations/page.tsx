import { Metadata } from "next";
import { ConfirmationClient } from "@/components/custom/confirmation/confirmation-client";

export const metadata: Metadata = {
  title: "Confirmaciones | Track your Trade",
  description: "Gestiona tus confirmaciones de trading",
};

export default function ConfirmationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ConfirmationClient />
    </div>
  );
}
