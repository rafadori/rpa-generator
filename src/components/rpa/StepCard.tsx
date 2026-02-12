import React from 'react';
import { RpaStep } from '../../types/rpa';
import { useRpaStore } from '../../store/rpaStore';
import { Trash2, GripVertical } from 'lucide-react';
import PutForm from './forms/PutForm';
import GetForm from './forms/GetForm';
import SendKeyForm from './forms/SendKeyForm';
import WaitForm from './forms/WaitForm';
import ClearForm from './forms/ClearForm';

interface StepCardProps {
  step: RpaStep;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const { removeStep } = useRpaStore();

  const renderForm = () => {
    switch (step.type) {
      case 'PUT': return <PutForm step={step} />;
      case 'GET': return <GetForm step={step} />;
      case 'SENDKEY': return <SendKeyForm step={step} />;
      case 'WAIT': return <WaitForm step={step} />;
      case 'CLEAR': return <ClearForm step={step} />;
      default: return null;
    }
  };

  const getBorderColor = () => {
    switch (step.type) {
      case 'PUT': return 'border-blue-500';
      case 'GET': return 'border-green-500';
      case 'SENDKEY': return 'border-purple-500';
      case 'WAIT': return 'border-yellow-500';
      case 'CLEAR': return 'border-red-500';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getBorderColor()} mb-4 flex gap-4 items-start`}>
      <div className="mt-2 text-gray-400 cursor-grab">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              #{step.order}
            </span>
            <span className="font-bold text-sm text-gray-800">{step.type}</span>
          </div>
          <button 
            onClick={() => removeStep(step.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Remover passo"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="mt-2">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
