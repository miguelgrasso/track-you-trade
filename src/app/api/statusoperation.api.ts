import { BACKEND_URL } from "../util/constantes";

export async function getStatusOperations() {
    const res = await fetch(`${BACKEND_URL}/status-operation`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch status operations");
    }
    return res.json();
}