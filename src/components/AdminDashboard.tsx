import React from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product, TransferRequest, Sale } from '../types';
import { 
  TrendingUp, Users, Inbox, HeartHandshake, ShieldAlert, 
  Check, X, FileCheck, Landmark, RefreshCw, BarChart2, Briefcase
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
    rejectWithdrawal 
  } = useColdmart();

  // Dynamic statistics
  const totalGMV = sales.reduce((acc, current) => acc + current.amount, 0);
  const platformEarnings = sales.reduce((acc, current) => acc + (current.amount * 0.1), 0);
  const pendingProducts = products.filter(p => p.status === 'pending_approval');
  const pendingTransfers = transfers.filter(t => t.status === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Terminal Geral de Auditoria</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Visão corporativa consolidada, regulação de taxas, curadoria de produtos e liberação de pagamentos.</p>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Volume Geral SaaS (GMV)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {totalGMV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Vendas brutas totais transacionadas</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Taxa Coldmart Retida (10%)</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Landmark className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            R$ {platformEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Receita operacional líquida consolidada</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Aprovações de Infoprodutos</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Inbox className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {pendingProducts.length}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Produtos pendentes de validação técnica</span>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase">Total Contas Integradas</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-gray-950 dark:text-white font-mono">
            {users.length}
          </p>
          <span className="block text-[10px] text-zinc-400 leading-none">Usuários cadastrados no simulador</span>
        </div>
      </div>

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
              <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-12">
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
              <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-12">
                Nenhuma solicitação de saque de caixa pendente no momento.
              </p>
            ) : (
              pendingTransfers.map((t, idx) => (
                <div key={t.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Requerente comercial</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{t.userName}</p>
                      <p className="text-[10px] font-mono text-gray-500 mt-1">CHAVE PIX: <span className="font-bold">{t.pixKey}</span></p>
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
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-violet-500" />
            Vendas Gerais Consolidadas na Rede (Blockchain Audit)
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400">Auditoria criptográfica contínua das faturas e splits de comissões.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-500 dark:text-zinc-400">
            <thead className="bg-gray-50 dark:bg-zinc-900 text-[10px] text-zinc-400 font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID Venda</th>
                <th className="px-6 py-3.5">Produto faturado</th>
                <th className="px-6 py-3.5">Comprador</th>
                <th className="px-6 py-3.5">Valor Comércio</th>
                <th className="px-6 py-3.5">Split Plataforma (10%)</th>
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
                  <td className="px-6 py-4 font-mono text-emerald-500 font-semibold">+ R$ {(sale.amount * 0.1).toFixed(2)}</td>
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

    </div>
  );
};
