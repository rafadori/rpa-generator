import React from 'react';
import { WaitStep } from '../../../types/rpa';
import { useRpaStore } from '../../../store/rpaStore';

interface Props {
  step: WaitStep;
}

const WaitForm: React.FC<Props> = ({ step }) => {
  const { updateStep } = useRpaStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Tempo (ms)</label>
      <input
        type="number"
        min="0"
        step="100"
        value={step.argument}
        onChange={(e) => updateStep(step.id, { argument: parseInt(e.target.value) || 0 })}
        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-500"
      />
    </div>
  );
};

export default WaitForm;
