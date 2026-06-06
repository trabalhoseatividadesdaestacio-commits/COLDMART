import React, { useState, useEffect } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { LandingPage, PageBuilderSection } from '../types';
import { 
  Sparkles, FileEdit, Layout, Type, HelpCircle, 
  Eye, RefreshCw, Layers, Check, Copy, Laptop, Smartphone, Palette, ArrowRight
} from 'lucide-react';

interface PageBuilderViewProps {
  productId: string;
  onCloseBuilder: () => void;
}

export const PageBuilderView: React.FC<PageBuilderViewProps> = ({ productId, onCloseBuilder }) => {
  const { getLandingPage, updateLandingPage, products } = useColdmart();
  const [targetPage, setTargetPage] = useState<LandingPage | null>(null);
  const [activeProductTitle, setActiveProductTitle] = useState('');
  
  // Builder environment states
  const [selectedTheme, setSelectedTheme] = useState<'modern' | 'minimalist' | 'cosmic' | 'warm'>('modern');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab ] = useState<'sections' | 'copyparent' | 'theme'>('sections');

  // AI Prompt composer state
  const [aiValProposal, setAiValProposal] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedAILogs, setGeneratedAILogs] = useState<{headline: string, desc: string} | null>(null);

  // Load page configuration
  useEffect(() => {
    const page = getLandingPage(productId);
    if (page) {
      setTargetPage(page);
      setSelectedTheme(page.theme);
    }
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setActiveProductTitle(prod.title);
    }
  }, [productId, products]);

  if (!targetPage) return null;

  // Save changes locally in state context
  const handleSavePage = (updatedPageConfig: LandingPage) => {
    setTargetPage(updatedPageConfig);
    updateLandingPage(productId, updatedPageConfig);
  };

  const handleUpdateSectionContent = (sectionId: string, title: string, description: string, extra?: any) => {
    const updatedSections = targetPage.sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          content: {
            ...sec.content,
            title,
            description,
            ...extra
          }
        };
      }
      return sec;
    });

    const updated = { ...targetPage, sections: updatedSections };
    handleSavePage(updated);
  };

  // AI copywriting logic
  const handleSimulateAICopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiValProposal.trim()) return;

    setAiGenerating(true);

    setTimeout(() => {
      const promptText = aiValProposal.toLowerCase();
      let headline = 'A Revolução Definitiva no Seu Negócio Digital';
      let desc = 'Supere todos os concorrentes de mercado utilizando estruturas desenhadas de ponta a ponta para lucrar continuamente.';

      // Smart prompt routing based on keywords
      if (promptText.includes('saas') || promptText.includes('program') || promptText.includes('next') || promptText.includes('cod')) {
        headline = 'Construa SaaS Escaláveis e Recorra Receita em Dólar Sem Precisar de Agência';
        desc = 'Aprenda a orquestrar arquiteturas serverless seguras de Next.js integrando Inteligência Artificial produtiva para maximizar sua conversão de faturamento.';
      } else if (promptText.includes('invest') || promptText.includes('divid') || promptText.includes('finan') || promptText.includes('dinhe')) {
        headline = 'O Método Seguro Dos Dividendos: Multiplique Sua Carteira de Ativos Sem Medo';
        desc = 'Chega de perder dinheiro com oscilações. Aprenda a ler gráficos corporativos e crie uma linha de renda de lucros recorrentes em 4 passos simples.';
      } else if (promptText.includes('emag') || promptText.includes('peso') || promptText.includes('diet') || promptText.includes('fitn')) {
        headline = 'Seque e Ganhe Massa em Casa Com Dietas Feitas Para o Seu Metabolismo';
        desc = 'Guia prático sem restrições insanas. Conquiste tônus com cardápios dinâmicos e cronograma express de 15 minutos diários de altíssimo rendimento.';
      } else if (promptText.includes('copy') || promptText.includes('vend') || promptText.includes('head') || promptText.includes('marke')) {
        headline = 'Headline Hipnótica: Domine Palavras Primitivas Que Desencadeiam Desejos de Compra';
        desc = 'Destrave a atenção de leads qualificados em apenas 3 segundos. Aplique fórmulas clássicas de roteiros americanos que convertem em apenas uma leitura de ofertas.';
      }

      setGeneratedAILogs({ headline, desc });
      setAiGenerating(false);
    }, 1500);
  };

  // Inject AI outcome directly into Hero section
  const handleApplyAICopy = () => {
    if (!generatedAILogs) return;
    const heroSec = targetPage.sections.find(s => s.type === 'hero');
    if (heroSec) {
      handleUpdateSectionContent(heroSec.id, generatedAILogs.headline, generatedAILogs.desc, { ctaText: heroSec.content.ctaText });
      setGeneratedAILogs(null);
      setAiValProposal('');
      alert('Sua nova Headline & Copywriter gerada foi inserida diretamente no módulo principal da Landing Page!');
    }
  };

  // Color schemes CSS maps for the page builder rendering
  const themeStyles = {
    modern: {
      bg: 'bg-slate-900 text-white',
      cardBg: 'bg-slate-850 border-slate-800',
      textMuted: 'text-slate-400',
      primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white',
      accentText: 'text-blue-500',
      label: 'Modern Blue'
    },
    minimalist: {
      bg: 'bg-white text-zinc-900',
      cardBg: 'bg-zinc-50 border-zinc-200',
      textMuted: 'text-zinc-550',
      primaryBtn: 'bg-zinc-900 hover:bg-zinc-850 text-white',
      accentText: 'text-zinc-900 font-extrabold',
      label: 'Minimalist Clean'
    },
    cosmic: {
      bg: 'bg-zinc-950 text-white',
      cardBg: 'bg-purple-950/20 border-purple-900/30',
      textMuted: 'text-zinc-400',
      primaryBtn: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
      accentText: 'text-violet-400',
      label: 'Cosmic Violet'
    },
    warm: {
      bg: 'bg-[#faf6f0] text-amber-950',
      cardBg: 'bg-white border-amber-900/10',
      textMuted: 'text-amber-800/70',
      primaryBtn: 'bg-amber-900 text-white hover:bg-amber-850',
      accentText: 'text-amber-800',
      label: 'Warm Sand'
    }
  };

  const style = themeStyles[selectedTheme];

  const handleThemeChange = (t: 'modern' | 'minimalist' | 'cosmic' | 'warm') => {
    setSelectedTheme(t);
    const updated = { ...targetPage, theme: t };
    handleSavePage(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title bar */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-150 dark:border-zinc-850">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] text-zinc-400 font-black tracking-widest font-mono select-none">DIGITAL LANDING ENGINES</span>
          <h2 className="text-md font-bold text-gray-905 dark:text-white truncate">Page Builder: {activeProductTitle}</h2>
        </div>
        <button
          onClick={onCloseBuilder}
          className="bg-zinc-150 text-gray-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
        >
          Salvar e Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column Sidebar (5 Columns) */}
        <aside className="lg:col-span-5 space-y-6 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
          
          {/* Tabs navigation */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl font-semibold text-xs text-center border-b border-gray-150 dark:border-transparent">
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sections' ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 font-bold shadow' : 'text-gray-500'
              }`}
            >
              Seções
            </button>
            <button
              onClick={() => setActiveTab('copyparent')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'copyparent' ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 font-bold shadow' : 'text-gray-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Copy AI
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'theme' ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 font-bold shadow' : 'text-gray-500'
              }`}
            >
              Temas
            </button>
          </div>

          {/* SECTION PARAMETERS CONTAINER */}
          {activeTab === 'sections' && (
            <div className="space-y-5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Editar Textos da Landing Page</p>
              
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {targetPage.sections.map((sec) => (
                  <div key={sec.id} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 space-y-3 shrink-0">
                    <span className="text-[9.5px] uppercase font-bold text-blue-500 font-mono tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Seção: {sec.type}
                    </span>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">TÍTULO PRINCIPAL</label>
                        <input
                          type="text"
                          value={sec.content.title}
                          onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value, sec.content.description, { ctaText: sec.content.ctaText })}
                          className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">PARÁGRAFO / DESCRIÇÃO</label>
                        <textarea
                          rows={2}
                          value={sec.content.description}
                          onChange={(e) => handleUpdateSectionContent(sec.id, sec.content.title, e.target.value, { ctaText: sec.content.ctaText })}
                          className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none dark:text-white"
                        />
                      </div>
                      {sec.content.ctaText && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">TEXTO BOTÃO CHAMADA (CTA)</label>
                          <input
                            type="text"
                            value={sec.content.ctaText}
                            onChange={(e) => handleUpdateSectionContent(sec.id, sec.content.title, sec.content.description, { ctaText: e.target.value })}
                            className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI COPYWRITER COMPOSER */}
          {activeTab === 'copyparent' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Gerar Headlines Irresistíveis Com Inteligência de Máquina</p>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">Insira a proposta de valor que nossa IA deve modelar para o seu negócio digital.</p>
              </div>

              <form onSubmit={handleSimulateAICopy} className="space-y-3">
                <textarea
                  required
                  rows={2}
                  value={aiValProposal}
                  onChange={(e) => setAiValProposal(e.target.value)}
                  placeholder="Ex: Crie headlines técnicas sobre modelagem serverless de micro-serviços com nextjs."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-indigo-600/50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow cursor-pointer transition-all"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conpondo Copywriting no Simulador...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white text-white" /> Escrever Headlines de Conversão
                    </>
                  )}
                </button>
              </form>

              {generatedAILogs && (
                <div className="p-4 rounded-xl bg-amber-50/95 dark:bg-[#221c12] border-2 border-amber-500/40 space-y-3 animate-in zoom-in-95 duration-150 shadow-md">
                  <span className="text-[9.5px] uppercase font-extrabold text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono w-fit tracking-wider">
                    <Sparkles className="w-3 h-3 fill-amber-700 dark:fill-amber-300 text-transparent animate-pulse" /> Cópia Otimizada por IA
                  </span>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-xs text-gray-950 dark:text-amber-50 leading-snug">"{generatedAILogs.headline}"</h4>
                    <p className="text-[11.5px] text-gray-900 dark:text-amber-100/90 leading-relaxed font-semibold">"{generatedAILogs.desc}"</p>
                  </div>
                  <button
                    onClick={handleApplyAICopy}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-2.5 rounded-lg text-[10.5px] flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-amber-500/15 transition-all duration-200"
                  >
                    Injetar Headline na Landing Page <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PALETTE THEMES CHOICE */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Selecione o Look Comercial da Página</p>
              <div className="grid grid-cols-2 gap-3.5">
                {(Object.keys(themeStyles) as Array<keyof typeof themeStyles>).map((thm) => {
                  const item = themeStyles[thm];
                  const isChosen = selectedTheme === thm;
                  return (
                    <button
                      key={thm}
                      onClick={() => handleThemeChange(thm)}
                      className={`p-4 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2 ${
                        isChosen 
                          ? 'border-blue-500 bg-blue-500/10 shadow ring-2 ring-blue-500/10' 
                          : 'border-zinc-200 dark:border-zinc-850 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <Palette className="w-5 h-5 mx-auto text-blue-500" />
                      <div>
                        <p className="text-gray-905 dark:text-white tracking-tight">{item.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </aside>

        {/* Real-time Display Preview Layout Column (7 Columns) */}
        <main className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900/40 p-2 rounded-xl border border-gray-150 dark:border-zinc-900 text-xs text-gray-405">
            <span className="font-semibold font-mono">PRE-VIEW INTERATIVO DA LANDING PAGE</span>
            <div className="flex gap-1.5 p-0.5 bg-gray-150 dark:bg-zinc-900/80 rounded-lg">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`py-1 px-2.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                  previewDevice === 'desktop' ? 'bg-white dark:bg-zinc-950 text-blue-500 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 inline mr-1" /> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`py-1 px-2.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                  previewDevice === 'mobile' ? 'bg-white dark:bg-zinc-950 text-blue-500 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 inline mr-1" /> Mobile
              </button>
            </div>
          </div>

          {/* Interactive Simulated Render Page Box */}
          <div className="flex justify-center select-none">
            <div className={`transition-all duration-300 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-850 shadow-2xl ${
              previewDevice === 'mobile' ? 'max-w-[360px]' : 'max-w-full'
            }`}>
              
              {/* LANDING PAGE BODY GRAPHIC RENDERER */}
              <div className={`transition-colors duration-300 p-8 space-y-12 shrink-0 ${style.bg}`}>
                
                {/* Hero Section Container */}
                {targetPage.sections.find(s => s.type === 'hero') && (() => {
                  const sec = targetPage.sections.find(s => s.type === 'hero')!;
                  return (
                    <section className="text-center py-6 space-y-4">
                      <h1 className="text-2xl sm:text-3xl md:text-3xl font-black tracking-tight leading-tight max-w-xl mx-auto italic font-serif">
                        {sec.content.title}
                      </h1>
                      <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${style.textMuted}`}>
                        {sec.content.description}
                      </p>
                      {sec.content.ctaText && (
                        <button className={`py-3 px-6 rounded-xl font-bold text-xs cursor-pointer shadow transition-all hover:scale-[1.02] ${style.primaryBtn}`}>
                          {sec.content.ctaText}
                        </button>
                      )}
                    </section>
                  );
                })()}

                {/* Features Section Container */}
                {targetPage.sections.find(s => s.type === 'features') && (() => {
                  const sec = targetPage.sections.find(s => s.type === 'features')!;
                  return (
                    <section className={`p-6 rounded-xl border space-y-4 ${style.cardBg}`}>
                      <div className="text-center space-y-1">
                        <h3 className="font-bold text-xs uppercase text-blue-500 font-mono tracking-wider">Diferenciais</h3>
                        <h4 className="text-sm font-black tracking-tight">{sec.content.title}</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 text-[11px] leading-snug">
                        {(sec.content.items || []).map((item: any, id) => (
                          <div key={id} className="flex gap-2 items-start font-medium leading-tight">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" /></span>
                            <span className="opacity-90">{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })()}

                {/* CTA Section Container */}
                {targetPage.sections.find(s => s.type === 'cta') && (() => {
                  const sec = targetPage.sections.find(s => s.type === 'cta')!;
                  return (
                    <section className="text-center py-6 border-t border-zinc-500/10 space-y-3">
                      <h4 className="text-md font-bold tracking-tight">{sec.content.title}</h4>
                      <p className={`text-xs max-w-md mx-auto leading-relaxed ${style.textMuted}`}>{sec.content.description}</p>
                      {sec.content.ctaText && (
                        <button className={`py-3 px-6 rounded-xl font-bold text-xs shadow cursor-pointer hover:scale-[1.02] transition-all ${style.primaryBtn}`}>
                          {sec.content.ctaText}
                        </button>
                      )}
                    </section>
                  );
                })()}

              </div>

            </div>
          </div>

        </main>

      </div>

    </div>
  );
};
