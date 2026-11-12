import React from 'react';
import { WiseSellLogo } from './WiseSellLogo';
import { SupportedLanguage, CurrencyMode, supportedLanguages } from '../i18n/translations';
import { Globe, DollarSign, Zap, Activity, Mic, User } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileTopBarProps {
  lang: SupportedLanguage;
  onOpenLangModal: () => void;
  currency: CurrencyMode;
  onToggleCurrency: () => void;
  onRunAutonomousCycle: () => void;
  isCycleRunning: boolean;
  agentCycleCount: number;
  onOpenVoiceAssistant?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  lang,
  onOpenLangModal,
  currency,
  onToggleCurrency,
  onRunAutonomousCycle,
  isCycleRunning,
  agentCycleCount,
  onOpenVoiceAssistant,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const currentLangMeta = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-slate-800 px-3 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
        {/* Left: Brand Logo Lockup */}
        <div className="shrink-0">
          <WiseSellLogo size="sm" showWordmark={true} />
        </div>

        {/* Right: Voice Mic, Currency, Language, Auth & Cycle Action */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Web Speech API Microphone Button */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="h-8 px-2 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:text-white hover:bg-orange-500 active:scale-95 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Voice Commands (Web Speech API)"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-orange-400 fill-current" />
              <span className="text-[10px] font-bold hidden xs:inline">Voice</span>
            </button>
          )}

          {/* Currency Toggle (ETB ብር / USD $) */}
          <button
            onClick={onToggleCurrency}
            className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-slate-200 hover:text-white flex items-center gap-1 transition-colors"
            title="Toggle Ethiopian Birr (ETB ብር) / US Dollar (USD $)"
          >
            <span className={currency === 'ETB' ? 'text-orange-400 font-extrabold' : 'text-slate-400'}>
              {currency === 'ETB' ? 'ብር' : '$'}
            </span>
          </button>

          {/* Multilingual Selector Button */}
          <button
            onClick={onOpenLangModal}
            className="h-8 px-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Select Language (Amharic, Afaan Oromoo, Tigrinya, Somali, English)"
          >
            <span className="text-sm">{currentLangMeta.flag}</span>
            <Globe className="w-3 h-3 text-blue-400" />
          </button>

          {/* User Profile / Auth Toggle Button */}
          <button
            onClick={currentUser ? onOpenProfileModal : onOpenAuthModal}
            className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={currentUser ? `Account: ${currentUser.fullName}` : 'Sign In'}
          >
            {currentUser ? (
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-orange-500 to-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                {currentUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            ) : (
              <User className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Run Cycle Button with Orange & Blue Accent */}
          <button
            onClick={onRunAutonomousCycle}
            disabled={isCycleRunning}
            className="h-8 px-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            title="Execute Autonomous Multi-Agent Cycle"
          >
            {isCycleRunning ? (
              <Activity className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-white fill-current" />
                <span className="text-[11px]">{agentCycleCount}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
