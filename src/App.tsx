/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  NavTab, 
  CampaignABTest, 
  LeadRecord, 
  InventoryItem, 
  SocialPost, 
  CustomerEngagementItem, 
  SalesOrder,
  AgentActivityLog, 
  CrossPlatformChannelTelemetry,
  UserProfile
} from './types';
import { 
  initialCampaignTests, 
  initialLeads, 
  initialInventory, 
  initialSocialPosts, 
  initialCustomerEngagement, 
  initialActivityLogs,
  initialChannelTelemetry
} from './data/mockData';
import { Header } from './components/Header';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { OverviewView } from './components/OverviewView';
import { CampaignOptimizationEngine } from './components/CampaignOptimizationEngine';
import { VideoAudioMarketingAgent } from './components/VideoAudioMarketingAgent';
import { MarketingAgentView } from './components/MarketingAgentView';
import { SocialAgentView } from './components/SocialAgentView';
import { CrmSalesforceView } from './components/CrmSalesforceView';
import { InventoryChannelsView } from './components/InventoryChannelsView';
import { OrdersView } from './components/OrdersView';
import { BusinessAdvisorView } from './components/BusinessAdvisorView';
import { AgentWorkTeamsView } from './components/AgentWorkTeamsView';
import { DatabaseConnectorsView } from './components/DatabaseConnectorsView';
import { EthiopianSeoAgentView } from './components/EthiopianSeoAgentView';
import { VoiceCommandAssistant } from './components/VoiceCommandAssistant';
import { AuthModal, AuthMode } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SupportedLanguage, CurrencyMode, translations } from './i18n/translations';
import { CheckCircle2, Smartphone, Monitor, Mic } from 'lucide-react';
import { testFirebaseConnection, auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createBusinessRecord, updateBusinessRecord, watchBusinessRecords, fulfillSalesOrder } from './firebase/businessData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [lang, setLang] = useState<SupportedLanguage>('am'); // Default Ethiopian Amharic
  const [currency, setCurrency] = useState<CurrencyMode>('ETB'); // Default Ethiopian Birr
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Authentication & User Session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Restore only a real Firebase-authenticated session; never create a demo user.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'WiseSell User',
        role: 'Growth Marketer',
        companyName: 'My Business',
        primaryIndustry: 'Multi-Industry Enterprise',
        location: 'Ethiopia',
        is2faVerified: false,
        lastLoginTime: 'Current session',
      });
    });
    return unsubscribe;
  }, []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Web Speech API Voice Command Assistant
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const [channels, setChannels] = useState<CrossPlatformChannelTelemetry[]>(initialChannelTelemetry);
  const [campaigns, setCampaigns] = useState<CampaignABTest[]>(initialCampaignTests);
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const leadDocumentIds = useRef<Map<string, string>>(new Map());
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const productDocumentIds = useRef<Map<string, string>>(new Map());
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [engagement, setEngagement] = useState<CustomerEngagementItem[]>(initialCustomerEngagement);
  const customerDocumentIds = useRef<Map<string, string>>(new Map());
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const orderDocumentIds = useRef<Map<string, string>>(new Map());
  const [logs, setLogs] = useState<AgentActivityLog[]>(initialActivityLogs);

  // Load only this user's saved products. Demo catalog remains visible when no saved products exist.
  useEffect(() => {
    if (!currentUser) {
      productDocumentIds.current.clear();
      setInventory(initialInventory);
      return;
    }
    try {
      return watchBusinessRecords<InventoryItem>('product', (records) => {
        productDocumentIds.current = new Map(records.map(record => [record.data.id, record.id]));
        if (records.length > 0) {
          setInventory(records.map(record => record.data));
        }
      }, (error) => showToast(`Could not load saved products: ${error.message}`));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load saved products.');
    }
  }, [currentUser?.id]);

  // Load this user's saved sales leads without importing the demo pipeline.
  useEffect(() => {
    if (!currentUser) {
      leadDocumentIds.current.clear();
      setLeads(initialLeads);
      return;
    }
    try {
      return watchBusinessRecords<LeadRecord>('lead', (records) => {
        leadDocumentIds.current = new Map(records.map(record => [record.data.id, record.id]));
        if (records.length > 0) setLeads(records.map(record => record.data));
      }, (error) => showToast(`Could not load saved leads: ${error.message}`));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load saved leads.');
    }
  }, [currentUser?.id]);

  // Load this user's saved customer conversations from the omnichannel inbox.
  useEffect(() => {
    if (!currentUser) {
      customerDocumentIds.current.clear();
      setEngagement(initialCustomerEngagement);
      return;
    }
    try {
      return watchBusinessRecords<CustomerEngagementItem>('customer', (records) => {
        customerDocumentIds.current = new Map(records.map(record => [record.data.id, record.id]));
        if (records.length > 0) setEngagement(records.map(record => record.data));
      }, (error) => showToast(`Could not load saved customers: ${error.message}`));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load saved customers.');
    }
  }, [currentUser?.id]);

  // Load and persist this user's sales orders.
  useEffect(() => {
    if (!currentUser) {
      orderDocumentIds.current.clear();
      setOrders([]);
      return;
    }
    try {
      return watchBusinessRecords<SalesOrder>('order', (records) => {
        orderDocumentIds.current = new Map(records.map(record => [record.data.id, record.id]));
        setOrders(records.map(record => record.data));
      }, (error) => showToast(`Could not load saved orders: ${error.message}`));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load saved orders.');
    }
  }, [currentUser?.id]);

  const handleUpdateOrders = (nextOrders: SalesOrder[]) => {
    const previousById = new Map(orders.map(item => [item.id, item]));
    setOrders(nextOrders);
    if (!currentUser) return;
    nextOrders.forEach(item => {
      const documentId = orderDocumentIds.current.get(item.id);
      const previous = previousById.get(item.id);
      if (documentId) {
        if (JSON.stringify(previous) !== JSON.stringify(item)) {
          void updateBusinessRecord(documentId, item).catch(error =>
            showToast(error instanceof Error ? error.message : 'Order update failed.'));
        }
      } else if (!previous) {
        void createBusinessRecord('order', item).then(id => {
          orderDocumentIds.current.set(item.id, id);
        }).catch(error =>
          showToast(error instanceof Error ? error.message : 'Order could not be saved.'));
      }
    });
  };

  const handleFulfillOrder = async (order: SalesOrder) => {
    const orderRecordId = orderDocumentIds.current.get(order.id);
    const productRecordId = productDocumentIds.current.get(order.productId);
    if (!orderRecordId) {
      showToast('Order is still being saved. Wait a moment, then try again.');
      return;
    }
    if (!productRecordId) {
      showToast('Save this product in your inventory before fulfilling the order.');
      return;
    }
    try {
      const result = await fulfillSalesOrder(orderRecordId, productRecordId, order.productId);
      handleAddAgentLog(
        result.alreadyFulfilled ? `Order ${order.orderNumber} was already fulfilled` : `Order ${order.orderNumber} fulfilled`,
        result.alreadyFulfilled ? 'No additional stock was deducted.' : `Inventory was atomically reduced. Remaining stock: ${result.remainingStock}.`,
        'Sync'
      );
      if (!result.alreadyFulfilled) showToast('Order fulfilled and inventory stock updated.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not fulfill order.');
    }
  };

  const handleUpdateEngagement = (nextItems: CustomerEngagementItem[]) => {
    const previousById = new Map(engagement.map(item => [item.id, item]));
    setEngagement(nextItems);
    if (!currentUser) return;

    nextItems.forEach(item => {
      const documentId = customerDocumentIds.current.get(item.id);
      const previous = previousById.get(item.id);
      if (documentId) {
        if (JSON.stringify(previous) !== JSON.stringify(item)) {
          void updateBusinessRecord(documentId, item).catch(error =>
            showToast(error instanceof Error ? error.message : 'Customer conversation update failed.'));
        }
      } else if (!previous) {
        void createBusinessRecord('customer', item).then(id => {
          customerDocumentIds.current.set(item.id, id);
        }).catch(error =>
          showToast(error instanceof Error ? error.message : 'Customer conversation could not be saved.'));
      }
    });
  };

  const handleUpdateLeads = (nextLeads: LeadRecord[]) => {
    const previousById = new Map(leads.map(item => [item.id, item]));
    setLeads(nextLeads);
    if (!currentUser) return;

    nextLeads.forEach(item => {
      const documentId = leadDocumentIds.current.get(item.id);
      const previous = previousById.get(item.id);
      if (documentId) {
        if (JSON.stringify(previous) !== JSON.stringify(item)) {
          void updateBusinessRecord(documentId, item).catch(error =>
            showToast(error instanceof Error ? error.message : 'Lead update failed.'));
        }
      } else if (!previous) {
        void createBusinessRecord('lead', item).then(id => {
          leadDocumentIds.current.set(item.id, id);
        }).catch(error =>
          showToast(error instanceof Error ? error.message : 'Lead could not be saved.'));
      }
    });
  };

  // Persist newly added products and edits to products already saved in Firestore.
  const handleUpdateInventory = (nextInventory: InventoryItem[]) => {
    const previousById = new Map(inventory.map(item => [item.id, item]));
    setInventory(nextInventory);
    if (!currentUser) return;

    nextInventory.forEach(item => {
      const documentId = productDocumentIds.current.get(item.id);
      const previous = previousById.get(item.id);
      if (documentId) {
        if (JSON.stringify(previous) !== JSON.stringify(item)) {
          void updateBusinessRecord(documentId, item).catch(error =>
            showToast(error instanceof Error ? error.message : 'Product update failed.'));
        }
      } else if (!previous) {
        void createBusinessRecord('product', item).then(id => {
          productDocumentIds.current.set(item.id, id);
        }).catch(error =>
          showToast(error instanceof Error ? error.message : 'Product could not be saved.'));
      }
    });
  };

  const [isCycleRunning, setIsCycleRunning] = useState<boolean>(false);
  const [agentCycleCount, setAgentCycleCount] = useState<number>(42);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[lang];

  // Test Firebase Firestore connection on boot as mandated by Firebase skill
  useEffect(() => {
    testFirebaseConnection().then((res) => {
      if (res.connected) {
        handleAddAgentLog(
          'Firebase Cloud Firestore connected & security rules active',
          'Connected to Firebase project gen-lang-client-0645056984; Firestore server read verified',
          'Automation'
        );
      }
    });
  }, []);

  // Helper to append agent action log
  const handleAddAgentLog = (
    action: string, 
    impact: string, 
    category: 'Optimization' | 'Automation' | 'Sync' | 'Lead Routing' | 'Financial'
  ) => {
    const agentMap: Record<string, AgentActivityLog['agent']> = {
      Optimization: 'Marketing Agent',
      Automation: 'Social Media Agent',
      Sync: 'Inventory Agent',
      'Lead Routing': 'Salesforce Agent',
      Financial: 'Business Advisor',
    };

    const newLog: AgentActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      agent: agentMap[category] || 'Marketing Agent',
      action,
      impact,
      category,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleCurrency = () => {
    const next = currency === 'ETB' ? 'USD' : 'ETB';
    setCurrency(next);
    showToast(next === 'ETB' ? 'የገንዘብ አይነት ወደ የኢትዮጵያ ብር (ETB) ተቀይሯል' : 'Switched to US Dollar (USD $)');
  };

  // This button is a demo-only preview until live provider integrations are configured.
  const handleRunAutonomousCycle = () => {
    showToast(lang === 'am'
      ? 'የማሳያ ዑደት ብቻ ነው፤ የውጭ ስርዓቶች አልተቀየሩም።'
      : 'Demo preview only. Connect and authorize channels before any live posts, ads, orders or inventory changes.');
  };

  // Open Auth modal in specific mode
  const handleOpenAuth = (mode: AuthMode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Main view content component
  const renderMainContent = () => (
    <>
      {activeTab === 'overview' && (
        <OverviewView
          onNavigate={setActiveTab}
          logs={logs}
          onTriggerCycle={handleRunAutonomousCycle}
          isCycleRunning={isCycleRunning}
          lang={lang}
          onOpenLangModal={() => setIsLangModalOpen(true)}
        />
      )}

      {activeTab === 'engine' && (
        <CampaignOptimizationEngine
          channels={channels}
          onUpdateChannels={setChannels}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'videoaudio' && (
        <VideoAudioMarketingAgent
          lang={lang}
          currency={currency}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'marketing' && (
        <MarketingAgentView
          campaigns={campaigns}
          onUpdateCampaigns={setCampaigns}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'social' && (
        <SocialAgentView
          posts={posts}
          engagementItems={engagement}
          onUpdatePosts={setPosts}
          onUpdateEngagement={handleUpdateEngagement}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'crm' && (
        <CrmSalesforceView
          leads={leads}
          onUpdateLeads={handleUpdateLeads}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryChannelsView
          inventory={inventory}
          onUpdateInventory={handleUpdateInventory}
          onAddAgentLog={handleAddAgentLog}
          lang={lang}
          currency={currency}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersView
          orders={orders}
          inventory={inventory}
          isAuthenticated={!!currentUser}
          onFulfillOrder={handleFulfillOrder}
          onUpdateOrders={handleUpdateOrders}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'agents' && <AgentWorkTeamsView lang={lang} />}

      {activeTab === 'business' && (
        <BusinessAdvisorView
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'database' && (
        <DatabaseConnectorsView
          lang={lang}
          currency={currency}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'seo' && (
        <EthiopianSeoAgentView
          lang={lang}
          onAddAgentLog={handleAddAgentLog}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Bar for Desktop */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRunAutonomousCycle={handleRunAutonomousCycle}
        isCycleRunning={isCycleRunning}
        agentCycleCount={agentCycleCount}
        lang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => handleOpenAuth('signin')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* When in Device Frame Mockup Mode (Simulates an iPhone 16 Pro on desktop) */}
      {isMobileFrame ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-950">
          <div className="text-center mb-3">
            <span className="text-xs font-semibold text-orange-400 bg-orange-950/60 border border-orange-800/40 px-3 py-1 rounded-full">
              📱 WiseSell AI Mobile App Platform (Ethiopia Multilingual)
            </span>
          </div>

          {/* Smartphone Frame Chassis */}
          <div className="w-[390px] h-[812px] bg-black rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative ring-1 ring-slate-700">
            {/* Top Speaker / Dynamic Island */}
            <div className="h-9 bg-black flex items-center justify-between px-6 pt-1 text-[11px] font-mono text-white select-none z-50 shrink-0">
              <span>9:41</span>
              <div className="w-24 h-4 bg-black border border-slate-800 rounded-full" />
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile In-App Top Bar */}
            <MobileTopBar
              lang={lang}
              onOpenLangModal={() => setIsLangModalOpen(true)}
              currency={currency}
              onToggleCurrency={handleToggleCurrency}
              onRunAutonomousCycle={handleRunAutonomousCycle}
              isCycleRunning={isCycleRunning}
              agentCycleCount={agentCycleCount}
              onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
              currentUser={currentUser}
              onOpenAuthModal={() => handleOpenAuth('signin')}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />

            {/* Scrollable Mobile App Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
              {renderMainContent()}
            </div>

            {/* Fixed Mobile Bottom Nav inside Chassis */}
            <MobileBottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              lang={lang}
            />
          </div>
        </div>
      ) : (
        /* Full-Width Responsive Mobile Viewport */
        <div className="flex-1 flex flex-col pb-20 sm:pb-8">
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
            {renderMainContent()}
          </main>

          {/* Floating Mobile Voice Command Button (for fast 1-tap voice access) */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="fixed bottom-20 right-4 sm:hidden z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-blue-600 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 active:scale-95 transition-transform cursor-pointer"
            title="Speak Voice Commands (Web Speech API)"
          >
            <Mic className="w-5 h-5 text-white animate-pulse" />
          </button>

          {/* Fixed Bottom Tab Bar for Mobile Viewports */}
          <MobileBottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lang={lang}
          />
        </div>
      )}

      {/* Multilingual Ethiopian Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={lang}
        onSelectLanguage={(selected) => {
          setLang(selected);
          showToast(`ቋንቋ ተቀይሯል / Language changed to ${selected.toUpperCase()}`);
        }}
      />

      {/* Web Speech API Voice Command Assistant Modal */}
      <VoiceCommandAssistant
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateTab={(t) => {
          setActiveTab(t);
          setIsVoiceModalOpen(false);
        }}
        onTriggerCycle={handleRunAutonomousCycle}
        onToggleCurrency={handleToggleCurrency}
        onOpenLangModal={() => {
          setIsVoiceModalOpen(false);
          setIsLangModalOpen(true);
        }}
        lang={lang}
        showToast={showToast}
      />

      {/* Authentication Suite Modal (Sign in, Sign in confirm, Sign up, Password reset confirm, Sign out confirm) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        initialMode={authModalMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        onLogoutSuccess={async () => {
          await signOut(auth);
          setCurrentUser(null);
          setIsAuthModalOpen(false);
        }}
        showToast={showToast}
      />

      {/* User Profile & Security Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onOpenPasswordReset={() => {
            setIsProfileModalOpen(false);
            handleOpenAuth('forgot-password');
          }}
          onTriggerSignOut={() => {
            setIsProfileModalOpen(false);
            handleOpenAuth('signout-confirm');
          }}
        />
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-black border border-orange-500/60 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer (Desktop) */}
      <footer className="hidden sm:block border-t border-slate-900 bg-black py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">WiseSell AI</span>
            <span>·</span>
            <span>በኢትዮጵያና በዓለም አቀፍ ደረጃ (Ethiopia & Global)</span>
            <span>·</span>
            <span className="text-orange-500">Orange</span>
            <span>·</span>
            <span className="text-blue-500">Blue</span>
            <span>·</span>
            <span className="text-white">White</span>
            <span>·</span>
            <span className="text-slate-400">Black</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Telebirr ቴሌብር</span>
            <span>·</span>
            <span>CBE Birr</span>
            <span>·</span>
            <span>Chapa ቻፓ</span>
            <span>·</span>
            <span>Telegram</span>
            <span>·</span>
            <span>Shopify</span>
            <span>·</span>
            <span>TikTok Shop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
