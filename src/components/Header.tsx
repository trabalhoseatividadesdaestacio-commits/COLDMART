import React, { useState } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { UserRole } from '../types';
import { 
  Flame, LogOut, CheckCircle, ShieldAlert, 
  HelpCircle, Sparkles, User, ShoppingBag, FolderOpen, Coins, ChevronDown, Camera, X, Check, Upload
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNavigateToCheckout?: (productId: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
];

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  setCurrentTab, 
  onNavigateToCheckout 
}) => {
  const { currentUser, switchRole, users, logoutUser, updateUserProfile } = useColdmart();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');

  const openProfileModal = () => {
    if (currentUser) {
      setTempName(currentUser.name);
      setTempAvatar(currentUser.avatar || '');
    }
    setShowProfileModal(true);
    setShowProfileMenu(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserProfile(tempName, currentUser.email, tempAvatar);
    setShowProfileModal(false);
  };

  const rolesConfig = {
    admin: {
      label: 'Administrador',
      desc: 'Aprova produtos de criadores, gerencia solicitações de saques bancários e audita relatórios globais da plataforma.',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      icon: <ShieldAlert className="w-4 h-4" />
    },
    producer: {
      label: 'Produtor (Criador)',
      desc: 'Cria novos infoprodutos (cursos, e-books, mentorias), desenha sua Landing Page no Page Builder e acompanha vendas splitadas.',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      icon: <Sparkles className="w-4 h-4" />
    },
    affiliate: {
      label: 'Afiliado Profissional',
      desc: 'Promove links rastreáveis do marketplace público, analisa contagem de Cliques em tempo real e solicita resgates de dividendos.',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      icon: <Coins className="w-4 h-4" />
    },
    buyer: {
      label: 'Comprador (Iniciante)',
      desc: 'Adquire novos cursos, entra na Área de Membros, assiste aulas em streaming, realiza avaliações, faz prova e emite certificado.',
      color: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
      icon: <ShoppingBag className="w-4 h-4" />
    }
  };

  const activeRoleInfo = currentUser ? rolesConfig[currentUser.role] : rolesConfig.buyer;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleSelector(false);
    // Automatically switch tabs matching the role to provide the best walkthrough experience!
    if (role === 'buyer') {
      setCurrentTab('members');
    } else {
      setCurrentTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors duration-300">
      {/* Simulator Warning Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-1.5 font-medium">
          <Flame className="w-4 h-4 animate-pulse text-amber-300" />
          <span><strong>AMBIENTE DE TESTE EXECUTÁVEL (COLDMART):</strong> Você está visualizando o ecossistema SaaS completo. Use o painel para simular perfis.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-blue-100 font-mono text-[10px]">PROD_ID: 1cf7b54b-55e3-46f8-a4d9</span>
          <button 
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-2.5 py-1 rounded border border-white/10 flex items-center gap-1 transition-all text-[11px] cursor-pointer"
          >
            Mudar Perfil Técnico <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setCurrentTab('marketplace')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8.5 h-8.5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-all duration-300">
              <div className="w-3.5 h-3.5 bg-white rounded-xs rotate-45 animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold font-display italic tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-100 bg-clip-text text-transparent">
                COLDMART
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'marketplace'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-cyan-400 font-semibold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              Marketplace público
            </button>

            {currentUser && currentUser.role !== 'buyer' && (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-cyan-400 font-semibold'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                Painel do {rolesConfig[currentUser.role].label}
              </button>
            )}

            <button
              onClick={() => setCurrentTab('members')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'members'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-cyan-400 font-semibold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              Área de membros (Alunos)
            </button>

            <button
              onClick={() => setCurrentTab('support')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'support'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-cyan-400 font-semibold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              Suporte Técnico IA
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Active Persona Badge */}
          <div 
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold select-none cursor-pointer hover:opacity-90 active:scale-95 transition-all ${activeRoleInfo.color}`}
          >
            {activeRoleInfo.icon}
            <span>Perfil: {activeRoleInfo.label}</span>
          </div>

          {/* User Profile Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 ring-2 ring-gray-100 dark:ring-zinc-800 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {(() => {
                      const parts = currentUser.name.trim().split(' ');
                      if (parts.length > 1) {
                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                      }
                      return parts[0][0].toUpperCase();
                    })()}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-medium text-gray-700 dark:text-zinc-300 max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Menu Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-3 border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/30">
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Logado como</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                      {currentUser.name}
                      {!currentUser.avatar && (
                        <span className="bg-amber-500 text-white text-[8px] font-extrabold px-1 py-0.2 rounded uppercase scale-90">
                          Sem Foto
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={openProfileModal}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center gap-2 cursor-pointer font-semibold text-cyan-600 dark:text-cyan-400"
                    >
                      <Camera className="w-4 h-4 text-cyan-500" />
                      Alterar Foto de Perfil
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentTab('support');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                      Meus Chamados (Suporte)
                    </button>
                    {currentUser.role !== 'buyer' && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setCurrentTab('dashboard');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center gap-2 cursor-pointer"
                      >
                        <FolderOpen className="w-4 h-4 text-gray-400" />
                        Finanças da Carteira
                      </button>
                    )}
                  </div>
                  <div className="p-1 border-t border-gray-100 dark:border-zinc-950">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logoutUser();
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Secondary Menu */}
      <div className="md:hidden flex border-t border-gray-100 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-900/60 font-medium text-xs justify-around py-2 shrink-0">
        <button 
          onClick={() => setCurrentTab('marketplace')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'marketplace' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-gray-500'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Marketplace</span>
        </button>

        {currentUser && currentUser.role !== 'buyer' && (
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'dashboard' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-gray-500'}`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Meu Painel</span>
          </button>
        )}

        <button 
          onClick={() => setCurrentTab('members')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'members' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-gray-500'}`}
        >
          <User className="w-4 h-4" />
          <span>Membros</span>
        </button>

        <button 
          onClick={() => setCurrentTab('support')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'support' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-gray-500'}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Suporte</span>
        </button>
      </div>

      {/* Full Screen Overlay Role Switcher */}
      {showRoleSelector && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
                Selecione o Perfil do Simulador SaaS
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                A Coldmart possui visualizações completas e isoladas de faturamento e funções de acordo com cada tipo de acesso comercial. Altere à vontade para testar:
              </p>
            </div>
            
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {(Object.keys(rolesConfig) as UserRole[]).map((role) => {
                const conf = rolesConfig[role];
                const isSelected = currentUser?.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex gap-3 relative overflow-hidden group cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/10' 
                        : 'border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 dark:hover:bg-zinc-850 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-500">{conf.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{conf.label}</span>
                        {isSelected && (
                          <span className="bg-blue-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" /> Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {conf.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-zinc-900/40 border-t border-gray-150 dark:border-zinc-900/80 flex justify-end">
              <button
                onClick={() => setShowRoleSelector(false)}
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Fechar Simulador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Overlay Profile Customization & Picture Upload */}
      {showProfileModal && currentUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-lg border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-zinc-800 dark:text-zinc-100">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-900/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  Configurações de Perfil
                </h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  Mude seu nome comercial ou defina sua foto de apresentação
                </p>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Profile Image View Header */}
              <div className="flex items-center gap-5 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-900/60">
                <div className="relative group shrink-0">
                  {tempAvatar ? (
                    <img 
                      src={tempAvatar} 
                      alt="Avatar Preview" 
                      className="w-16 h-16 rounded-xl object-cover ring-4 ring-cyan-500/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 ring-4 ring-cyan-500/10 flex items-center justify-center text-xl font-bold font-mono text-white">
                      {(() => {
                        const nameStr = tempName || currentUser.name || 'U';
                        const parts = nameStr.trim().split(' ');
                        if (parts.length > 1) {
                          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        }
                        return parts[0][0].toUpperCase();
                      })()}
                    </div>
                  )}
                  {/* Status overlay */}
                  {!tempAvatar && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-extrabold px-1 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      Sem Foto
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">Foto em Exibição</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
                    {tempAvatar ? 'Foto ativa personalizada vinculada à sua conta.' : 'Sua conta não possui foto ativa. Selecione um preset abaixo, envie do seu aparelho ou insira um link URL.'}
                  </p>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                    Nome Comercial
                  </label>
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                      Endereço URL da Foto (Opcional)
                    </label>
                    <input
                      type="url"
                      value={tempAvatar.startsWith('data:image') ? '' : tempAvatar}
                      onChange={(e) => setTempAvatar(e.target.value)}
                      placeholder="Ex: https://dominio.com/sua-foto.jpg"
                      className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                      Escolher do Aparelho (PC / Celular)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-file-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setTempAvatar(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="avatar-file-upload"
                        className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 dark:bg-[#121217] dark:hover:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 font-semibold cursor-pointer transition-all hover:border-cyan-500 text-center select-none"
                      >
                        <Upload className="w-4 h-4 text-cyan-500 shrink-0" />
                        <span className="truncate">
                          {tempAvatar.startsWith('data:image') ? 'Foto Carregada ✓' : 'Escolher foto...'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preselected Preset Avatars Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                    Ou escolha um preset profissional
                  </label>
                  {tempAvatar && (
                    <button
                      type="button"
                      onClick={() => setTempAvatar('')}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" /> Remover Foto
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_AVATARS.map((url, idx) => {
                    const isSelected = tempAvatar === url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTempAvatar(url)}
                        className={`relative aspect-square rounded-xl bg-zinc-100 overflow-hidden border-2 transition-all cursor-pointer group hover:scale-105 active:scale-95 ${
                          isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-md scale-105' : 'border-transparent hover:border-zinc-700'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`Preset ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-[0.5px] flex items-center justify-center">
                            <span className="p-0.5 rounded-full bg-cyan-500 text-white">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-900/85 flex items-center justify-end gap-3 font-semibold">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-450 hover:to-blue-550 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl cursor-pointer shadow-md shadow-cyan-500/10 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
