import { NewTradeDetail } from "../interface/newtradedetail.interface";
import { BACKEND_URL } from "../util/constantes";



export async function getTradeDetailsbyTradeId(tradeId: number) {
    console.log("url",`${BACKEND_URL}/trade-details/trade/${tradeId}`);
    const res = await fetch(`${BACKEND_URL}/trade-details/trade/${tradeId}`, { cache: "no-store" });
    if (res.status === 404) {
        return [];
      }
    if (!res.ok) {
        const data = res.json();
    console.log("res data", data);
        throw new Error("Failed to fetch trade details");
    }
    const data = await res.json();
    console.log("res data", data);
    return data;
}

export async function createTradeDetail(tradeDetail: NewTradeDetail) {
    console.log("new tradeDetail",tradeDetail);
    const res = await fetch(`${BACKEND_URL}/trade-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeDetail),
    });
    
    if (!res.ok) {
        throw new Error("Failed to create trade detail");
    }
    return res.json();
}

export async function updateTradeDetail(id: number,tradeDetail: NewTradeDetail) {
    const res = await fetch(`${BACKEND_URL}/trade-details/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeDetail),
    });
    if (!res.ok) {
        throw new Error("Failed to update trade detail");
    }
    return res.json();
}
