import { Condition } from "./condition.interface";

export interface Confirmation {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  conditions?: Condition[];
  strategyId?: number;
}

export interface CreateConfirmationData {
  name: string;
  description: string;
  status?: string;
  strategyId?: number;
}

