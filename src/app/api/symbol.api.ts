import { BACKEND_URL } from "../util/constantes";

export async function getSymbols() {
    const res = await fetch(`${BACKEND_URL}/symbol`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch symbols");
    }
    return res.json();
}

export async function getSymbol(id: number) {
    const res = await fetch(`${BACKEND_URL}/symbol/${id}`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch symbol");
    }
    return res.json();
}