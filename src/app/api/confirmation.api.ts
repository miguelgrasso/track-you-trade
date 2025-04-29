import { CreateConfirmationData } from "../interface/confirmation.interface";
import { BACKEND_URL } from "../util/constantes";

// API para Confirmaciones
export async function getConfirmations() {
  try {
    console.log("Fetching all confirmations");
    const res = await fetch(`${BACKEND_URL}/confirmations`, { cache: "no-store" });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching confirmations: ${res.status} - ${errorText}`);
      throw new Error(`Failed to fetch confirmations: ${res.status} - ${errorText}`);
    }
    
    // Intentar parsear la respuesta como JSON
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error(`Error parsing JSON response: ${parseError}`);
      throw new Error(`Failed to parse confirmations data: ${parseError}`);
    }
    
    // Verificar si data es un array
    if (!Array.isArray(data)) {
      console.error(`Response is not an array: ${JSON.stringify(data)}`);
      return []; // Devolver un array vacío en lugar de lanzar un error
    }
    
    console.log(`Successfully fetched ${data.length} confirmations`);
    return data;
  } catch (error) {
    console.error("Error in getConfirmations:", error);
    throw error;
  }
}

export async function createConfirmation(confirmation: CreateConfirmationData) {
  const res = await fetch(`${BACKEND_URL}/confirmations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(confirmation),
  });
  if (!res.ok) {
    throw new Error("Failed to create confirmation");
  }
  return res.json();
}

export async function updateConfirmation(id: number, confirmation: CreateConfirmationData) {
  const res = await fetch(`${BACKEND_URL}/confirmations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(confirmation),
  });
  if (!res.ok) {
    throw new Error("Failed to update confirmation");
  }
  return res.json();
}

export async function deleteConfirmation(id: number) {
  const res = await fetch(`${BACKEND_URL}/confirmations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete confirmation");
  }
  return res.json();
} 