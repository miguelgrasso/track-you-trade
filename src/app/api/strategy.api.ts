import { CreateStrategyData } from "../interface/strategy.interface";
import { BACKEND_URL } from "../util/constantes";


export async function getStrategies() {
    const res = await fetch(`${BACKEND_URL}/strategies`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch strategies");
    }
    return res.json();
  }
  
  export async function createStrategy(strategy: CreateStrategyData) {
    const res = await fetch(`${BACKEND_URL}/strategies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(strategy),
    });
    if (!res.ok) {
      throw new Error("Failed to create strategy");
    }
    return res.json();
  }
  
  export async function updateStrategy(id: number, strategy: CreateStrategyData) {
    const res = await fetch(`${BACKEND_URL}/strategies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(strategy),
    });
    if (!res.ok) {
      throw new Error("Failed to update strategy");
    }
    return res.json();
  }
  
  export async function deleteStrategy(id: number) {
    const res = await fetch(`${BACKEND_URL}/strategies/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete strategy");
    }
    return res.json();
  }