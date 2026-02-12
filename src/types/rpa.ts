export type CommandType = 'PUT' | 'GET' | 'SENDKEY' | 'WAIT' | 'CLEAR';

export interface BaseStep {
  id: string; // UUID local para controle de UI
  order: number;
  type: CommandType;
}

export interface PutStep extends BaseStep {
  type: 'PUT';
  argument: string;
  row: number;
  col: number;
}

export interface GetStep extends BaseStep {
  type: 'GET';
  argument: number; // Quantidade de colunas
  row: number;
  col: number;
  returnVar: string;
}

export interface SendKeyStep extends BaseStep {
  type: 'SENDKEY';
  argument: string;
}

export interface WaitStep extends BaseStep {
  type: 'WAIT';
  argument: number; // ms
}

export interface ClearStep extends BaseStep {
  type: 'CLEAR';
}

export type RpaStep = PutStep | GetStep | SendKeyStep | WaitStep | ClearStep;

export interface RpaScript {
  name: string;
  inputVars: string[];
  steps: RpaStep[];
}
