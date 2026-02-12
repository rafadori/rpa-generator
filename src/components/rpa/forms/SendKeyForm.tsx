import React from 'react';
import { SendKeyStep } from '../../../types/rpa';
import { useRpaStore } from '../../../store/rpaStore';

interface Props {
  step: SendKeyStep;
}

const SendKeyForm: React.FC<Props> = ({ step }) => {
  const { updateStep } = useRpaStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Tecla / Comando</label>
      <input
        type="text"
        value={step.argument}
        onChange={(e) => updateStep(step.id, { argument: e.target.value })}
        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        placeholder="Ex: <Enter>, <F5>"
      />
    </div>
  );
};

export default SendKeyForm;
