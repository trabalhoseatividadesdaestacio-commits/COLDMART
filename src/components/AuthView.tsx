import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { UserRole } from '../types';
import { 
  Sparkles, Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, 
  TrendingUp, Users, ShoppingCart, Globe, LogIn, Eye, EyeOff
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { signupUser, loginUser, switchRole } = useColdmart();
  
  // Tab states: 'signup' | 'login'
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
  // Registration States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('producer');
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const created = signupUser(fullName, email, role, password);
      setSuccessMsg(`Conta criada com sucesso como ${role === 'producer' ? 'Produtor' : role === 'affiliate' ? 'Afiliado' : role === 'admin' ? 'Administrador' : 'Comprador'}! Redirecionando...`);
      // User is automatically logged in inside context, which re-renders App.tsx
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao criar conta. Esse e-mail já existe.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, insira e-mail e senha.');
      return;
    }

    try {
      const matched = loginUser(email, password);
      if (matched) {
        setSuccessMsg(`Bem-vindo de volta, ${matched.name}! Acessando painel...`);
      } else {
        setErrorMsg('E-mail não localizado. Caso não tenha conta, alterne para o Cadastro.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Senha incorreta.');
    }
  };

  // One-click quick tester login
  const handleQuickLogin = (presetEmail: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    // Pass undefined password so it bypasses validation check for preset simulator
    const matched = loginUser(presetEmail);
    if (matched) {
      setSuccessMsg(`Iniciando simulação como ${matched.name}...`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 sm:p-6 md:p-12 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch select-none">
        
        {/* LEFT COLUMN: GORGEOUS BENTO GRID TEASERS */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full flex flex-col justify-between">
          
          {/* Main Title Banner Header (Col Span 2) */}
          <div className="sm:col-span-2 bg-[#121217] border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-15 transition-opacity">
              <Globe className="w-32 h-32 text-cyan-400 rotate-12 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <div className="w-4 h-4 bg-white rounded rotate-45"></div>
                </div>
                <span className="text-2xl font-black font-display text-white italic tracking-tight">COLDMART</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Plataforma SaaS de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Infoprodutos de Elite</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-md font-semibold">
                Automatize checkout, divida comissões de afiliados ao vivo, construa páginas com copy de IA e gerencie uma área de membros nativa com certificado.
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-800/60 text-slate-500 font-mono text-[10px]">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> COMPRA SEGURA SSL</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-cyan-500 animate-spin" /> INTELIGÊNCIA ARTIFICIAL ATIVA</span>
            </div>
          </div>

          {/* Sub-Bento Card 1: Conversion Rates */}
          <div className="bg-[#121217] border border-slate-800/60 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300">
            <div>
              <div className="w-9 h-9 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Conversão Otimizada</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Layouts de checkout de alta performance formulados para reduzir o abandono de carrinho de compras.</p>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mt-4 font-mono">6.82% <span className="text-cyan-500 text-xs font-semibold font-sans tracking-normal">MÉDIA REAL</span></div>
          </div>

          {/* Sub-Bento Card 2: Active Students */}
          <div className="bg-[#121217] border border-slate-800/60 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
            <div>
              <div className="w-9 h-9 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Gestão de Alunos</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Área de membros para seus alunos realizarem provas, emitirem diplomas autorizados e interagirem com o Tutor IA.</p>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mt-4 font-mono">+1,842 <span className="text-indigo-400 text-xs font-semibold font-sans tracking-normal">ATIVOS</span></div>
          </div>

          {/* Quick Access Card for Evaluators (Col Span 2) */}
          <div className="sm:col-span-2 bg-[#121217] border border-dashed border-slate-800 rounded-3xl p-5 hover:border-cyan-500/40 transition-colors">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono text-center">
              🧪 Canal de Testes Ágeis • Login Instantâneo de Avaliador
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button 
                onClick={() => handleQuickLogin('admin@coldmart.com.br')}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-white p-2 rounded-xl text-left cursor-pointer hover:bg-slate-950 transition-all"
              >
                <div className="font-bold text-[10.5px] leading-tight text-cyan-400">Administrador</div>
                <div className="text-[8.5px] text-slate-500 truncate mt-0.5">admin@coldmart...</div>
              </button>
              
              <button 
                onClick={() => handleQuickLogin('roberto@coldmart.com.br')}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-white p-2 rounded-xl text-left cursor-pointer hover:bg-slate-950 transition-all"
              >
                <div className="font-bold text-[10.5px] leading-tight text-indigo-400">Produtor Pro</div>
                <div className="text-[8.5px] text-slate-500 truncate mt-0.5">roberto@coldmart...</div>
              </button>

              <button 
                onClick={() => handleQuickLogin('rafaela@coldmart.com.br')}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-white p-2 rounded-xl text-left cursor-pointer hover:bg-slate-950 transition-all"
              >
                <div className="font-bold text-[10.5px] leading-tight text-emerald-400">Afiliado Master</div>
                <div className="text-[8.5px] text-slate-500 truncate mt-0.5">rafaela@coldmart...</div>
              </button>

              <button 
                onClick={() => handleQuickLogin('bruno@coldmart.com.br')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-white p-2 rounded-xl text-left cursor-pointer hover:bg-slate-950 transition-all"
              >
                <div className="font-bold text-[10.5px] leading-tight text-amber-400">Comprador Aluno</div>
                <div className="text-[8.5px] text-slate-500 truncate mt-0.5">bruno@coldmart...</div>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CHIC COMPREHENSIVE LOGIN / CADASTRO FORM VIEW */}
        <div className="lg:col-span-5 bg-[#0f0f12] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"></div>

          {/* Tabs for Form */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                authMode === 'signup' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Criar Conta (Cadastro)
            </button>
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                authMode === 'login' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Já Tenho Conta
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {authMode === 'signup' ? 'Cadastro de Membro' : 'Conectar à Plataforma'}
            </h3>
            <p className="text-[11.5px] text-slate-400 mt-1 leading-snug">
              {authMode === 'signup' 
                ? 'Preencha seus dados para criar sua conta real federada e gerenciar infoprodutos.'
                : 'Insira seu endereço de e-mail cadastrado para reatar acesso ao seu painel operacional.'}
            </p>
          </div>

          {/* Error and Success notices */}
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-450 rounded-xl text-[11px] font-semibold leading-relaxed mb-4">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-450 rounded-xl text-[11px] font-bold leading-relaxed mb-4 animate-pulse">
              🎉 {successMsg}
            </div>
          )}

          {/* Signup Form */}
          {authMode === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Victor Silva"
                  className="w-full bg-[#121217] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> E-mail Profissional
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: joao@coldmart.com.br"
                  className="w-full bg-[#121217] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Senha Segura
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121217] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                  Selecione Seu Perfil Inicial
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#121217] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-semibold cursor-pointer"
                >
                  <option value="producer">🚀 Produtor (Quero cadastrar produtos e páginas)</option>
                  <option value="affiliate">💸 Afiliado (Quero promover produtos e faturar comissões)</option>
                  <option value="buyer">🎓 Comprador / Aluno (Quero estudar meus cursos e quizzes)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                  * Você pode simular qualquer perfil alternando diretamente nas configurações a qualquer momento no cabeçalho.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-350 hover:to-blue-500 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transform active:scale-[0.98] transition-all"
                >
                  <span>Concluir Cadastro e Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Endereço de E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: joao@coldmart.com.br"
                  className="w-full bg-[#121217] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Senha Cadastrada
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121217] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-350 hover:to-blue-500 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transform active:scale-[0.98] transition-all"
                >
                  <span>Conectar Agora</span>
                  <LogIn className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-[10px] text-slate-500 font-medium">
              Ambiente Integrado de Simulação Coldmart S.A.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
