import { create } from 'zustand';
import { RpaScript, RpaStep, CommandType } from '../types/rpa';
import { v4 as uuidv4 } from 'uuid';

interface RpaState extends RpaScript {
  setName: (name: string) => void;
  addInputVar: (variable: string) => void;
  removeInputVar: (variable: string) => void;
  addStep: (type: CommandType) => void;
  updateStep: (id: string, data: Partial<RpaStep>) => void;
  removeStep: (id: string) => void;
  reorderSteps: () => void;
  reset: () => void;
}

const initialState: RpaScript = {
  name: '',
  inputVars: [],
  steps: [],
};

export const useRpaStore = create<RpaState>((set, get) => ({
  ...initialState,

  setName: (name) => set({ name }),

  addInputVar: (variable) => set((state) => {
    const newVar = variable.startsWith('@') ? variable : `@${variable}`;
    if (state.inputVars.includes(newVar)) return state;
    return { inputVars: [...state.inputVars, newVar] };
  }),

  removeInputVar: (variable) => set((state) => ({
    inputVars: state.inputVars.filter((v) => v !== variable),
  })),

  addStep: (type) => set((state) => {
    const lastOrder = state.steps.length > 0 ? state.steps[state.steps.length - 1].order : 0;
    const newOrder = lastOrder + 10;
    
    const newStep: RpaStep = {
      id: uuidv4(),
      order: newOrder,
      type,
      // Valores padrão
      ...(type === 'PUT' ? { argument: '', row: 1, col: 1 } : {}),
      ...(type === 'GET' ? { argument: 1, row: 1, col: 1, returnVar: '' } : {}),
      ...(type === 'SENDKEY' ? { argument: '' } : {}),
      ...(type === 'WAIT' ? { argument: 1000 } : {}),
      ...(type === 'CLEAR' ? {} : {}),
    } as RpaStep;

    return { steps: [...state.steps, newStep] };
  }),

  updateStep: (id, data) => set((state) => ({
    steps: state.steps.map((step) => 
      step.id === id ? { ...step, ...data } as RpaStep : step
    ),
  })),

  removeStep: (id) => set((state) => {
    const newSteps = state.steps.filter((step) => step.id !== id);
    // Reordenar após remover? O requisito diz "incrementos de 10".
    // Se removermos o meio, ficaria buraco. O requisito sugere reordenar se necessário.
    // Vamos manter simples por enquanto e só remover.
    return { steps: newSteps };
  }),

  reorderSteps: () => set((state) => ({
    steps: state.steps.map((step, index) => ({
      ...step,
      order: (index + 1) * 10,
    })),
  })),

  reset: () => set(initialState),
}));
