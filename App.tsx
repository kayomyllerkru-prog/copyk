import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AdCard from './components/AdCard';
import { generateAdsCopy } from './services/geminiService';
import { AdsResponse, FormData } from './types';
import { AlertCircle, LayoutGrid, List } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    keyword: '',
    numHeadlines: 10,
    creativity: 5,
    persuasiveness: 5,
  });
  const [results, setResults] = useState<AdsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keyword.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateAdsCopy(
        formData.keyword, 
        formData.numHeadlines,
        formData.creativity,
        formData.persuasiveness
      );
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar o conteúdo. Verifique sua chave de API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">CopyK: Gerador de Ads Jurídico</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Crie títulos e descrições otimizados com controle de criatividade e persuasão, sempre em conformidade com a OAB.
          </p>
        </div>

        <InputSection 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-10 animate-fade-in-up">
            {/* Títulos Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">Títulos Sugeridos</h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
                  Max 30 carac.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.titulos_ads.map((title, index) => (
                  <AdCard key={`title-${index}`} text={title} type="headline" />
                ))}
              </div>
            </div>

            {/* Descrições Section */}
            <div>
               <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <List className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">Descrições Sugeridas</h3>
                 <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
                  Max 90 carac.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.descricoes_ads.map((desc, index) => (
                  <AdCard key={`desc-${index}`} text={desc} type="description" />
                ))}
              </div>
            </div>
          </div>
        )}

        {!results && !loading && !error && (
          <div className="text-center py-12 opacity-40">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Defina os parâmetros acima para gerar suas copys.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;