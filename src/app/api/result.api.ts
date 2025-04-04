import { BACKEND_URL } from "../util/constantes";

export async function getResults() {
    const res = await fetch(`${BACKEND_URL}/result`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch results");
    }
    return res.json();
}
