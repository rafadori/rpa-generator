import React from 'react';
import { GetStep } from '../../../types/rpa';
import { useRpaStore } from '../../../store/rpaStore';

interface Props {
  step: GetStep;
}

const GetForm: React.FC<Props> = ({ step }) => {
  const { updateStep } = useRpaStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Linha</label>
        <input
          type="number"
          min="1"
          value={step.row}
          onChange={(e) => updateStep(step.id, { row: parseInt(e.target.value) || 0 })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Coluna Inicial</label>
        <input
          type="number"
          min="1"
          value={step.col}
          onChange={(e) => updateStep(step.id, { col: parseInt(e.target.value) || 0 })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Qtd Colunas</label>
        <input
          type="number"
          min="1"
          value={step.argument}
          onChange={(e) => updateStep(step.id, { argument: parseInt(e.target.value) || 1 })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Var Retorno</label>
        <input
          type="text"
          value={step.returnVar}
          onChange={(e) => updateStep(step.id, { returnVar: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="@NOME"
        />
      </div>
    </div>
  );
};

export default GetForm;
