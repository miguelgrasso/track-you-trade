import { BACKEND_URL } from "../util/constantes";

export async function getOperationTypes() {
    const res = await fetch(`${BACKEND_URL}/operation-type`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch operation types");
    }
    return res.json();
}
