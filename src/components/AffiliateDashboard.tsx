import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { 
  DollarSign, Sparkles, HelpCircle, Coins, Share2, 
  ExternalLink, TrendingUp, Handshake, Check, AlertCircle, Landmark, ArrowRight
} from 'lucide-react';

interface AffiliateDashboardProps {
  onNavigateToMarketplace: () => void;
  onNavigateToCheckoutWithAffiliate: (productId: string, code: string) => void;
}

export const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ 
  onNavigateToMarketplace,
  onNavigateToCheckoutWithAffiliate
}) => {
  const { affiliations, currentUser, requestWithdrawal, transfers, sales } = useColdmart();
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100.00);
  const [pixKey, setPixKey] = useState(currentUser?.email || '');
  const [copiedCodeMap, setCopiedCodeMap] = useState<Record<string, boolean>>({});
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');

  if (!currentUser) return null;

  // Filter affiliate specific elements
  const myAffiliations = affiliations.filter(a => a.affiliateId === currentUser.id);
  const totalClicks = myAffiliations.reduce((acc, a) => acc + a.clicks, 0);
  const totalSales = myAffiliations.reduce((acc, a) => acc + a.salesCount, 0);
  const totalEarnings = myAffiliations.reduce((acc, a) => acc + a.earnings, 0);
  const myPendingTransfers = transfers.filter(t => t.userId === currentUser.id);

  // Conversion rate
  const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0';

  const handleCopyLink = (code: string) => {
    const trackingUrl = `${window.location.origin}/checkout?prod=main&aff=${code}&shared=true`;
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopiedCodeMap(prev => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopiedCodeMap(prev => ({ ...prev, [code]: false }));
      }, 2000);
    });
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

  // Simulating traffic click on link
  const simulateClickOnLink = (productId: string, code: string, affId: string) => {
    // Increment clicks locally in state context
    onNavigateToCheckoutWithAffiliate(productId, code);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Portal do Afiliado</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Promova links exclusivos de produtos campeões de vendas e receba comissões automáticas.</p>
        </div>
        <button
          onClick={onNavigateToMarketplace}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer transition-all"
        >
          <Handshake className="w-4 h-4" />
          <span>Explorar Marketplace</span>
        </button>
      </div>

      {/* Stats indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Comissões Recebidas</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Comissões faturadas em sua conta</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Cliques nos Links</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><ExternalLink className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {totalClicks}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Visitas únicas registradas</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Vendas Atribuídas</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Handshake className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {totalSales}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Conversões completadas por indicação</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Conversão Média</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {conversionRate}%
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Cliques convertidos em faturamento</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Affiliate links tracker Left */}
        <section className="lg:col-span-7 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-600" />
              Estações de Divulgação Ativas
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">Códigos e links rastreáveis que distribuem e calculam comissões na rede.</p>
          </div>

          <div className="p-5 space-y-5 divide-y divide-gray-100 dark:divide-zinc-950">
            {myAffiliations.length === 0 ? (
              <div className="text-center py-12">
                <Share2 className="w-8 h-8 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-zinc-400">Você ainda não se afiliou a infoprodutos.</p>
                <button onClick={onNavigateToMarketplace} className="text-blue-500 font-bold text-xs hover:underline mt-1 cursor-pointer">Analisar catálogo de produtos</button>
              </div>
            ) : (
              myAffiliations.map((aff, idx) => (
                <div key={aff.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{aff.productTitle}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 dark:text-zinc-550 mt-1">
                        <span>PREÇO PROD: R$ {aff.productPrice.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-orange-500">INDICAÇÃO: {aff.commissionPercent}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400">Meus Ganhos</p>
                      <p className="font-black text-sm text-emerald-500 font-mono">
                        R$ {aff.earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Click/Sales Metrics for this item */}
                  <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/40 text-center text-xs border border-gray-150 dark:border-zinc-850">
                    <div>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase">Cliques</p>
                      <p className="font-bold text-gray-900 dark:text-white font-mono">{aff.clicks}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase">Vendas Atribuídas</p>
                      <p className="font-bold text-gray-900 dark:text-white font-mono">{aff.salesCount}</p>
                    </div>
                  </div>

                  {/* Tracking link launcher controls */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1.5">
                    <button
                      onClick={() => handleCopyLink(aff.linkCode)}
                      className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer border border-gray-200 dark:border-zinc-800 transition-colors"
                    >
                      {copiedCodeMap[aff.linkCode] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" /> Copiar Link Promocional
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => simulateClickOnLink(aff.productId, aff.linkCode, aff.affiliateId)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
                      title="Registra um clique no link e redireciona direto para ver o checkout do produto!"
                    >
                      <span>Divulgar / Testar Link (Simular Tráfego)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Bank Withdraw Right panel */}
        <div className="lg:col-span-5 space-y-6">
          
          <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-display font-black text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-violet-500" />
              Solicitar Resgate de Comissões (PIX)
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Insira sua chave Pix e transfira parte ou a totalidade do seu saldo disponível para a sua conta real bancária.</p>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Qual o valor do saque? (R$)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">R$</span>
                  <input
                    type="number"
                    required
                    min={10}
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1 font-mono">CHAVE PIX (E-MAIL, CPF OU CHAVE ALEATÓRIA)</label>
                <input
                  type="text"
                  required
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Seu CPF, e-mail ou chave Pix"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:text-white font-mono"
                />
              </div>

              {withdrawSuccessMsg && (
                <p className="text-[10px] p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-semibold flex items-start gap-1">
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {withdrawSuccessMsg}
                </p>
              )}
              {withdrawErrorMsg && (
                <p className="text-[10px] p-2.5 rounded-lg bg-rose-500/10 text-rose-600 font-semibold flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {withdrawErrorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <span>Solicitar Saque do Saldo</span>
              </button>
            </form>
          </section>

          {/* Transfers Log */}
          <section className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Extrato de Resgates Recentes</h3>
            
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {myPendingTransfers.length === 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 py-4 text-center">Nenhum resgate bancário solicitado no histórico.</p>
              ) : (
                myPendingTransfers.map((req) => (
                  <div key={req.id} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-700 dark:text-zinc-300">Resgate Pix</p>
                      <p className="text-[9px] text-zinc-400 font-mono mt-0.5">{new Date(req.date).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-gray-905 dark:text-white">R$ {req.amount.toFixed(2)}</p>
                      <span className={`inline-block text-[9px] font-bold ${
                        req.status === 'approved' || req.status === 'completed'
                          ? 'text-emerald-500' 
                          : req.status === 'rejected' 
                          ? 'text-rose-500' 
                          : 'text-amber-500'
                      }`}>
                        {req.status === 'approved' || req.status === 'completed' ? 'PAGO / CONCLUÍDO' : req.status === 'rejected' ? 'REJEITADO' : 'AGUARDANDO APROVAÇÃO'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
};
