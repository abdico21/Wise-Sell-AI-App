import React from 'react';
import { SupportedLanguage, supportedLanguages } from '../i18n/translations';
import { Check, X, Globe, Smartphone, ShieldCheck } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-950 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 space-y-5 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Grab handle for mobile bottom sheet */}
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-base font-bold text-white">ቋንቋ ምረጡ / Select Language</h3>
              <p className="text-xs text-slate-400">Multilingual Languages in Ethiopia & Global Commerce</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="space-y-2">
          {supportedLanguages.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full min-h-[52px] p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{lang.nativeName}</div>
                    <div className="text-xs text-slate-400">{lang.name}</div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700" />
                )}
              </button>
            );
          })}
        </div>

        {/* Ethiopia Local Commerce & Payment Integrations Highlight */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-400" />
              በኢትዮጵያ የክፍያና ማህበራዊ ንግድ ዝግጁ ነው
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            WiseSell AI integrates directly with Telebirr (ቴሌብር), CBE Birr, Chapa Gateway, and Telegram Commerce Bots for seamless local order processing in Ethiopia.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-orange-400 font-mono">
              Telebirr ቴሌብር
            </span>
            <span className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-blue-400 font-mono">
              CBE Birr
            </span>
            <span className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-emerald-400 font-mono">
              Chapa ቻፓ
            </span>
            <span className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-cyan-400 font-mono">
              Telegram Bots
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
