import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product, ProductType } from '../types';
import { 
  Search, SlidersHorizontal, Star, Sparkles, BookOpen, 
  Tv, Award, Tag, DollarSign, ExternalLink, ShieldCheck, Share2, Heart, Check
} from 'lucide-react';

interface MarketplaceViewProps {
  onSelectProductForCheckout: (productId: string, affiliateCode?: string) => void;
  onNavigateToBuilder?: (productId: string) => void;
}

const CATEGORIES = [
  'Todos',
  'Marketing',
  'Programação',
  'Finanças',
  'Saúde',
  'Fitness',
  'Idiomas',
  'Desenvolvimento pessoal',
  'Negócios',
  'Educação',
  'Tecnologia'
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  onSelectProductForCheckout,
  onNavigateToBuilder
}) => {
  const { products, currentUser, requestAffiliation, affiliations } = useColdmart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedLinkMap, setCopiedLinkMap] = useState<Record<string, boolean>>({});

  // Filters setup
  const filteredProducts = products.filter(p => {
    // Only show active products in marketplace
    if (p.status !== 'active') return false;

    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesType = selectedType === 'all' || p.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getProductTypeIcon = (type: ProductType) => {
    switch (type) {
      case 'course': return <Tv className="w-4 h-4" />;
      case 'ebook': return <BookOpen className="w-4 h-4" />;
      case 'subscription': return <Sparkles className="w-4 h-4 text-violet-500" />;
      case 'mentorship': return <Award className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getProductTypeLabel = (type: ProductType) => {
    switch (type) {
      case 'course': return 'Curso Online';
      case 'ebook': return 'E-Book / PDF';
      case 'subscription': return 'Assinatura';
      case 'mentorship': return 'Mentoria VIP';
    }
  };

  // Handle Copy Affiliate link to clipboard simulated
  const handleCopyAffiliateCode = (code: string) => {
    const fakeUrl = `${window.location.origin}/checkout?prod=${code}&shared=true`;
    // Act like copies link
    navigator.clipboard.writeText(fakeUrl).then(() => {
      setCopiedLinkMap(prev => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopiedLinkMap(prev => ({ ...prev, [code]: false }));
      }, 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white py-12 px-8 sm:px-12 md:py-16 md:px-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            Infoprodutos de Alto Impacto
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none text-white">
            Monetize Seu Conhecimento com a <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Coldmart</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Descubra os treinamentos e e-books mais cobiçados do mercado, ou afilie-se a produtos campeões de vendas e garanta comissões de até 80%!
          </p>
          
          {/* Quick Search inside Hero */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por assunto, autor ou palavra-chave..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none placeholder-slate-500 transition-all text-white shadow-xl"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-blue-500/10 cursor-pointer">
              <span>Buscar Agora</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Panel desktop */}
        <aside className="space-y-6 lg:col-span-1 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl h-fit">
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-900 pb-4">
            <h3 className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              Filtros Avançados
            </h3>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setSelectedType('all');
              }}
              className="text-[11px] text-gray-500 dark:text-zinc-400 hover:text-blue-500 hover:underline"
            >
              Resetar Tudo
            </button>
          </div>

          <div className="space-y-5">
            {/* Category selection */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">Categoria</p>
              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400 font-semibold'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Type selection */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">Formato de Entrega</p>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Todos os formatos' },
                  { id: 'course', label: 'Cursos Online (Área de Membros)' },
                  { id: 'ebook', label: 'E-Books & PDFs' },
                  { id: 'subscription', label: 'Assinaturas / Recorrência' },
                  { id: 'mentorship', label: 'Mentorias VIPs' }
                ].map((t) => (
                  <label 
                    key={t.id}
                    className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400 font-medium cursor-pointer py-1 block"
                  >
                    <input
                      type="radio"
                      name="product_type"
                      checked={selectedType === t.id}
                      onChange={() => setSelectedType(t.id)}
                      className="text-blue-500 focus:ring-blue-500 border-zinc-200 dark:border-zinc-800"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-zinc-900/40 rounded-xl text-center leading-relaxed text-[11px] text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-900">
              <ShieldCheck className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
              Todas as transações operam sob a garantia incondicional Coldmart de 7 dias com criptografia e estorno imediato.
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold font-mono">
              MOSTRANDO {filteredProducts.length} PRODUTOS ENCONTRADOS
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950">
              <Search className="w-10 h-10 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Nenhum produto ativado</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Não localizamos infoprodutos correspondentes à pesquisa. Altere os filtros ou adicione novos produtos como Produtor!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isAffiliate = affiliations.find(a => a.productId === p.id && a.affiliateId === currentUser?.id);
                
                return (
                  <div 
                    key={p.id}
                    className="group border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-zinc-900/50 dark:hover:border-zinc-700 hover:border-gray-350 transition-all duration-300 flex flex-col"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden bg-zinc-100">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                        {getProductTypeIcon(p.type)}
                        {getProductTypeLabel(p.type)}
                      </span>
                      <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-zinc-950 text-amber-500 dark:text-amber-400 text-[10px] font-bold shadow-lg">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {p.rating > 0 ? p.rating : 'Novo'}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-mono">
                          <Tag className="w-3 h-3" />
                          {p.category}
                        </div>
                        <h4 className="font-bold text-gray-950 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-900 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Produtor</p>
                          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">{p.creatorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Valor comercial</p>
                          <p className="text-md font-black text-gray-950 dark:text-white">
                            R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      {/* Commission Details */}
                      {p.commission > 0 && (
                        <div className="mt-4 p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                            Afiliação Disponível
                          </span>
                          <span className="text-orange-600 dark:text-orange-400">
                            Até {p.commission}% de comissão
                          </span>
                        </div>
                      )}

                      {/* Interactive Actions Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-zinc-900">
                        
                        {/* Affiliate Action */}
                        {currentUser?.role === 'affiliate' ? (
                          isAffiliate ? (
                            <button
                              onClick={() => handleCopyAffiliateCode(isAffiliate.linkCode)}
                              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-3 py-2 rounded-xl text-xs hover:bg-emerald-100 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1 cursor-pointer"
                              title="Copiar Link de Divulgação"
                            >
                              {copiedLinkMap[isAffiliate.linkCode] ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Copiado!
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" /> Link Rastreável
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => requestAffiliation(p.id)}
                              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-3 py-2 rounded-xl text-xs hover:bg-zinc-200 dark:hover:bg-zinc-850 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> Solicitar Afiliação
                            </button>
                          )
                        ) : (
                          // If not logged as affiliate, display creator options if creator, else show info link
                          currentUser?.role === 'producer' && p.creatorId === currentUser.id ? (
                            <button
                              onClick={() => onNavigateToBuilder && onNavigateToBuilder(p.id)}
                              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-3 py-2 rounded-xl text-xs hover:bg-zinc-200 dark:hover:bg-zinc-850 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Construtor
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectProductForCheckout(p.id)}
                              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-3 py-2 rounded-xl text-xs hover:bg-zinc-200 dark:hover:bg-zinc-850 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              Oferta & Detalhes
                            </button>
                          )
                        )}

                        {/* Buy Link */}
                        <button
                          onClick={() => {
                            // If affiliate is viewing, simulate purchasing with their own code if they have one
                            const affCode = isAffiliate?.linkCode || undefined;
                            onSelectProductForCheckout(p.id, affCode);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all active:scale-95 duration-150"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Adquirir
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
