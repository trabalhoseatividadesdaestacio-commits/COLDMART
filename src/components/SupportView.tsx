import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Ticket, TicketMessage } from '../types';
import { 
  PlusCircle, Inbox, Send, ShieldAlert, Sparkles, MessageSquare, 
  CheckCircle2, LifeBuoy, AlertCircle, HelpCircle, ChevronRight, Check
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { tickets, createSupportTicket, replyToTicket, resolveTicket, currentUser } = useColdmart();
  
  // States
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCat, setTicketCat] = useState<'payment' | 'access' | 'partnership' | 'other'>('payment');
  
  // Chat input
  const [chatInput, setChatInput] = useState('');

  // Derive up-to-date ticket reactive state from global tickets store
  const currentTicket = selectedTicket ? (tickets.find(t => t.id === selectedTicket.id) || selectedTicket) : null;

  if (!currentUser) return null;

  // Filter user specific tickets (Admins see ALL tickets, others see only THEIR tickets)
  const filteredTickets = currentUser.role === 'admin' 
    ? tickets 
    : tickets.filter(t => t.userEmail === currentUser.email);

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      alert('Favor preencher o campo de Assunto e Mensagem do ticket.');
      return;
    }

    createSupportTicket(ticketSubject, ticketCat, ticketMessage);
    
    setTicketSubject('');
    setTicketMessage('');
    setShowCreateForm(false);
    
    alert('Seu ticket foi aberto com sucesso! Nosso bot de inteligência artificial de suporte e curadoria realizou o primeiro atendimento. Verifique na lista.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentTicket) return;

    // Check if user is admin replying, mark as support sender
    const senderRole = currentUser.role === 'admin' ? 'support' : 'user';
    replyToTicket(currentTicket.id, chatInput, senderRole);
    
    setChatInput('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 dark:bg-blue-900 border border-blue-500/10 text-blue-500"><LifeBuoy className="w-5 h-5" /></span>
            Central de Ajuda & IA Suporte
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Esclareça dúvidas financeiras, solicite revisões operacionais ou converse diretamente com o ColdBot AI.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow shadow-blue-500/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Abrir Novo Ticket</span>
        </button>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left list Column (4 Columns) */}
        <section className="lg:col-span-4 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-mono">Meus Chamados Recentes</h3>
          
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 py-12">Você não possui chamados abertos.</p>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = currentTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTicket(t); setShowCreateForm(false); }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/15 dark:bg-blue-950/20 shadow' 
                        : 'border-zinc-150 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-zinc-150 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono font-bold uppercase rounded px-1.5 py-0.5 mb-1 select-none">
                        {t.category}
                      </span>
                      <span className={`text-[9.5px] font-bold ${t.status === 'resolved' ? 'text-emerald-500' : 'text-blue-500 animate-pulse'}`}>
                        {t.status === 'resolved' ? 'RESPONDIDO / FECHADO' : 'AGUARDANDO RETORNO'}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-gray-950 dark:text-white line-clamp-1">{t.subject}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-mono truncate max-w-[200px]">Autor: {t.userName}</p>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Right workspace view Column (8 Columns) */}
        <main className="lg:col-span-8">
          
          {/* Create ticket Section */}
          {showCreateForm ? (
            <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-in zoom-in-95 duration-150">
              <div className="border-b border-gray-205 dark:border-zinc-900 pb-4">
                <h3 className="font-bold text-base text-gray-950 dark:text-white">Abrir Novo Ticket de Suporte</h3>
                <p className="text-xs text-gray-500 mt-1">Especifique sua necessidade para que nossa equipe técnica apoie você o quanto antes.</p>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Qual o assunto central?</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Ex: Minha comissão de afiliado do SaaS Builder não constou"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1 block">Classificação comercial</label>
                    <select
                      value={ticketCat}
                      onChange={(e) => setTicketCat(e.target.value as any)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:text-white cursor-pointer"
                    >
                      <option value="payment">Financeiro / Pagamentos</option>
                      <option value="access">Acesso de Cursos / Alunos</option>
                      <option value="partnership">Parcerias / Afiliados</option>
                      <option value="other">Outros assuntos gerais</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1 font-mono">Tire suas dúvidas ou descreva o ocorrido</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva detalhadamente com e-mail do portador se aplicável, data de pagamento e anexos recomendados..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-900 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-zinc-150 text-gray-800 dark:bg-zinc-900 dark:text-zinc-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Open Ticket Now
                  </button>
                </div>
              </form>
            </section>
          ) : currentTicket ? (
            
            /* Ticket Active Conversation Frame */
            <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[480px]">
              
              {/* Header */}
              <div className="p-5 border-b border-gray-150 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/30 flex justify-between items-center gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-zinc-150 dark:bg-zinc-800 text-zinc-650 px-2 py-0.5 rounded font-mono font-bold uppercase">{currentTicket.category}</span>
                    <span className="text-xs text-gray-400">#CM-{currentTicket.id.substring(5, 11)}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-950 dark:text-white truncate mt-1 leading-none">{currentTicket.subject}</h4>
                </div>
                {currentTicket.status === 'open' && (
                  <button
                    onClick={() => {
                      resolveTicket(currentTicket.id);
                      setSelectedTicket(prev => prev ? { ...prev, status: 'resolved' } : null);
                      alert('Este chamado foi marcado como resolvido e encerrado.');
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Resolver Chamado
                  </button>
                )}
              </div>

              {/* Chat timeline message area */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[340px] pr-2">
                
                {currentTicket.messages.map((m) => {
                  const isUser = m.sender === 'user';
                  const isBot = m.sender === 'ai';
                  
                  return (
                    <div 
                      key={m.id} 
                      className={`flex gap-3 max-w-[80%] ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border select-none ${
                        isUser 
                          ? 'bg-blue-600 text-white' 
                          : isBot 
                          ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white' 
                          : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {isUser ? 'U' : isBot ? <Sparkles className="w-4 h-4 fill-white" /> : 'S'}
                      </div>

                      {/* Msg text */}
                      <div className={`p-3.5 rounded-2xl text-xs space-y-1 block leading-relaxed ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : isBot 
                          ? 'bg-cyan-50/95 border border-cyan-300 text-gray-950 dark:bg-[#15233a]/90 dark:border-cyan-500/55 dark:text-white rounded-tl-none font-medium shadow-md' 
                          : 'bg-zinc-50 border border-gray-150 dark:bg-zinc-900/40 dark:border-zinc-850 rounded-tl-none text-slate-800 dark:text-zinc-200'
                      }`}>
                        <div className="flex justify-between items-center gap-4 text-[9.5px] font-mono mb-1 leading-none font-bold">
                          <span className={isBot ? 'text-cyan-700 dark:text-cyan-300 uppercase tracking-wider font-extrabold flex items-center gap-1' : 'opacity-75'}>
                            {isBot && <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />}
                            {isUser ? 'Você' : isBot ? 'ColdBot AI Tutor' : 'Staff de Suporte'}
                          </span>
                          <span className="opacity-70">{new Date(m.date).toLocaleTimeString('pt-BR')}</span>
                        </div>
                        <p className={isBot ? 'text-gray-950 dark:text-slate-50 font-semibold text-xs md:text-[13px] leading-relaxed mt-1.5' : 'text-slate-800 dark:text-zinc-200'}>
                          {m.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Chat replying inputs */}
              <div className="p-4 border-t border-gray-150 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-950 shrink-0">
                {currentTicket.status === 'resolved' ? (
                  <p className="text-center font-bold text-zinc-400 py-2 font-mono text-[10px] tracking-wider uppercase">ESTE TICKET ESTÁ FECHADO. ABRA OUTRO PARA NOVAS SOLICITAÇÔES.</p>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Responda ou complemente seu questionamento..."
                      className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 dark:text-white shadow-inner"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl cursor-pointer"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                )}
              </div>

            </section>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl">
              <MessageSquare className="w-10 h-10 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Selecione ou crie um ticket de auxílio</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Clique nas solicitações da barra lateral esquerda para acompanhar conversas ativas ou criar novas instâncias!
              </p>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
