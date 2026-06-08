import React from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product, TransferRequest, Sale } from '../types';
import { 
  TrendingUp, Users, Inbox, HeartHandshake, ShieldAlert, 
  Check, X, FileCheck, Landmark, RefreshCw, BarChart2, Briefcase,
  Building2, Wallet, History, Save
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    sales, 
    users, 
    transfers, 
    approveProduct, 
    rejectProduct, 
    approveWithdrawal, 
    rejectWithdrawal,
    currentUser,
    updateUserCorporateDetails,
    requestWithdrawal
  } = useColdmart();

  const [activeTab, setActiveTab] = React.useState<'audits' | 'corporate'>('audits');

  // Corporate PJ Form States
  const [cnpj, setCnpj] = React.useState(currentUser?.cnpj || '');
  const [corporateName, setCorporateName] = React.useState(currentUser?.corporateName || '');
  const [tradingName, setTradingName] = React.useState(currentUser?.tradingName || '');
  const [corporatePixKey, setCorporatePixKey] = React.useState(currentUser?.corporatePixKey || '');
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Admin Payout States
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [pixKey, setPixKey] = React.useState('');
  const [withdrawError, setWithdrawError] = React.useState('');
  const [withdrawSuccess, setWithdrawSuccess] = React.useState('');

  // Sync state when currentUser page loads or switches
  React.useEffect(() => {
    if (currentUser) {
      setCnpj(currentUser.cnpj || '');
      setCorporateName(currentUser.corporateName || '');
      setTradingName(currentUser.tradingName || '');
      setCorporatePixKey(currentUser.corporatePixKey || '');
      if (currentUser.corporatePixKey) {
        setPixKey(currentUser.corporatePixKey);
      }
    }
  }, [currentUser]);

  // Set local pix prefill if corporate key changes
  React.useEffect(() => {
    if (corporatePixKey) {
      setPixKey(corporatePixKey);
    }
  }, [corporatePixKey]);

  const handleSaveCorporateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserCorporateDetails(cnpj, corporateName, tradingName, corporatePixKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  const handleAdminWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Digite um valor de saque válido.');
      return;
    }

    if (!pixKey.trim()) {
      setWithdrawError('Digite uma chave PIX válida.');
      return;
    }

    if (!currentUser || currentUser.balance < amount) {
      setWithdrawError('Saldo operacional insuficiente no caixa administrativo.');
      return;
    }

    const res = requestWithdrawal(amount, pixKey);
    if (res.success) {
      setWithdrawSuccess(res.message);
      setWithdrawAmount('');
    } else {
      setWithdrawError(res.message);
    }
  };

  // Dynamic statistics
  const totalGMV = sales.reduce((acc, current) => acc + current.amount, 0);
  const platformEarnings = sales.reduce((acc, current) => acc + (current.adminCommission !== undefined ? current.adminCommission : current.amount * 0.05), 0);
  const pendingProducts = products.filter(p => p.status === 'pending_approval');
  const pendingTransfers = transfers.filter(t => t.status === 'pending');

  // Admin special transfers history (filtering requests belonging to usr_admin or current active admin)
  const adminWithdrawalHistory = transfers.filter(t => t.userId === currentUser?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Terminal Geral de Auditoria</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Visão corporativa consolidada, regulagem fiscal PJ, e execução instantânea de resgates do cofre administrativo.</p>
        </div>

        {/* Tab Selection buttons */}
        <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-xl p-1 border border-gray-200 dark:border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'audits'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-500/10'
                : 'text-gray-400 hover:text-gray-205'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Auditoria Central
          </button>
          <button
            onClick={() => setActiveTab('corporate')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'corporate'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-500/10'
                : 'text-gray-400 hover:text-gray-205'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Empresa Jurídica & Meus Saques
          </button>
        </div>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Volume Geral SaaS (GMV)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {totalGMV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Vendas brutas totais transacionadas</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Meu Saldo Plataforma</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500"><Wallet className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">
            R$ {(currentUser?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Taxas retidas administradoras disponíveis</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Repasse Total Arrecadado</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Landmark className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {platformEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Acúmulo consolidado sobre taxas (5%)</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Pendente no Caixa Geral</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><RefreshCw className="w-4 h-4 text-amber-500" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {(currentUser?.balancePending || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Retido de outros produtores liquidados</span>
        </div>
      </div>

      {activeTab === 'audits' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Product curation pane */}
            <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  Processar Novos Produtos Digitais
                </h3>
                <span className="bg-amber-500/10 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingProducts.length} Pendentes
                </span>
              </div>

              <div className="p-5 space-y-4 divide-y divide-gray-100 dark:divide-zinc-900">
                {pendingProducts.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-12 font-medium">
                    Nenhum infoproduto aguarda aprovação de catálogo. Ótimo trabalho dos criadores!
                  </p>
                ) : (
                  pendingProducts.map((p, idx) => (
                    <div key={p.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                      <div className="flex gap-3 justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] bg-blue-500/15 text-blue-500 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                            {p.type}
                          </span>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1.5 truncate">{p.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">
                            {p.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] font-mono font-semibold text-gray-500 dark:text-zinc-400 mt-2">
                            <span>PREÇO: R$ {p.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>CATEGORIA: {p.category}</span>
                            <span>•</span>
                            <span>CRIADOR ID: {p.creatorId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => rejectProduct(p.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Rejeitar
                        </button>
                        <button
                          onClick={() => approveProduct(p.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Aprovar e Ativar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Withdrawal payout requests */}
            <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-orange-500" />
                  Auditoria de Transferências Bancárias (Pix)
                </h3>
                <span className="bg-orange-500/10 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingTransfers.length} Aguardando
                </span>
              </div>

              <div className="p-5 space-y-4 divide-y divide-gray-100 dark:divide-zinc-900">
                {pendingTransfers.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-12 font-medium">
                    Nenhuma solicitação de saque de caixa pendente no momento.
                  </p>
                ) : (
                  pendingTransfers.map((t, idx) => (
                    <div key={t.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Requerente comercial</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{t.userName}</p>
                          <p className="text-[10px] font-mono text-gray-500 mt-1">CHAVE PIX: <span className="font-bold text-cyan-400">{t.pixKey}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 dark:text-zinc-500">Valor líquido</p>
                          <p className="text-sm font-black text-rose-500 font-mono">
                            - R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => rejectWithdrawal(t.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Recusar Saque
                        </button>
                        <button
                          onClick={() => approveWithdrawal(t.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Liberar Pix do Caixa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* Global audit log tracking and recent sales */}
          <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-violet-500" />
                Vendas Gerais Consolidadas na Rede (Blockchain Audit)
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">Auditoria criptográfica contínua das faturas e splits de comissões.</p>
            </div>

            <div className="overflow-x-auto font-medium">
              <table className="w-full text-xs text-left text-gray-500 dark:text-zinc-400">
                <thead className="bg-gray-50 dark:bg-zinc-900 text-[10px] text-zinc-400 font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-mono">ID Venda</th>
                    <th className="px-6 py-3.5">Produto faturado</th>
                    <th className="px-6 py-3.5">Comprador</th>
                    <th className="px-6 py-3.5">Valor Comércio</th>
                    <th className="px-6 py-3.5">Split Plataforma (5%)</th>
                    <th className="px-6 py-3.5">Canal de Pagamento</th>
                    <th className="px-6 py-3.5">Data/Hora UTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-900/40">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">{sale.id.substring(0, 14)}</td>
                      <td className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">{sale.productTitle}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white leading-none">{sale.buyerName}</p>
                        <span className="text-[10px] text-zinc-500">{sale.buyerEmail}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-905 dark:text-white">R$ {sale.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono text-emerald-500 font-semibold">+ R$ {(sale.adminCommission !== undefined ? sale.adminCommission : sale.amount * 0.05).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-150 dark:bg-zinc-900 font-bold uppercase text-[9px] text-zinc-550 dark:text-zinc-400">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px]">{new Date(sale.date).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-semibold">
            
            {/* Column 1: PJ Corporate settings */}
            <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Cadastro de Conta Jurídica (PJ)</h3>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">Insira as informações tributárias da holding reguladora para emissão de notas fiscais.</p>
                </div>
              </div>

              <form onSubmit={handleSaveCorporateDetails} className="p-6 space-y-4">
                {saveSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    Dados PJ salvos e sincronizados com sucesso!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                      CNPJ da Empresa
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 12.345.678/0001-90"
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                      CHAVE PIX CORPORATIVA (DEPÓSITOS)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: financeiro@coldmart.com.br"
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                      value={corporatePixKey}
                      onChange={(e) => setCorporatePixKey(e.target.value)}
                    />
                    <span className="text-[9px] text-zinc-500 mt-1 block">Pré-carrega automaticamente seus saques de caixa.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: COLDMART INTERMEDIAÇÕES FINANCEIRAS S.A."
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                    value={corporateName}
                    onChange={(e) => setCorporateName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: COLDMART S.A."
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                    value={tradingName}
                    onChange={(e) => setTradingName(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-350 hover:to-blue-500 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 transition-all"
                  >
                    <Save className="w-4 h-4 hover:scale-110 transition-transform" />
                    Salvar Dados Corporativos S.A.
                  </button>
                </div>
              </form>
            </section>

            {/* Column 2: Withdrawal executing form */}
            <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl font-semibold">
              <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Retirada Imediata de Taxas de Admin</h3>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">Resgate as comissões obtidas das vendas (R$ 5%) instantaneamente via Pix profissional.</p>
                </div>
              </div>

              <form onSubmit={handleAdminWithdrawal} className="p-6 space-y-4">
                {withdrawSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    {withdrawSuccess}
                  </div>
                )}

                {withdrawError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" />
                    {withdrawError}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#121217] border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Caixa Disponível</span>
                    <p className="text-2xl font-black text-cyan-400 font-mono mt-1">
                      R$ {(currentUser?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <Landmark className="w-8 h-8 text-cyan-400/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                    Valor de Transferência (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 5000.00"
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-205 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:border-cyan-500 transition-all text-xl"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-mono font-semibold">
                    Chave Pix para Depósito
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Chave Pix para envio de repasse..."
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-205 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-cyan-500 transition-all"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                  <p className="text-[9px] text-zinc-500 mt-1.5 leading-normal font-medium">
                    * Como você é o Administrador do sistema, este saque é auto-aprovado imediatamente pela rede e enviado ao seu banco.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-350 hover:to-blue-500 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 transition-all font-sans uppercase tracking-wider"
                  >
                    <Wallet className="w-4 h-4" />
                    Executar Saque de Administração
                  </button>
                </div>
              </form>
            </section>

          </div>

          {/* Admin Payouts execution log history */}
          <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl font-semibold">
            <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Histórico de Execuções e Resgates do Administrador</h3>
                <p className="text-[10px] text-gray-500 dark:text-zinc-400">Rastreamento consolidado de saques efetuados do saldo institucional de 5%.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              {adminWithdrawalHistory.length === 0 ? (
                <div className="text-center py-12 space-y-1.5">
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Nenhum saque institucional efetuado ainda.</p>
                  <p className="text-[10px] text-zinc-600 max-w-md mx-auto leading-normal">
                    Seus ganhos operacionais por intermediação continuam acumulados com segurança na conta oficial COLDMART S.A.
                  </p>
                </div>
              ) : (
                <table className="w-full text-xs text-left text-gray-500 dark:text-zinc-400">
                  <thead className="bg-gray-50 dark:bg-zinc-900 text-[10px] text-zinc-400 font-black uppercase tracking-wider font-mono">
                    <tr>
                      <th className="px-6 py-3.5">Código Único</th>
                      <th className="px-6 py-3.5">Chave Pix Favorecida</th>
                      <th className="px-6 py-3.5">Valor do Resgate</th>
                      <th className="px-6 py-3.5">STATUS COLDMART S.A.</th>
                      <th className="px-6 py-3.5">Data de Liquidação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                    {adminWithdrawalHistory.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-900/40">
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-900 dark:text-white">{t.id}</td>
                        <td className="px-6 py-4 font-mono font-medium text-cyan-405 dark:text-cyan-450">{t.pixKey}</td>
                        <td className="px-6 py-4 font-mono font-bold text-rose-500">- R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-black uppercase text-[9px]">
                            LÍQUIDO / EFETUADO
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{new Date(t.date).toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

        </div>
      )}

    </div>
  );
};
