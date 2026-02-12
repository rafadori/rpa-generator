import React from 'react';
import { PutStep } from '../../../types/rpa';
import { useRpaStore } from '../../../store/rpaStore';

interface Props {
  step: PutStep;
}

const PutForm: React.FC<Props> = ({ step }) => {
  const { updateStep } = useRpaStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Argumento (Valor/@Var)</label>
        <input
          type="text"
          value={step.argument}
          onChange={(e) => updateStep(step.id, { argument: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Ex: 123 ou @NOME"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Linha</label>
        <input
          type="number"
          min="1"
          value={step.row}
          onChange={(e) => updateStep(step.id, { row: parseInt(e.target.value) || 0 })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Coluna</label>
        <input
          type="number"
          min="1"
          value={step.col}
          onChange={(e) => updateStep(step.id, { col: parseInt(e.target.value) || 0 })}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PutForm;
