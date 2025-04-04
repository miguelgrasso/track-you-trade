

/*export interface Condition {
  id: string;
  label: string;
  descripcion: string;
}

export interface Confirmation {
  tipo: string;
  nombre: string;
  descripcion: string;
  condiciones: Condition[];
}*/

export interface Strategy {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  //confirmaciones: Confirmation[];
}

export interface CreateStrategyData {
    name: string;
    description: string;
  }

/*export interface UserStrategies {
  nombre: string;
  estrategias: Strategy[];
}*/


