/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ColdmartProvider, useColdmart } from './context/ColdmartContext';
import { Header } from './components/Header';
import { MarketplaceView } from './components/MarketplaceView';
import { CheckoutView } from './components/CheckoutView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProducerDashboard } from './components/ProducerDashboard';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { MemberAreaView } from './components/MemberAreaView';
import { PageBuilderView } from './components/PageBuilderView';
import { SupportView } from './components/SupportView';
import { AuthView } from './components/AuthView';

function MainAppContent() {
  const { currentUser, logoutUser } = useColdmart();
  const [currentTab, setCurrentTab] = useState<string>('marketplace');
  const darkMode = true; // Forçar permanentemente o tema escuro moderno!

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Simulate receiving a shared link by logging out and directing to registration
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('shared') === 'true' || searchParams.get('share') === 'true') {
      logoutUser();
      searchParams.delete('shared');
      searchParams.delete('share');
      const newQuery = searchParams.toString() ? '?' + searchParams.toString() : '';
      window.history.replaceState(null, '', window.location.pathname + newQuery);
    }
  }, [logoutUser]);
  
  // Custom navigation parameters
  const [selectedProductIdForCheckout, setSelectedProductIdForCheckout] = useState<string>('prod_1');
  const [activeAffiliateCode, setActiveAffiliateCode] = useState<string | undefined>(undefined);
  const [selectedProductIdForBuilder, setSelectedProductIdForBuilder] = useState<string>('prod_1');

  const renderActiveTabContent = () => {
    switch (currentTab) {
      case 'marketplace':
        return (
          <MarketplaceView 
            onSelectProductForCheckout={(pId, aff) => {
              setSelectedProductIdForCheckout(pId);
              setActiveAffiliateCode(aff);
              setCurrentTab('checkout');
            }}
            onNavigateToBuilder={(pId) => {
              setSelectedProductIdForBuilder(pId);
              setCurrentTab('builder');
            }}
          />
        );
      case 'checkout':
        return (
          <CheckoutView 
            productId={selectedProductIdForCheckout}
            affiliateCode={activeAffiliateCode}
            onPaymentSuccess={() => {
              setCurrentTab('members');
            }}
            onNavigateToMarketplace={() => setCurrentTab('marketplace')}
          />
        );
      case 'builder':
        return (
          <PageBuilderView 
            productId={selectedProductIdForBuilder}
            onCloseBuilder={() => setCurrentTab('dashboard')}
          />
        );
      case 'dashboard':
        if (!currentUser) return null;
        if (currentUser.role === 'admin') {
          return <AdminDashboard />;
        } else if (currentUser.role === 'producer') {
          return (
            <ProducerDashboard 
              onNavigateToBuilder={(pId) => {
                setSelectedProductIdForBuilder(pId);
                setCurrentTab('builder');
              }}
            />
          );
        } else if (currentUser.role === 'affiliate') {
          return (
            <AffiliateDashboard 
              onNavigateToMarketplace={() => setCurrentTab('marketplace')}
              onNavigateToCheckoutWithAffiliate={(pId, code) => {
                setSelectedProductIdForCheckout(pId);
                setActiveAffiliateCode(code);
                setCurrentTab('checkout');
              }}
            />
          );
        } else {
          // Buyers don't have dashboards, navigate straight to members classroom
          return <MemberAreaView />;
        }
      case 'members':
        return <MemberAreaView />;
      case 'support':
        return <SupportView />;
      default:
        return <MarketplaceView onSelectProductForCheckout={() => {}} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="dark min-h-screen text-zinc-100 bg-[#09090B] font-sans flex flex-col justify-center">
        <main className="flex-1 flex items-center justify-center py-6 sm:py-12">
          <AuthView />
        </main>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen text-zinc-100 bg-zinc-950 font-sans flex flex-col">
      {/* Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onNavigateToCheckout={(pId) => {
          setSelectedProductIdForCheckout(pId);
          setActiveAffiliateCode(undefined);
          setCurrentTab('checkout');
        }}
      />

      {/* Main content area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 select-none">
        {renderActiveTabContent()}
      </main>

      {/* Corporate footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-900 py-6 text-center text-xs text-gray-400 dark:text-zinc-500 bg-white/50 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <span>© 2026 COLDMART S.A. TODOS OS DIREITOS RESERVADOS.</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            BUILD REVISION: R.49c1b7 • CLOUD RUN INGRESS STATUS: SECURED
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ColdmartProvider>
      <MainAppContent />
    </ColdmartProvider>
  );
}

