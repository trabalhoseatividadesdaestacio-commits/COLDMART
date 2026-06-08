import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { 
  DollarSign, Sparkles, HelpCircle, Coins, Share2, 
  ExternalLink, TrendingUp, Handshake, Check, AlertCircle, Landmark, ArrowRight, BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

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

  // Time Range Stats Filter State for Affiliate
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd' | 'all'>('30d');

  const mySales = sales.filter(s => s.affiliateId === currentUser.id && s.status === 'completed');

  // Helper date filtering & aggregation for Affiliate
  const filterSalesByRange = (items: typeof sales, range: typeof timeRange) => {
    const now = new Date();
    return items.filter(s => {
      const saleDate = new Date(s.date);
      if (range === '7d') {
        const diffDays = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (range === '30d') {
        const diffDays = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      }
      if (range === 'ytd') {
        return saleDate.getFullYear() === now.getFullYear();
      }
      return true; // all time
    });
  };

  const generateChartData = (items: typeof mySales, range: typeof timeRange) => {
    const dataMap: Record<string, { date: string, dateLabel: string, revenue: number, salesCount: number }> = {};
    const now = new Date();
    
    if (range === 'ytd') {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentMonth = now.getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        dataMap[String(i)] = {
          date: String(i),
          dateLabel: months[i],
          revenue: 0,
          salesCount: 0
        };
      }
      items.forEach(s => {
        const d = new Date(s.date);
        if (d.getFullYear() === now.getFullYear()) {
          const mIdx = d.getMonth();
          if (dataMap[String(mIdx)]) {
            dataMap[String(mIdx)].revenue += s.affiliateCommission;
            dataMap[String(mIdx)].salesCount += 1;
          }
        }
      });
      return Object.values(dataMap);
    }
    
    if (range === 'all') {
      // Group by Month-Year
      items.forEach(s => {
        const d = new Date(s.date);
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const key = `${months[d.getMonth()]}/${String(d.getFullYear()).substring(2)}`;
        if (!dataMap[key]) {
          dataMap[key] = {
            date: key,
            dateLabel: key,
            revenue: 0,
            salesCount: 0
          };
        }
        dataMap[key].revenue += s.affiliateCommission;
        dataMap[key].salesCount += 1;
      });
      return Object.values(dataMap);
    }
    
    let daysToGen = 30;
    if (range === '7d') daysToGen = 7;
    else if (range === '30d') daysToGen = 30;
    
    for (let i = daysToGen - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      dataMap[dateKey] = {
        date: dateKey,
        dateLabel: dayLabel,
        revenue: 0,
        salesCount: 0
      };
    }
    
    items.forEach(s => {
      const dateKey = s.date.split('T')[0];
      if (dataMap[dateKey]) {
        dataMap[dateKey].revenue += s.affiliateCommission;
        dataMap[dateKey].salesCount += 1;
      }
    });
    
    return Object.values(dataMap);
  };

  const filteredSalesForChart = filterSalesByRange(mySales, timeRange);
  const chartData = generateChartData(filteredSalesForChart, timeRange);

  const totalPeriodRevenue = filteredSalesForChart.reduce((acc, s) => acc + s.affiliateCommission, 0);
  const totalPeriodSales = filteredSalesForChart.length;
  const averageTicket = totalPeriodSales > 0 ? (totalPeriodRevenue / totalPeriodSales) : 0;

  const paymentCounts = filteredSalesForChart.reduce((acc, s) => {
    acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const favoritePayment = Object.entries(paymentCounts).sort((a,b) => Number(b[1]) - Number(a[1]))[0]?.[0] || 'Pix';
  const favoritePaymentLabel = favoritePayment === 'credit_card' ? 'Cartão' : favoritePayment === 'pix' ? 'Pix' : favoritePayment === 'boleto' ? 'Boleto' : 'PayPal';

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

      {/* Dynamic Sales Graphics & Filtering (Affiliate) */}
      <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-300">
        
        {/* Header containing Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-zinc-900 pb-5">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-500 animate-pulse" />
              Desempenho de Afiliação & Gráficos Comerciais
            </h3>
            <p className="text-[11px] text-zinc-550 dark:text-zinc-400">Dados consolidados de comissões e conversões atribuídas em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 self-stretch md:self-auto">
            {(['7d', '30d', 'ytd', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`flex-1 md:flex-initial text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all ${
                  timeRange === r
                    ? 'bg-white dark:bg-zinc-950 text-cyan-600 dark:text-cyan-400 shadow-sm border border-zinc-200/40 dark:border-zinc-800'
                    : 'text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-100 dark:text-zinc-400'
                }`}
              >
                {r === '7d' ? '7 Dias' : r === '30d' ? '30 Dias' : r === 'ytd' ? 'Este Ano' : 'Histórico'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Chart 1: Revenue (Area chart with Gradient) */}
          <div className="border border-zinc-100 dark:border-zinc-900/60 p-4 rounded-xl bg-zinc-50/20 dark:bg-zinc-950 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Minhas Comissões (R$)</p>
                <h4 className="font-extrabold text-lg text-gray-950 dark:text-white font-mono mt-0.5">
                  R$ {totalPeriodRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h4>
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full font-black uppercase font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Area
              </span>
            </div>
            
            <div className="h-64 w-full">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-zinc-400 italic">
                  Nenhum resgate ou venda atribuída computada neste período.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAffiliateRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15} />
                    <XAxis dataKey="dateLabel" stroke="#71717a" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '10px', fontFamily: 'Inter' }}
                      itemStyle={{ color: '#22c55e', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                      formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Comissão Líquida']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAffiliateRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Quantity (Bar chart for conversions) */}
          <div className="border border-zinc-100 dark:border-zinc-900/60 p-4 rounded-xl bg-zinc-50/20 dark:bg-zinc-950 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Conversões Completas</p>
                <h4 className="font-extrabold text-lg text-gray-950 dark:text-white font-mono mt-0.5">
                  {totalPeriodSales} Vendas
                </h4>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase font-mono">
                Coluna
              </span>
            </div>
            
            <div className="h-64 w-full">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-zinc-400 italic">
                  Nenhuma conversão computada no intervalo selecionado.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15} />
                    <XAxis dataKey="dateLabel" stroke="#71717a" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '10px', fontFamily: 'Inter' }}
                      itemStyle={{ color: '#818cf8', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                      formatter={(val: number) => [`${val} Indicação(ões)`, 'Volume Vendas']}
                    />
                    <Bar dataKey="salesCount" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

        {/* Detailed stats sub-banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-900 p-4 rounded-xl">
          <div className="space-y-0.5 pl-3 border-l-2 border-cyan-500">
            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Média Por Comissão</span>
            <span className="block text-xs font-black text-gray-900 dark:text-zinc-100 font-mono">R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="space-y-0.5 pl-3 border-l-2 border-indigo-500">
            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Método Mais Usado por Clientes</span>
            <span className="block text-xs font-black text-gray-900 dark:text-zinc-100">{favoritePaymentLabel}</span>
          </div>

          <div className="space-y-0.5 pl-3 border-l-2 border-emerald-500">
            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Taxa de Estorno de Clientes</span>
            <span className="block text-xs font-black text-gray-900 dark:text-zinc-100 font-mono">0.0% <span className="text-[10px] text-emerald-500 font-normal">(Saúde Excelente)</span></span>
          </div>
        </div>

      </section>

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
