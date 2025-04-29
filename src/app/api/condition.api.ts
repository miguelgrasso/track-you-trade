import { CreateConditionData } from "../interface/condition.interface";
import { BACKEND_URL } from "../util/constantes";

// API para Condiciones
export async function getConditionsByConfirmation(confirmationId: number) {
  try {
    console.log(`Fetching conditions for confirmation ${confirmationId}`);
    const res = await fetch(`${BACKEND_URL}/confirmations/${confirmationId}/conditions`, { cache: "no-store" });
    
    // Verificar si la respuesta es exitosa
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching conditions: ${res.status} - ${errorText}`);
      throw new Error(`Failed to fetch conditions for confirmation: ${res.status} - ${errorText}`);
    }
    
    // Intentar parsear la respuesta como JSON
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error(`Error parsing JSON response: ${parseError}`);
      throw new Error(`Failed to parse conditions data: ${parseError}`);
    }
    
    // Verificar si data es un array
    if (!Array.isArray(data)) {
      console.error(`Response is not an array: ${JSON.stringify(data)}`);
      return []; // Devolver un array vacío en lugar de lanzar un error
    }
    
    console.log(`Successfully fetched ${data.length} conditions`);
    return data;
  } catch (error) {
    console.error("Error in getConditionsByConfirmation:", error);
    throw error;
  }
}

export async function getCondition(id: number) {
  try {
    console.log(`Fetching condition ${id}`);
    const res = await fetch(`${BACKEND_URL}/conditions/${id}`, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching condition: ${res.status} - ${errorText}`);
      throw new Error(`Failed to fetch condition: ${res.status} - ${errorText}`);
    }
    const data = await res.json();
    console.log("Successfully fetched condition:", data);
    return data;
  } catch (error) {
    console.error("Error in getCondition:", error);
    throw error;
  }
}

export async function createCondition(condition: CreateConditionData) {
  try {
    console.log("Creating condition with data:", JSON.stringify(condition, null, 2));
    
    // Verificar datos antes de enviarlos
    if (!condition.confirmationId) {
      console.error("Missing confirmationId in condition data");
      throw new Error("Missing confirmationId in condition data");
    }
    
    const res = await fetch(`${BACKEND_URL}/condition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(condition),
    });
    
    if (!res.ok) {
      // Intentar obtener detalles del error
      let errorMessage = "";
      try {
        const errorData = await res.json();
        errorMessage = JSON.stringify(errorData);
      } catch (e) {
        const errorText = await res.text();
        errorMessage = errorText || `Status: ${res.status}`;
      }
      
      console.error(`Error creating condition: ${res.status} - ${errorMessage}`);
      throw new Error(`Failed to create condition: ${res.status} - ${errorMessage}`);
    }
    
    const data = await res.json();
    console.log("Successfully created condition:", data);
    return data;
  } catch (error) {
    console.error("Error in createCondition:", error);
    throw error;
  }
}

export async function updateCondition(id: number, condition: CreateConditionData) {
  try {
    console.log(`Updating condition ${id} with data:`, JSON.stringify(condition, null, 2));
    const res = await fetch(`${BACKEND_URL}/condition/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(condition),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error updating condition: ${res.status} - ${errorText}`);
      throw new Error(`Failed to update condition: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log("Successfully updated condition:", data);
    return data;
  } catch (error) {
    console.error("Error in updateCondition:", error);
    throw error;
  }
}

export async function deleteCondition(id: number) {
  try {
    console.log(`Deleting condition ${id}`);
    const res = await fetch(`${BACKEND_URL}/condition/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error deleting condition: ${res.status} - ${errorText}`);
      throw new Error(`Failed to delete condition: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log("Successfully deleted condition");
    return data;
  } catch (error) {
    console.error("Error in deleteCondition:", error);
    throw error;
  }
} 