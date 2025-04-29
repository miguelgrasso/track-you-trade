export interface Condition {
    id: number;
    name: string;
    description: string;
    status?: string;
    confirmationId: number;
  }
  
  export interface CreateConditionData {
    name: string;
    description: string;
    status?: string;
    confirmationId: number ;
  } 