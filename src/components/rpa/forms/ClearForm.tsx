import React from 'react';
import { ClearStep } from '../../../types/rpa';

interface Props {
  step: ClearStep;
}

const ClearForm: React.FC<Props> = () => {
  return (
    <div className="text-sm text-gray-500 italic">
      Este comando limpa o estado/tela. Não requer parâmetros.
    </div>
  );
};

export default ClearForm;
