/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavTab, 
  CampaignABTest, 
  LeadRecord, 
  InventoryItem, 
  SocialPost, 
  CustomerEngagementItem, 
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
import { BusinessAdvisorView } from './components/BusinessAdvisorView';
import { DatabaseConnectorsView } from './components/DatabaseConnectorsView';
import { EthiopianSeoAgentView } from './components/EthiopianSeoAgentView';
import { VoiceCommandAssistant } from './components/VoiceCommandAssistant';
import { AuthModal, AuthMode } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SupportedLanguage, CurrencyMode, translations } from './i18n/translations';
import { CheckCircle2, Smartphone, Monitor, Mic } from 'lucide-react';
import { testFirebaseConnection } from './firebase/config';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [lang, setLang] = useState<SupportedLanguage>('am'); // Default Ethiopian Amharic
  const [currency, setCurrency] = useState<CurrencyMode>('ETB'); // Default Ethiopian Birr
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Authentication & User Session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-admin-01',
    email: 'abdico.veiws22@gmail.com',
    fullName: 'Abdi Mohammed',
    role: 'Enterprise Admin',
    companyName: 'WiseSell Commerce Group',
    primaryIndustry: 'Multi-Industry Enterprise',
    location: 'Addis Ababa, Ethiopia (HQ)',
    is2faVerified: true,
    lastLoginTime: 'Just now',
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Web Speech API Voice Command Assistant
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const [channels, setChannels] = useState<CrossPlatformChannelTelemetry[]>(initialChannelTelemetry);
  const [campaigns, setCampaigns] = useState<CampaignABTest[]>(initialCampaignTests);
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [engagement, setEngagement] = useState<CustomerEngagementItem[]>(initialCustomerEngagement);
  const [logs, setLogs] = useState<AgentActivityLog[]>(initialActivityLogs);

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
          'Provisioned on lunar-option-jbvhw (europe-west2) with strict ABAC rules',
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

  // Run a complete autonomous omnichannel cycle
  const handleRunAutonomousCycle = () => {
    setIsCycleRunning(true);
    showToast(lang === 'am' ? 'ራስ-ሰር ዘመቻ ተጀምሯል፡ 5 ወኪሎች በመስራት ላይ ናቸው...' : 'Autonomous cycle initiated: 5 agents optimizing cross-channel performance...');

    setTimeout(() => {
      // 1. Marketing optimization
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === 'ab-101') {
            return {
              ...c,
              confidence: 98.2,
              variants: c.variants.map((v) =>
                v.id === 'var-b'
                  ? { ...v, trafficSplit: 85, conversions: v.conversions + 6, spend: v.spend + 140 }
                  : { ...v, trafficSplit: 15 }
              ),
            };
          }
          return c;
        })
      );

      // 2. Cross-Platform Engine
      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.channel === 'TikTok Ads') {
            return { ...ch, monthlySpend: ch.monthlySpend + 1200, roas: 4.42, lastOptimizedTime: 'Just now' };
          }
          if (ch.channel === 'Meta Ads') {
            return { ...ch, monthlySpend: ch.monthlySpend - 800, creativeFatigueScore: 'Nominal' as const, lastOptimizedTime: 'Just now' };
          }
          return { ...ch, lastOptimizedTime: 'Just now' };
        })
      );

      // 3. Inventory sync update
      setInventory((prev) =>
        prev.map((item) => ({
          ...item,
          channels: item.channels.map((ch) => ({
            ...ch,
            lastSyncTime: 'Just now',
            synced: true,
          })),
        }))
      );

      // 4. New activity log entries
      const cycleTimestamp = 'Just now';
      const newEntries: AgentActivityLog[] = [
        {
          id: `act-${Date.now()}-1`,
          timestamp: cycleTimestamp,
          agent: 'Marketing Agent',
          action: 'Optimization Engine shifted Telebirr & TikTok Shop ads to 4.42x ROAS & refreshed creative hook.',
          impact: 'Blended cross-platform ROAS elevated to 4.12x (+18% ROI lift)',
          category: 'Optimization',
        },
        {
          id: `act-${Date.now()}-2`,
          timestamp: cycleTimestamp,
          agent: 'Inventory Agent',
          action: 'Synchronized stock parity across Shopify, Amazon & TikTok Shop without human intervention.',
          impact: '0 inventory discrepancy across 1,420 listings',
          category: 'Sync',
        },
        {
          id: `act-${Date.now()}-3`,
          timestamp: cycleTimestamp,
          agent: 'Salesforce Agent',
          action: 'Verified 2-way Salesforce synchronization on 48 enterprise contacts and pipeline stages.',
          impact: 'All BANT qualification records up-to-date',
          category: 'Lead Routing',
        },
      ];

      setLogs((prev) => [...newEntries, ...prev]);
      setAgentCycleCount((c) => c + 1);
      setIsCycleRunning(false);
      showToast(lang === 'am' ? 'የወኪሎች ዑደት ተጠናቋል፡ በጀት ተደልድሏል፣ 0 ስህተት።' : 'Autonomous engine cycle complete: budget rebalanced, 0 errors.');
    }, 1600);
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
          currency={currency}
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
          onUpdateEngagement={setEngagement}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'crm' && (
        <CrmSalesforceView
          leads={leads}
          onUpdateLeads={setLeads}
          onAddAgentLog={handleAddAgentLog}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryChannelsView
          inventory={inventory}
          onUpdateInventory={setInventory}
          onAddAgentLog={handleAddAgentLog}
          lang={lang}
          currency={currency}
        />
      )}

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
        onLogoutSuccess={() => {
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
