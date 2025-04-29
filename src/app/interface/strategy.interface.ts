export interface Strategy {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
}

export interface CreateStrategyData {
  name: string;
  description: string;
  status?: string;
}
