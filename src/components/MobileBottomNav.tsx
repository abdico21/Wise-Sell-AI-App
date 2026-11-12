import React, { useState } from 'react';
import { NavTab } from '../types';
import { 
  LayoutGrid, 
  Cpu, 
  Film, 
  Database, 
  MoreHorizontal, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Package, 
  Bot, 
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: SupportedLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  lang,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const moreTabs: { id: NavTab; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'marketing', label: t.marketing, desc: 'A/B Testing & Conversion Rate Optimization', icon: TrendingUp },
    { id: 'social', label: t.social, desc: 'Auto-Pilot DM & Cross-Channel Content', icon: MessageSquare },
    { id: 'crm', label: t.crm, desc: 'BANT Qualification & Salesforce 2-Way Sync', icon: Users },
    { id: 'inventory', label: t.inventory, desc: 'Multi-Channel Stock Parity & PO Restock', icon: Package },
    { id: 'business', label: t.business, desc: 'Strategic Financial Trends & Growth AI', icon: Bot },
    { id: 'seo', label: t.seo, desc: 'Google.com.et Culturally Resonant Content', icon: Globe },
  ];

  const isMoreActive = moreTabs.some((t) => t.id === activeTab);

  const mainTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: t.overview, icon: LayoutGrid },
    { id: 'engine', label: t.engine, icon: Cpu },
    { id: 'videoaudio', label: t.videoaudio, icon: Film },
    { id: 'database', label: t.database, icon: Database },
  ];

  return (
    <>
      {/* Slide-Up Bottom Drawer for Secondary Tabs */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
          <div 
            className="flex-1"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 pb-8 shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h3 className="text-sm font-bold text-white">WiseSell AI Modules</h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-orange-500/10 border-orange-500/50 text-white' 
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isActive ? 'text-orange-400' : 'text-white'}`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Persistent Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-slate-800 pb-safe shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsMoreMenuOpen(false);
                }}
                className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
                  isActive ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-orange-500' : 'text-slate-400'}`} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-black" />
                  )}
                </div>
                <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[62px] text-center ${
                  isActive ? 'text-white font-medium' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 5th Tab: More Button */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
              isMoreActive || isMoreMenuOpen ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive ? 'scale-110 text-orange-500' : 'text-slate-400'}`} />
              {isMoreActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full ring-2 ring-black" />
              )}
            </div>
            <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[62px] text-center ${
              isMoreActive ? 'text-orange-400 font-medium' : 'text-slate-400'
            }`}>
              {isMoreActive ? moreTabs.find(t => t.id === activeTab)?.label.slice(0, 7) || 'More' : (lang === 'am' ? 'ተጨማሪ' : lang === 'om' ? 'Dabalata' : lang === 'ti' ? 'ተወሳኺ' : lang === 'so' ? 'Dheeraad' : 'More')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
