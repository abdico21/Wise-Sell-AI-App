import React from 'react';
import { SupportedLanguage, CurrencyMode, translations, formatCurrency } from '../i18n/translations';
import { Smartphone, CheckCircle2, Send, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

interface EthiopiaCommerceBannerProps {
  lang: SupportedLanguage;
  currency: CurrencyMode;
  onOpenLangModal: () => void;
}

export const EthiopiaCommerceBanner: React.FC<EthiopiaCommerceBannerProps> = ({
  lang,
  currency,
  onOpenLangModal,
}) => {
  const t = translations[lang];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-black via-slate-950 to-blue-950/40 border border-slate-800 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
            🇪🇹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Ethiopian Multilingual & Social Commerce Gateway</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.2 rounded flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Telebirr & CBE Synced
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.tagline} · Rate: 1 USD = 125.00 ETB ብር
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLangModal}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{t.actions.changeLanguage}</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Network Integrations Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-semibold text-orange-400 text-[11px]">Telebirr (ቴሌብር)</div>
            <div className="text-[10px] text-slate-400">Merchant: #ET-884920</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-semibold text-blue-400 text-[11px]">CBE Birr (ንግድ ባንክ)</div>
            <div className="text-[10px] text-slate-400">Direct Checkout API</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-semibold text-emerald-400 text-[11px]">Chapa Gateway</div>
            <div className="text-[10px] text-slate-400">Cards & Wallets</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-semibold text-cyan-400 text-[11px]">Telegram Store Bot</div>
            <div className="text-[10px] text-slate-400">@WiseSellBot</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
};
