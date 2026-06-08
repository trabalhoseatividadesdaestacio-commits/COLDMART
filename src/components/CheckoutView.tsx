import React, { useState, useEffect, useMemo } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product } from '../types';
import { 
  CreditCard, QrCode, ClipboardCheck, ArrowRight, ArrowLeft, ShieldCheck, 
  HelpCircle, Sparkles, Tag, Check, CheckCircle2, Ticket, AlertCircle, Star
} from 'lucide-react';

interface CheckoutViewProps {
  productId: string;
  affiliateCode?: string;
  onPaymentSuccess: () => void;
  onNavigateToMarketplace: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  productId,
  affiliateCode,
  onPaymentSuccess,
  onNavigateToMarketplace
}) => {
  const { products, processPurchase, currentUser, submitProductReview } = useColdmart();
  
  // Review form state
  const [reviewRating, setReviewRating] = useState<number | undefined>(undefined);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setReviewerName(currentUser.name);
    }
  }, [currentUser]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === undefined && !reviewComment.trim()) {
      alert('Selecione uma nota em estrelas ou digite um comentário antes de enviar.');
      return;
    }
    submitProductReview(productId, {
      userName: reviewerName.trim() || 'Comprador Anonimizado',
      rating: reviewRating,
      comment: reviewComment.trim() || undefined
    });
    setReviewSuccessMessage(true);
    setReviewComment('');
    setReviewRating(undefined);
    setTimeout(() => {
      setReviewSuccessMessage(false);
    }, 4500);
  };
  
  // Sincronizar produtos de forma puramente derivada para evitar o flash irritante de erro na renderização inicial
  const targetProduct = useMemo(() => products.find(p => p.id === productId) || null, [products, productId]);
  const bumpProduct = useMemo(() => products.find(p => p.id !== productId && p.status === 'active') || null, [products, productId]);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  
  // Card Inputs state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFocused, setCardFocused] = useState(false); // Used to simulate back-side of CC (CVV focus)

  // Active Urgency Countdown Timer state
  const [urgencyTime, setUrgencyTime] = useState(599); // 9 min 59 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setUrgencyTime(prev => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUrgencyTime = () => {
    const min = Math.floor(urgencyTime / 60);
    const sec = urgencyTime % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Order Bump state
  const [orderBumpEnabled, setOrderBumpEnabled] = useState(false);

  // Status simulation
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [pixTimeLeft, setPixTimeLeft] = useState(300); // 5 min
  const [copiedPix, setCopiedPix] = useState(false);
  const [createdSaleId, setCreatedSaleId] = useState('');

  // Calcular o valor total a pagar de forma síncrona
  const finalTotalToPay = useMemo(() => {
    if (!targetProduct) return 0;
    let total = targetProduct.price;
    if (couponApplied) total = total * 0.9;
    if (orderBumpEnabled && bumpProduct) total += bumpProduct.price;
    return Number(total.toFixed(2));
  }, [targetProduct, couponApplied, orderBumpEnabled, bumpProduct]);

  // Timer simulation for Pix
  useEffect(() => {
    if (paymentMethod !== 'pix' || checkoutStatus !== 'idle') return;
    const interval = setInterval(() => {
      setPixTimeLeft(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod, checkoutStatus]);

  const formatPixTime = () => {
    const min = Math.floor(pixTimeLeft / 60);
    const sec = pixTimeLeft % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'COLD10') {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) {
      alert('Favor preencher o Nome e o E-mail de recebimento.');
      return;
    }

    setCheckoutStatus('processing');

    setTimeout(() => {
      const res = processPurchase({
        buyerName,
        buyerEmail,
        productId,
        paymentMethod,
        couponCode: couponApplied ? 'COLD10' : undefined,
        affiliateCode: affiliateCode || undefined,
        orderBump: orderBumpEnabled,
        orderBumpProductId: bumpProduct?.id || undefined
      });

      if (res.success) {
        setCreatedSaleId(res.saleId);
        setCheckoutStatus('success');
      } else {
        setCheckoutStatus('idle');
        alert('Erro ao processar transação financeira simulada.');
      }
    }, 1500);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText('00020126430014BR.GOV.BCB.PIX0111999888777665204000053039865407000.005802BR5915ColdmartSaaS6009SAOPAULO62070503***6304ED2A');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  // Se os produtos estiverem completamente vazios (por exemplo, carregando do Firebase), mostra um carregamento suave
  if (products.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Carregando detalhes do checkout...</p>
      </div>
    );
  }

  if (!targetProduct) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-zinc-400">Produto selecionado não está ativo ou não foi localizado.</p>
        <button onClick={onNavigateToMarketplace} className="text-blue-500 hover:underline mt-2 text-xs font-semibold">
          Voltar ao Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {checkoutStatus === 'success' ? (
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Pagamento Confirmado no Simulador!</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              Obrigado pela compra, <strong>{buyerName}</strong>! Seus e-mails e tokens de acessos foram disparados eletronicamente para <strong>{buyerEmail}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 text-left space-y-2 font-mono text-xs text-gray-500 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>CÓDIGO DE TRANSAÇÃO:</span>
              <span className="font-bold text-gray-900 dark:text-white">{createdSaleId}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-emerald-500 font-bold">COMPLETADO E CONCILIADO</span>
            </div>
            {affiliateCode && (
              <div className="flex justify-between border-t border-dashed border-gray-200 dark:border-zinc-850 pt-2 text-[10px] text-zinc-500">
                <span>AFILIADO ATRIBUÍDO:</span>
                <span className="text-amber-500 font-bold uppercase">{affiliateCode}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToMarketplace}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-200 font-bold py-3.5 rounded-xl text-xs cursor-pointer"
            >
              Voltar à vitrine
            </button>
            <button
              onClick={onPaymentSuccess}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Navegar à Área de Membros
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Form Left */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header detail */}
            <div>
              <button 
                onClick={onNavigateToMarketplace} 
                className="text-xs text-gray-400 dark:text-zinc-500 hover:text-blue-500 hover:underline mb-1 flex items-center gap-1 cursor-pointer"
              >
                ← Escolher outro produto
              </button>
              <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Checkout Seguro de Compra</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Insira suas informações de faturamento e compense com simulação instantânea.</p>
            </div>

            {/* Urgency Scarcity Notification Bar */}
            <div className="bg-rose-500/10 border border-rose-500/15 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-550 dark:text-rose-400 select-none shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500 shrink-0">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="font-extrabold text-[11px] tracking-wider uppercase">Oferta por Tempo Limitado! Seu carrinho expira em breve</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 truncate">Não perca o bônus exclusivo de primeiro faturamento.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[9.5px] px-2 py-0.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 rounded-md font-bold font-mono uppercase tracking-wide">
                  Apenas 3 Vagas Restantes
                </span>
                <span className="text-xs font-black font-mono bg-rose-600 text-white px-2.5 py-1.5 rounded-lg shadow-md shrink-0">
                  {formatUrgencyTime()}
                </span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              
              {/* Form details section */}
              <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center font-bold">1</span>
                  Dados Cadastrais
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">E-mail para Acesso</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Ex: joao@gmail.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-xl flex items-start gap-2 border border-blue-100/30">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                    Você receberá uma notificação do Cloud Run de confirmação de faturamento e link de ativação da Área de Membros neste e-mail correspondente.
                  </p>
                </div>
              </div>

              {/* Payment methods choice */}
              <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center font-bold">2</span>
                  Forma de Pagamento
                </h3>

                {/* Tabs selection */}
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('pix'); setCardFocused(false); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'pix' 
                        ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 shadow-md border border-gray-250 dark:border-zinc-800' 
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    Pix (Rápido)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'credit_card' 
                        ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 shadow-md border border-gray-250 dark:border-zinc-800' 
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('boleto'); setCardFocused(false); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'boleto' 
                        ? 'bg-white dark:bg-zinc-950 text-blue-600 dark:text-cyan-400 shadow-md border border-gray-250 dark:border-zinc-800' 
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    Boleto Bancário
                  </button>
                </div>

                {/* Method details screens */}
                <div className="pt-2">
                  {paymentMethod === 'pix' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-gray-150 dark:border-zinc-850">
                        {/* Interactive QRCode Graphic */}
                        <div className="p-3 bg-white rounded-xl shadow-lg border border-zinc-250 dark:border-zinc-700 shrink-0 select-none relative group">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=COLDMART_PIX_${finalTotalToPay}`}
                            alt="QRCode Pix"
                            className="w-28 h-28 mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center" />
                        </div>
                        
                        <div className="space-y-2 flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            Liberado em até 3 minutos!
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                            Pague via aplicativo bancário do seu celular. O QR Code vence em <strong className="text-rose-500 font-mono">{formatPixTime()}</strong>.
                          </p>
                          <button
                            type="button"
                            onClick={copyPixCode}
                            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 mx-auto sm:mx-0 cursor-pointer"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 text-blue-500" />
                            {copiedPix ? 'Copiado para área!' : 'Copiar Código Pix Copia-e-Cola'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-gray-150 dark:border-zinc-850 space-y-3">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Compensação em até 48 horas úteis</p>
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400">O boleto será emitido eletronicamente pela instituição bancária integradora.</p>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-zinc-950 rounded-lg font-mono text-[10px] text-zinc-500 overflow-x-auto border border-zinc-200 dark:border-zinc-850 flex items-center justify-between select-all group">
                        <span>34191.79001 01043.513184 91020.150008 7 900200000{Math.floor(finalTotalToPay)}</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'credit_card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      {/* CC UI Form */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">NÚMERO DO CARTÃO</label>
                          <input
                            type="text"
                            required={paymentMethod === 'credit_card'}
                            value={cardNumber}
                            onFocus={() => setCardFocused(false)}
                            onChange={(e) => {
                              // Auto spacing
                              const raw = e.target.value.replace(/\D/g, '');
                              const formatted = raw.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(formatted);
                            }}
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">NOME COMO NO CARTÃO</label>
                          <input
                            type="text"
                            required={paymentMethod === 'credit_card'}
                            value={cardName}
                            onFocus={() => setCardFocused(false)}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            placeholder="MARTA S SILVA"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">DATA EXPIRAÇÃO</label>
                            <input
                              type="text"
                              required={paymentMethod === 'credit_card'}
                              value={cardExpiry}
                              onFocus={() => setCardFocused(false)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                let formatted = raw.slice(0, 4);
                                if (formatted.length >= 2) {
                                  formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                                }
                                setCardExpiry(formatted);
                              }}
                              placeholder="MM/AA"
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">CÓDIGO CVV</label>
                            <input
                              type="password"
                              required={paymentMethod === 'credit_card'}
                              value={cardCvv}
                              onFocus={() => setCardFocused(true)}
                              onBlur={() => setCardFocused(false)}
                              onChange={(e) => setCardCvv(e.target.value.slice(0, 4).replace(/\D/g, ''))}
                              placeholder="***"
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mirroring Physical Credit Card Component */}
                      <div className="relative w-full h-40 max-w-[280px] mx-auto perspective-1000 select-none">
                        <div 
                          className={`w-full h-full relative rounded-2xl p-5 border border-white/10 text-white shadow-2xl transition-all duration-500 transform-style-3d ${
                            cardFocused ? 'rotate-y-180 bg-zinc-950' : 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-zinc-900 bg-shine'
                          }`}
                        >
                          {/* FRONT SIDE */}
                          {!cardFocused ? (
                            <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs uppercase tracking-widest font-mono text-cyan-400">COLDMART COGNITIVE</span>
                                <div className="w-8 h-6 bg-amber-500/10 rounded border border-amber-500/20 flex items-center justify-center font-bold text-[8px] text-amber-500">CHIP</div>
                              </div>
                              <p className="text-sm font-bold tracking-[0.16em] font-mono py-2 truncate">
                                {cardNumber || '•••• •••• •••• ••••'}
                              </p>
                              <div className="flex justify-between text-[10px] font-mono">
                                <div>
                                  <span className="block text-[7px] text-gray-400">TITULAR</span>
                                  <span className="truncate max-w-[120px] inline-block font-semibold">{cardName || 'MARTA S SILVA'}</span>
                                </div>
                                <div>
                                  <span className="block text-[7px] text-gray-400">EXPIRA</span>
                                  <span className="font-semibold">{cardExpiry || '12/28'}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* BACK SIDE */
                            <div className="absolute inset-0 py-5 flex flex-col justify-between backface-hidden rotate-y-180">
                              <div className="w-full h-8 bg-zinc-800 mt-2" />
                              <div className="px-5">
                                <div className="flex justify-end items-center gap-2">
                                  <span className="text-[7px] text-zinc-400">ASSINATURA AUTORIZADA</span>
                                  <div className="bg-white text-zinc-900 font-mono text-xs px-2.5 py-0.5 rounded italic font-bold">
                                    {cardCvv || '•••'}
                                  </div>
                                </div>
                              </div>
                              <p className="text-[8px] text-zinc-500 text-center px-4 leading-none">
                                Protegido sob os padrões globais PCI Compliance da Coldmart. Transação simulada localmente de forma privada.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Order Bump Section */}
              {bumpProduct && (
                <div className="bg-gradient-to-tr from-amber-500/5 to-indigo-500/5 dark:from-amber-500/[0.02] dark:to-indigo-500/[0.02] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden space-y-3">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] px-3 py-1 font-black rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white fill-white animate-pulse" />
                    BUMP OFERTA ÚNICA
                  </div>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderBumpEnabled}
                      onChange={(e) => setOrderBumpEnabled(e.target.checked)}
                      className="mt-1 text-blue-600 border-zinc-200 dark:border-zinc-800 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1 pr-12 space-y-1">
                      <p className="font-bold text-xs text-gray-950 dark:text-white flex items-center gap-1.5 leading-none">
                        Levar também: {bumpProduct.title}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                        {bumpProduct.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          Por apenas R$ {bumpProduct.price.toFixed(2)}
                        </span>
                        <span className="line-through text-[10px] text-zinc-400">
                          De R$ {(bumpProduct.price * 1.8).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Actions Grid: Acquire product or Go Back */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onNavigateToMarketplace}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-200 font-bold py-4 px-6 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para a Página Anterior
                </button>
                <button
                  type="submit"
                  disabled={checkoutStatus === 'processing'}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-indigo-600/50 text-white font-bold py-4 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 cursor-pointer active:scale-[0.99] transition-all"
                >
                  {checkoutStatus === 'processing' ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Aguarde, processando compensação...
                    </>
                  ) : (
                    <>
                      Concluir Compra Segura • R$ {finalTotalToPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Dynamic Product Reviews Feed & Evaluation Form */}
            <div className="mt-8 border-t border-gray-150 dark:border-zinc-900 pt-6 space-y-6">
              
              {/* Reviews Header and summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    Depoimentos & Avaliações do Produto
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Total acumulado de feedbacks deixados por nossos alunos</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 rounded-xl text-xs font-bold shrink-0">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-amber-550 dark:text-amber-400 font-mono text-sm">{targetProduct.rating > 0 ? targetProduct.rating : 'Sem Notas'}</span>
                  <span className="text-gray-400 dark:text-zinc-500 font-normal">({targetProduct.ratingCount || 120} avaliações)</span>
                </div>
              </div>

              {/* Combined lists of custom product reviews + beautiful fallbacks */}
              <div className="space-y-4">
                {(() => {
                  const userAddedReviews = targetProduct.reviews || [];
                  const preloadedReviews = [
                    {
                      id: 'def_1',
                      userName: 'Rômulo Albuquerque',
                      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                      rating: 5,
                      comment: 'Sensacional! O processamento do Pix foi instantâneo, os materiais vieram todos certinhos e em PDF. A plataforma é extremamente profissional e rápida.',
                      date: '02/06/2026'
                    },
                    {
                      id: 'def_2',
                      userName: 'Karina S. Gouveia',
                      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                      rating: 5,
                      comment: 'O suporte com o Tutor AI tirou minhas dúvidas de PostgreSQL e CORS em menos de 2 minutos. Com certeza voltarei a comprar os novos lançamentos daqui!',
                      date: '05/06/2026'
                    }
                  ];
                  
                  const displayReviews = [...userAddedReviews, ...preloadedReviews];
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {displayReviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-gray-150 dark:border-zinc-850 shadow-sm flex gap-3 text-left">
                          <img 
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                            alt={rev.userName} 
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-gray-900 dark:text-zinc-200 truncate">{rev.userName}</span>
                              <span className="text-[9px] text-gray-400 font-mono shrink-0">{rev.date}</span>
                            </div>
                            
                            {/* Stars rating rendering (ONLY IF exists, since rating is optional) */}
                            {rev.rating !== undefined && rev.rating > 0 ? (
                              <div className="flex items-center gap-0.5 py-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    className={`w-3 h-3 ${s <= (rev.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-gray-300 dark:text-zinc-700'}`} 
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="py-0.5">
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 font-medium font-mono uppercase tracking-wider inline-block">
                                  Apenas Comentário
                                </span>
                              </div>
                            )}

                            {/* Comment text (ONLY IF exists, since comment is optional) */}
                            {rev.comment ? (
                              <p className="text-[11px] text-gray-650 dark:text-zinc-400 leading-normal italic line-clamp-3">
                                "{rev.comment}"
                              </p>
                            ) : (
                              <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-normal italic">
                                Deixou uma nota de {rev.rating} estrelas sem comentário escrito.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Evaluation Interactive Form */}
              <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-gray-150 dark:border-zinc-850 rounded-2xl p-5 space-y-4 text-left">
                <div>
                  <h5 className="font-extrabold text-xs text-gray-950 dark:text-white uppercase tracking-wider">Deixe Sua Avaliação</h5>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 text-slate-400">Insira sua nota de 1 a 5 estrelas e/ou escreva um comentário sobre o produto (ambos opcionais).</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Seu Nome para exibição</label>
                      <input 
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Ex: Marta S. Silva"
                        className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    {/* Highly interactive Star Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.55">Avaliação em estrelas (opcional)</label>
                      <div className="flex items-center gap-1.5 h-8">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isGold = hoveredStar !== null ? star <= hoveredStar : star <= (reviewRating || 0);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                if (reviewRating === star) {
                                  setReviewRating(undefined);
                                } else {
                                  setReviewRating(star);
                                }
                              }}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                              title={`${star} Estrelas`}
                            >
                              <Star 
                                className={`w-5 h-5 transition-all ${
                                  isGold 
                                    ? 'fill-amber-500 text-amber-500' 
                                    : 'text-gray-300 dark:text-zinc-700 hover:text-amber-400'
                                }`} 
                              />
                            </button>
                          );
                        })}
                        
                        {/* Status label */}
                        <span className="text-[10px] font-bold font-mono text-zinc-500 ml-2">
                          {reviewRating ? `${reviewRating} Estrelas` : 'Sem Nota'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Comment Input Textarea */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Seu Comentário ou Crítica (opcional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Fale um pouco sobre o conteúdo do curso, facilidade de compra, etc..."
                      className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none dark:text-white resize-none"
                    />
                  </div>

                  {/* Feedback success highlight */}
                  {reviewSuccessMessage && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 shrink-0" /> Sua avaliação foi registrada e adicionada com sucesso!
                    </div>
                  )}

                  {/* Quick Submit button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleReviewSubmit}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/5 hover:shadow-blue-500/10 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Deixar Avaliação
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Checkout Invoice sidebar Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-32">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-150 dark:border-zinc-900 pb-3">Resumo da Fatura</h3>

              {/* Product Cover and Pricing breakdown */}
              <div className="flex gap-3">
                <img 
                  src={targetProduct.image} 
                  alt={targetProduct.title} 
                  className="w-16 h-12 object-cover rounded-lg bg-zinc-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{targetProduct.title}</h4>
                  <p className="text-[10px] text-zinc-400">{targetProduct.creatorName}</p>
                  <span className="inline-block mt-1 text-[10px] bg-zinc-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 px-2 py-0.5 rounded font-medium">Original</span>
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">R$ {targetProduct.price.toFixed(2)}</span>
              </div>

              {/* Bump section addition */}
              {orderBumpEnabled && bumpProduct && (
                <div className="flex gap-3 p-2.5 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/[0.01]">
                  <img 
                    src={bumpProduct.image} 
                    alt={bumpProduct.title} 
                    className="w-12 h-9 object-cover rounded bg-zinc-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{bumpProduct.title}</p>
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider leading-none">Order Bump</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">R$ {bumpProduct.price.toFixed(2)}</span>
                </div>
              )}

              {/* Coupons field */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-blue-500" />
                  Cupom de Desconto
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Digite COLD10"
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[10px] font-semibold px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>

                {couponApplied && (
                  <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5 mt-1">
                    <Check className="w-3 h-3" /> Cupom COLD10 (10% OFF) aplicado com sucesso!
                  </p>
                )}
                {couponError && (
                  <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-0.5 mt-1">
                     Cupom inválido ou expirado.
                  </p>
                )}
              </div>

              {/* Total Billing Calculations */}
              <div className="space-y-2 pt-4 border-t border-gray-150 dark:border-zinc-900 text-xs shrink-0">
                <div className="flex justify-between text-zinc-500 leading-none">
                  <span>Subtotal:</span>
                  <span>R$ {(targetProduct.price + (orderBumpEnabled && bumpProduct ? bumpProduct.price : 0)).toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-500 leading-none">
                    <span>Desconto (Cupom 10% Off):</span>
                    <span>- R$ {(targetProduct.price * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500 leading-none">
                  <span>Taxas Integradoras (Garantia):</span>
                  <span className="text-blue-500 font-bold uppercase text-[9px] tracking-wide">Sem cobranças</span>
                </div>
                <div className="flex justify-between border-t border-gray-150 dark:border-zinc-900 pt-3 text-sm font-black text-zinc-900 dark:text-white leading-none">
                  <span>Total final faturado:</span>
                  <span>R$ {finalTotalToPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Dynamic Guarantee Security Box */}
              <div className="bg-gradient-to-tr from-amber-500/[0.04] to-orange-500/[0.02] border border-amber-500/20 p-4 rounded-xl space-y-1.5 text-center mt-3">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  Selo de Garantia Assegurada
                </div>
                <p className="text-[10px] text-gray-450 dark:text-zinc-400 leading-relaxed text-left">
                  Se por qualquer motivo você decidir que este treinamento não é para você, devolvemos 100% do seu pagamento em até 7 dias incondicionalmente.
                </p>
                <div className="inline-block text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-md font-mono font-bold tracking-wide">
                  PROTEÇÃO ATIVA POR LEI ATÉ {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Ambiente assegurado com criptografia simétrica de 256 bits. O faturamento simula de forma confiável todos os splitters de saldo produtor-afiliado.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
