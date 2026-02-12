import React, { useState } from 'react';
import { useRpaStore } from '../store/rpaStore';
import StepCard from '../components/rpa/StepCard';
import { Plus, Download, Play, AlertCircle } from 'lucide-react';

const Home: React.FC = () => {
  const { name, setName, inputVars, addInputVar, removeInputVar, steps, addStep, reset } = useRpaStore();
  const [newVar, setNewVar] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddVar = () => {
    if (newVar.trim()) {
      addInputVar(newVar.trim());
      setNewVar('');
    }
  };

  const handleGenerate = async () => {
    try {
      setError(null);
      const response = await fetch('/api/rpa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, inputVars, steps }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            const data = await response.json();
            throw new Error(data?.message || 'Erro ao gerar CSV');
          } catch {
            const text = await response.text();
            throw new Error(text || 'Erro ao gerar CSV');
          }
        } else {
          const text = await response.text();
          throw new Error(text || 'Erro ao gerar CSV');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'rpa'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerador de RPA</h1>
          <p className="text-gray-500">Crie seu fluxo automatizado de forma visual</p>
        </div>
        <button 
          onClick={reset}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Limpar Tudo
        </button>
      </header>

      {/* Configurações Iniciais */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Configurações Iniciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Script</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: Cadastro_Clientes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variáveis de Entrada</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newVar}
                onChange={(e) => setNewVar(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddVar()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="@NOME"
              />
              <button 
                onClick={handleAddVar}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {inputVars.map((v) => (
                <span key={v} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-100">
                  {v}
                  <button onClick={() => removeInputVar(v)} className="hover:text-blue-900">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fluxo de Passos */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">2. Fluxo de Execução</h2>
          <div className="flex gap-2">
            <button onClick={() => addStep('PUT')} className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 flex items-center gap-1 shadow-sm transition-all">
              <Plus size={14} /> PUT
            </button>
            <button onClick={() => addStep('GET')} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm transition-all">
              <Plus size={14} /> GET
            </button>
            <button onClick={() => addStep('SENDKEY')} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 flex items-center gap-1 shadow-sm transition-all">
              <Plus size={14} /> KEY
            </button>
            <button onClick={() => addStep('WAIT')} className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 flex items-center gap-1 shadow-sm transition-all">
              <Plus size={14} /> WAIT
            </button>
            <button onClick={() => addStep('CLEAR')} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 flex items-center gap-1 shadow-sm transition-all">
              <Plus size={14} /> CLEAR
            </button>
          </div>
        </div>

        {steps.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
            Nenhum passo adicionado ainda. Comece clicando em um comando acima.
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Ações Finais */}
      <section className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-sm">Não foi possível gerar o RPA:</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={handleGenerate}
            disabled={steps.length === 0}
            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download size={20} /> Gerar CSV (Dynamics)
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          O sistema validará automaticamente as regras antes da geração.
          <br />
          Todo script deve terminar com <strong>CLEAR + WAIT</strong>.
        </p>
      </section>
    </div>
  );
};

export default Home;
