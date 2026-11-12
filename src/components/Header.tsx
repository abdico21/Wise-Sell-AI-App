import React from 'react';
import { NavTab, UserProfile } from '../types';
import { Sparkles, Activity, Globe, Smartphone, Monitor, Mic, User, ShieldCheck } from 'lucide-react';
import { WiseSellLogo } from './WiseSellLogo';
import { SupportedLanguage, CurrencyMode, supportedLanguages, translations } from '../i18n/translations';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRunAutonomousCycle: () => void;
  isCycleRunning: boolean;
  agentCycleCount: number;
  lang: SupportedLanguage;
  onOpenLangModal: () => void;
  currency: CurrencyMode;
  onToggleCurrency: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenVoiceAssistant?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onRunAutonomousCycle,
  isCycleRunning,
  agentCycleCount,
  lang,
  onOpenLangModal,
  currency,
  onToggleCurrency,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenVoiceAssistant,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const currentLangMeta = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];
  const t = translations[lang].nav;

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand title, one line with Orange, Blue, White, Black Logo */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <button 
            onClick={() => onTabChange('overview')}
            className="text-left cursor-pointer"
          >
            <WiseSellLogo size="md" showWordmark={true} />
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links with language support */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.overview}
          </button>
          <button
            onClick={() => onTabChange('engine')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'engine'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.engine}
          </button>
          <button
            onClick={() => onTabChange('videoaudio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'videoaudio'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.videoaudio}
          </button>
          <button
            onClick={() => onTabChange('marketing')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'marketing'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.marketing}
          </button>
          <button
            onClick={() => onTabChange('social')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'social'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.social}
          </button>
          <button
            onClick={() => onTabChange('crm')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'crm'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.crm}
          </button>
          <button
            onClick={() => onTabChange('inventory')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'inventory'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.inventory}
          </button>
          <button
            onClick={() => onTabChange('business')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'business'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.business}
          </button>
          <button
            onClick={() => onTabChange('database')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'database'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.database}
          </button>
          <button
            onClick={() => onTabChange('seo')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'seo'
                ? 'text-white border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.seo}
          </button>
        </nav>

        {/* Zone 3: Voice Mic, Mobile View Toggle, Ethiopian Multilingual, Auth & Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Web Speech API Voice Command Button */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="px-2.5 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:text-white hover:bg-orange-500 active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Voice Commands (Web Speech API)"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-orange-400 fill-current" />
              <span className="hidden xl:inline text-xs font-bold">Voice</span>
            </button>
          )}

          {/* Mobile Phone Mockup Toggle (to preview as native mobile app) */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Mobile Phone Mockup vs Full-Screen View"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xl:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden xl:inline">Mobile Preview</span>
              </>
            )}
          </button>

          {/* Currency Toggle (ETB ብር vs USD $) */}
          <button
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Switch Currency: Ethiopian Birr (ETB ብር) / US Dollar (USD $)"
          >
            <span className={currency === 'ETB' ? 'text-orange-400 font-bold' : 'text-slate-400'}>
              {currency === 'ETB' ? 'ብር ETB' : '$ USD'}
            </span>
          </button>

          {/* Multilingual Ethiopian Selector Button */}
          <button
            onClick={onOpenLangModal}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Select Language (Amharic, Afaan Oromoo, Tigrinya, Somali, English)"
          >
            <span>{currentLangMeta.flag}</span>
            <span className="font-medium hidden sm:inline-block">
              {currentLangMeta.nativeName}
            </span>
            <Globe className="w-3 h-3 text-blue-400" />
          </button>

          {/* Enterprise User Profile / Auth Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
              title={`Authenticated: ${currentUser.fullName} (${currentUser.role})`}
            >
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-orange-500 to-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                {currentUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="font-semibold text-xs hidden lg:inline max-w-[90px] truncate">{currentUser.fullName}</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500 text-xs text-white font-semibold transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onRunAutonomousCycle}
            disabled={isCycleRunning}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 active:scale-95 disabled:opacity-60 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isCycleRunning ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Cycle ({agentCycleCount})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
