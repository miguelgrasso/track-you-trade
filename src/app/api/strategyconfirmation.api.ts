import { BACKEND_URL } from "../util/constantes";

export async function getConfirmationsByStrategy(strategyId: number) {
    console.log("url strategy", `${BACKEND_URL}/strategy-confirmation/strategy/${strategyId}/confirmations`);
    const res = await fetch(`${BACKEND_URL}/strategy-confirmation/strategy/${strategyId}/confirmations`, { cache: "no-store" });
    console.log("desde api ts Fetching confirmations for strategy:", res);
    if (!res.ok) {
      console.log("Error fetching confirmations for strategy:", res);
      throw new Error(`Failed to fetch confirmations for strategy: ${res.statusText}`);
    }
    return res.json();
}

export async function associateConfirmationToStrategy(strategyId: number, confirmationId: number) {
  console.log(`Associating confirmation ${confirmationId} to strategy ${strategyId}`);
  const res = await fetch(`${BACKEND_URL}/strategy-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      strategyId,
      confirmationId
    }),
  });

  if (!res.ok) {
    console.error("Error associating confirmation to strategy:", res);
    throw new Error(`Failed to associate confirmation to strategy: ${res.statusText}`);
  }

  return res.json();
}

export async function removeConfirmationFromStrategy(strategyId: number, confirmationId: number) {
  console.log(`Removing confirmation ${confirmationId} from strategy ${strategyId}`);
  const res = await fetch(`${BACKEND_URL}/strategy-confirmation`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategyId,
        confirmationId
      }),
  });

  if (!res.ok) {
    console.error("Error removing confirmation from strategy:", res);
    throw new Error(`Failed to remove confirmation from strategy: ${res.statusText}`);
  }

  return true;
}