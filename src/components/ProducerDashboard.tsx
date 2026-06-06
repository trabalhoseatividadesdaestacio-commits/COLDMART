import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product, ProductType } from '../types';
import { 
  DollarSign, Sparkles, BookOpen, Layers, Users, PlusCircle, 
  Trash2, HelpCircle, Eye, FileEdit, Settings, Check, Coins, TrendingUp, AlertCircle
} from 'lucide-react';

interface ProducerDashboardProps {
  onNavigateToBuilder: (productId: string) => void;
}

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({ onNavigateToBuilder }) => {
  const { products, sales, currentUser, addProduct, updateProduct, deleteProduct, requestWithdrawal, transfers } = useColdmart();
  
  // Show new asset form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Marketing');
  const [newPrice, setNewPrice] = useState(99.00);
  const [newType, setNewType] = useState<ProductType>('course');
  const [newCommission, setNewCommission] = useState(50);
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80');

  // Withdrawal States
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100.00);
  const [pixKey, setPixKey] = useState(currentUser?.email || '');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Multi-step lesson builder state inside creation
  const [modulesList, setModulesList] = useState<{title: string, lessons: {title: string, duration: string, videoUrl: string, completed: boolean, description: string, materials: any[]}[]}[]>([
    {
      title: 'Módulo de Boas-Vindas',
      lessons: [
        {
          title: 'Aula de Recepção e Introdução ao Treinamento',
          duration: '10:00',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          completed: false,
          description: 'Seja muito bem-vindo! Nesta primeira aula, alinharemos os principais conceitos.',
          materials: []
        }
      ]
    }
  ]);

  if (!currentUser) return null;

  // Filter creator specific metrics
  const creatorProducts = products.filter(p => p.creatorId === currentUser.id);
  const creatorProductIds = creatorProducts.map(p => p.id);
  
  // Sales matching creator's products
  const creatorSales = sales.filter(s => creatorProductIds.includes(s.productId) && s.status === 'completed');
  const myTotalRevenue = creatorSales.reduce((acc, s) => acc + s.creatorCommission, 0);
  const studentsCount = creatorProducts.reduce((acc, p) => acc + p.enrolledCount, 0);

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      alert('Favor preencher o campo de Título e Descrição do infoproDUTO digital.');
      return;
    }

    // Adapt image based on categories if default selected
    let selectedImage = newImg;
    if (newImg.includes('photo-1454165804606-c3d57bc86b40')) {
      if (newCategory === 'Fitness' || newCategory === 'Saúde') selectedImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';
      if (newCategory === 'Finanças') selectedImage = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80';
      if (newCategory === 'Programação' || newCategory === 'Tecnologia') selectedImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
    }

    // Save with the generated module structure
    addProduct({
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      type: newType,
      commission: Number(newCommission),
      category: newCategory,
      image: selectedImage,
      modules: modulesList.map((m, mIdx) => ({
        id: `mod_${Date.now()}_${mIdx}`,
        title: m.title,
        lessons: m.lessons.map((l, lIdx) => ({
          id: `les_${Date.now()}_${mIdx}_${lIdx}`,
          title: l.title,
          videoUrl: l.videoUrl,
          duration: l.duration,
          completed: false,
          description: l.description,
          materials: l.materials
        }))
      }))
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewPrice(99.00);
    setNewType('course');
    setNewCommission(50);
    setShowAddForm(false);
    
    alert('Seu infoproduto foi publicado com sucesso! Ele já foi adicionado ao Marketplace público de forma imediata e já está disponível para afiliações e compras.');
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccessMsg('');
    setWithdrawErrorMsg('');

    if (withdrawAmount <= 0) {
      setWithdrawErrorMsg('Erro: O valor deve ser superior a zero.');
      return;
    }

    if (currentUser.balance < withdrawAmount) {
      setWithdrawErrorMsg(`Erro: Seu saldo disponível (R$ ${currentUser.balance.toFixed(2)}) é inferior ao valor solicitado.`);
      return;
    }

    const response = requestWithdrawal(withdrawAmount, pixKey);
    if (response.success) {
      setWithdrawSuccessMsg(response.message);
      setWithdrawAmount(100.00);
    } else {
      setWithdrawErrorMsg(response.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Central do Produtor</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Insira, controle e otimize seus infoprodutos e cursos focando no maior faturamento digital possível.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 transition-all cursor-pointer select-none"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Minha Receita Líquida</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {myTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Descontados splits e taxas da plataforma</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Estudantes Matriculados</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {studentsCount}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Alunos que adquiriram seus produtos</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Produtos Ativos</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Layers className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {creatorProducts.filter(p => p.status === 'active').length}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Infoprodutos publicados no marketplace público</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Disponível para Resgate</span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500"><Coins className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-black text-gray-950 dark:text-white font-mono mt-1">
              R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="block text-[10px] text-zinc-400 leading-none mt-1">Saldo na carteira digital coldmart</span>
          </div>
          <button
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
            className="w-full mt-2 bg-violet-600 hover:bg-violet-505 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-violet-500/10"
          >
            <span>{showWithdrawForm ? 'Fechar Painel' : 'Resgatar via PIX'}</span>
          </button>
        </div>
      </div>

      {/* Withdrawal Form Panel */}
      {showWithdrawForm && (
        <section className="bg-gradient-to-br from-violet-500/[0.03] to-purple-500/[0.02] border border-violet-500/20 bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-xl animate-in slide-in-from-top duration-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-violet-500" />
                  <h3 className="font-bold text-sm text-gray-950 dark:text-white font-display">Solicitar Resgate de Produtor</h3>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Transfira seus lucros de infoproduto diretamente para sua conta bancária. O saque passa por uma auditoria rápida automática de compliance para liberação na sua chave PIX.
                </p>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">Valor do Saque (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">R$</span>
                    <input
                      type="number"
                      required
                      min={10}
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-violet-500 focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">Chave Pix de Recebimento</label>
                  <input
                    type="text"
                    required
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="Seu CPF, e-mail, telefone ou chave aleatória"
                    className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-violet-500 focus:outline-none dark:text-white font-mono"
                  />
                </div>

                {withdrawSuccessMsg && (
                  <p className="text-[10px] p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{withdrawSuccessMsg}</span>
                  </p>
                )}
                {withdrawErrorMsg && (
                  <p className="text-[10px] p-2.5 rounded-xl bg-rose-500/10 text-rose-600 font-semibold flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{withdrawErrorMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/10 cursor-pointer transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
                >
                  Confirmar e Solicitar Resgate
                </button>
              </form>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-zinc-150 dark:border-zinc-800 pt-5 md:pt-0 md:pl-6 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Histórico de Resgates</h4>
                <span className="text-[9px] text-zinc-500 font-bold bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-mono">
                  {transfers.filter(t => t.userId === currentUser.id).length} saques
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {transfers.filter(t => t.userId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-8">Nenhum saque solicitado até o momento.</p>
                ) : (
                  transfers.filter(t => t.userId === currentUser.id).map((t) => (
                    <div key={t.id} className="border border-zinc-150 dark:border-zinc-900/50 p-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">R$ {t.amount.toFixed(2)}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5 max-w-[170px] truncate" title={t.pixKey}>PIX: {t.pixKey}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider ${
                          t.status === 'completed' || t.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : t.status === 'rejected' 
                            ? 'bg-rose-500/10 text-rose-600' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {t.status === 'completed' || t.status === 'approved' ? 'Concluído' : t.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </span>
                        <p className="text-[8px] text-zinc-400 dark:text-zinc-500 mt-1">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Creation Modal Form */}
      {showAddForm && (
        <section className="border-2 border-dashed border-blue-500/30 bg-blue-500/[0.01] dark:bg-zinc-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Sparkles className="text-blue-500 w-5 h-5 animate-pulse" />
              Cadastrar Novo Produto Digital
            </h3>
            <p className="text-xs text-gray-500 mt-1">Defina as bases técnicas, comissionamento de rede e formato do seu infoproduto.</p>
          </div>

          <form onSubmit={handleCreateProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column inputs */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Título do Produto Digital</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Do Zero Ao Primeiro SaaS em 14 dias"
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Descrição Comercial</label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Especifique os maiores diferenciais do seu material, transformações reais propostas aos alunos e garantias de acesso..."
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      step="any"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Comissão para Afiliados (%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={85}
                      value={newCommission}
                      onChange={(e) => setNewCommission(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column configurations */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block">Categoria do Infoproduto</p>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Programação">Programação</option>
                    <option value="Finanças">Finanças</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Desenvolvimento pessoal">Desenvolvimento pessoal</option>
                    <option value="Negócios">Negócios</option>
                    <option value="Educação">Educação</option>
                    <option value="Tecnologia">Tecnologia</option>
                  </select>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block">Formato de Entrega</p>
                  <div className="space-y-2">
                    {[
                      { id: 'course', label: 'Curso Online (Área de Membros)' },
                      { id: 'ebook', label: 'Ebook / Livro Digital PDF' },
                      { id: 'subscription', label: 'Assinatura Club / Recorrência' },
                      { id: 'mentorship', label: 'Mentoria Vip Individual' }
                    ].map((t) => (
                      <label key={t.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400 cursor-pointer">
                        <input
                          type="radio"
                          name="new_product_format"
                          checked={newType === t.id}
                          onChange={() => setNewType(t.id as ProductType)}
                          className="text-blue-600 border-zinc-200 dark:border-zinc-800"
                        />
                        <span>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex gap-3 justify-end border-t border-gray-100 dark:border-zinc-900 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-zinc-150 text-gray-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-500/10"
              >
                Criar Módulos e Cadastrar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Products list detail workspace */}
      <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Meus Produtos Digitais Cadastrados
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400">Ative seu Page Builder ou audite as notas comerciais de cada item.</p>
        </div>

        <div className="p-5 space-y-6 divide-y divide-gray-100 dark:divide-zinc-900">
          {creatorProducts.length === 0 ? (
            <div className="text-center py-12">
              <PlusCircle className="w-8 h-8 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-gray-505 dark:text-zinc-400">Você ainda não possui infoprodutos cadastrados na Coldmart.</p>
              <button onClick={() => setShowAddForm(true)} className="text-blue-500 inline-block mt-1 font-bold text-xs hover:underline cursor-pointer">Cadastrar meu primeiro produto hoje</button>
            </div>
          ) : (
            creatorProducts.map((p, idx) => {
              const ratingDisplay = p.rating > 0 ? `${p.rating} ★ (${p.ratingCount} aval.)` : 'Sem avaliações';
              
              return (
                <div key={p.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between`}>
                  <div className="flex gap-4 items-center min-w-0 flex-1">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-20 h-14 object-cover rounded-lg bg-zinc-100 placeholder-zinc-250 border border-zinc-250 dark:border-zinc-800"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-950 dark:text-white truncate">{p.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          p.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : p.status === 'rejected' 
                            ? 'bg-rose-500/10 text-rose-600' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {p.status === 'active' ? 'Ativo / No Ar' : p.status === 'rejected' ? 'Rejeitado Administrador' : 'Aguardando Aprovação'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate leading-relaxed max-w-lg mt-0.5">{p.description}</p>
                      
                      <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 dark:text-zinc-500 mt-1.5">
                        <span>PREÇO: R$ {p.price.toFixed(2)}</span>
                        <span>•</span>
                        <span>COMISSÃO AFILIADO: {p.commission}%</span>
                        <span>•</span>
                        <span>ALUNOS: {p.enrolledCount}</span>
                        <span>•</span>
                        <span className="text-amber-500">{ratingDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex gap-2 items-center justify-end shrink-0 py-1">
                    <button
                      onClick={() => onNavigateToBuilder(p.id)}
                      className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-200 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-gray-200 dark:border-zinc-800"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                      Page Builder
                    </button>
                    {deletingId === p.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/20 p-1 rounded-xl text-xs animate-in fade-in duration-200 shrink-0">
                        <span className="text-rose-600 dark:text-rose-400 font-bold text-[10px] pl-1 font-mono uppercase">Confirmar?</span>
                        <button
                          onClick={() => {
                            deleteProduct(p.id);
                            setDeletingId(null);
                          }}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-2 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-gray-750 dark:text-zinc-300 font-bold px-2 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-rose-150 dark:border-rose-900/50"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-3.5" />
                        <span>Excluir produto</span>
                      </button>
                    )}
                    {p.status === 'active' && (
                      <span className="p-2.5 text-emerald-500 bg-emerald-500/5 rounded-full border border-emerald-500/10" title="Ativo no Marketplace">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Recent Sales for this specific producer */}
      <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-violet-500" />
            Minhas Vendas Realizadas (Recentes)
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400">Lista consolidada de faturas pagas e splits de comissões com afiliados.</p>
        </div>

        <div className="overflow-x-auto">
          {creatorSales.length === 0 ? (
            <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-12">Nenhuma venda faturada dos seus produtos no momento.</p>
          ) : (
            <table className="w-full text-xs text-left text-gray-500 dark:text-zinc-400">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-[10px] text-zinc-400 font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Produto</th>
                  <th className="px-6 py-3">Cliente comprador</th>
                  <th className="px-6 py-3">Fatura Bruta</th>
                  <th className="px-6 py-3">Comissão Produtor Líquida</th>
                  <th className="px-6 py-3">Comissão de Afiliados</th>
                  <th className="px-6 py-3">Validade do Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                {creatorSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-900/40">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{sale.productTitle}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800 dark:text-zinc-300 leading-none">{sale.buyerName}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">{sale.buyerEmail}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">R$ {sale.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono text-emerald-500 font-bold">+ R$ {sale.creatorCommission.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono text-zinc-500">
                      {sale.affiliateCommission > 0 ? `R$ ${sale.affiliateCommission.toFixed(2)}` : 'Sem afiliado'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px]">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

    </div>
  );
};
