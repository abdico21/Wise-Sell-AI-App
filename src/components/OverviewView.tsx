import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Users, 
  PackageCheck, 
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Zap,
  CheckCircle2,
  Share2,
  Workflow,
  Cpu,
  Film
} from 'lucide-react';
import { AgentActivityLog, NavTab } from '../types';
import { SupportedLanguage, CurrencyMode, translations, formatCurrency } from '../i18n/translations';
import { EthiopiaCommerceBanner } from './EthiopiaCommerceBanner';
import { PerformanceDashboard } from './PerformanceDashboard';

interface OverviewViewProps {
  onNavigate: (tab: NavTab) => void;
  logs: AgentActivityLog[];
  onTriggerCycle: () => void;
  isCycleRunning: boolean;
  lang?: SupportedLanguage;
  currency?: CurrencyMode;
  onOpenLangModal?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  logs,
  onTriggerCycle,
  isCycleRunning,
  lang = 'en',
  currency = 'USD',
  onOpenLangModal = () => {},
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const t = translations[lang];

  const filteredLogs = selectedFilter === 'All'
    ? logs
    : logs.filter((l) => l.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Ethiopian Multilingual & Commerce Gateway Banner */}
      <EthiopiaCommerceBanner
        lang={lang}
        currency={currency}
        onOpenLangModal={onOpenLangModal}
      />

      {/* Top Hero Banner & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-orange-400 font-semibold">{t.appName}</span>
            <span aria-hidden="true">·</span>
            <span>All 5 Agents Active</span>
            <span aria-hidden="true">·</span>
            <span>{currency === 'ETB' ? '🇪🇹 ETB ብር Active' : 'USD $ Active'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.appName} - {t.tagline}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            WiseSell AI automates multi-channel commerce, ad spend reallocation on TikTok, Meta & Telegram, Salesforce lead sync, and zero-drift inventory in Ethiopia and internationally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('engine')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700/60 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t.actions.launchEngine}</span>
          </button>
          <button
            onClick={() => onNavigate('videoaudio')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700/60 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <Film className="w-4 h-4 text-orange-400" />
            <span>{t.nav.videoaudio}</span>
          </button>
          <button
            onClick={onTriggerCycle}
            disabled={isCycleRunning}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-4 h-4 text-white fill-current" />
            <span>{isCycleRunning ? t.actions.running : t.actions.runCycle}</span>
          </button>
        </div>
      </div>

      {/* Performance Dashboard with Sparkline Charts */}
      <PerformanceDashboard
        lang={lang}
        currency={currency}
        onNavigateTab={onNavigate}
        isCycleRunning={isCycleRunning}
      />

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="truncate">{t.metrics.monthlyGmv}</span>
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white truncate">
            {formatCurrency(384200, currency)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last mo</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Blended ROAS</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">3.82x</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.42x via AI CRO</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Omnichannel CVR</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">4.12%</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.3% over benchmark</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Salesforce Leads</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">48 Hot</div>
          <div className="text-xs text-slate-400 mt-1">
            $290k pipeline value
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Synced SKUs</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">1,420</div>
          <div className="text-xs text-slate-400 mt-1">
            Across 5 marketplaces
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-400">2 Items</div>
          <div className="text-xs text-slate-400 mt-1">
            Auto-PO prepared
          </div>
        </div>
      </div>

      {/* Autonomous Agent Control Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Autonomous Agent Pods</h2>
            <p className="text-xs text-slate-400">Each agent acts independently to maximize conversion, pipeline, and inventory flow</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">5/5 Nodes Synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Agent 1: Digital Marketing CRO */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Digital Marketing & CRO</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Automated multi-variant A/B testing on Meta and TikTok. Monitors CVR drift and automatically shifts budget to winning creatives with 95%+ statistical confidence.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
                <span className="text-slate-400 font-medium">Recent action: </span>
                Paused Meta Ad Set #2 (CVR 2.6%) & shifted $2,850 to Variant B (CVR 4.5%).
              </div>
            </div>
            <button
              onClick={() => onNavigate('marketing')}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage A/B Tests & Ad Spend</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>

          {/* Agent 2: Social Media Management */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Social Media & Auto-Engagement</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Autonomous content creation, cross-platform calendar scheduling, and real-time AI auto-responder for customer DMs and comments across Instagram, TikTok, and X.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
                <span className="text-slate-400 font-medium">Recent action: </span>
                Triaged 18 buyer inquiries, auto-issued $51 discount to checkout cart.
              </div>
            </div>
            <button
              onClick={() => onNavigate('social')}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Social Queue & DMs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Agent 3: Salesforce & CRM Agent */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Salesforce & CRM Sync</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Synced</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Real-time lead qualification engine with BANT scoring (Budget, Authority, Need, Timeline). Auto-syncs high-intent prospects directly to Salesforce Lead & Opportunity objects.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
                <span className="text-slate-400 font-medium">Recent action: </span>
                Created Salesforce Lead SF-0049281 (Nordic Minimal, $420k GMV).
              </div>
            </div>
            <button
              onClick={() => onNavigate('crm')}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Review Leads & Field Mappings</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* Agent 4: Multi-Channel Inventory */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Inventory & Marketplace Sync</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Real-Time</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Unified multi-channel stock sync across Shopify, Amazon US, TikTok Shop, eBay, and WooCommerce. Auto-throttles ad sets during low-stock to prevent overselling.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
                <span className="text-slate-400 font-medium">Recent action: </span>
                Allocated 52 units of WS-HUB-MATTE to TikTok Shop after surge order.
              </div>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage SKUs & Marketplaces</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Agent 5: AI Business Assistant */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">AI Business Advisor & CFO</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Advising</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Executive financial trend advisor. Evaluates cash runway, customer acquisition cost (CAC), LTV, and gives strategic growth recommendations.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
                <span className="text-slate-400 font-medium">Recent action: </span>
                Forecasted $42,000 monthly incremental GMV from TikTok Shop catalog parity.
              </div>
            </div>
            <button
              onClick={() => onNavigate('business')}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Financial Growth Roadmap</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          {/* Quick Platform Integration Status */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-white">Connected Platforms</h3>
                <span className="text-xs text-slate-400">All Healthy</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="text-slate-300 font-medium">Shopify Store</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live (1,420 SKUs)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="text-slate-300 font-medium">Amazon SP-API</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live (1,180 SKUs)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="text-slate-300 font-medium">TikTok Shop API</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live (890 SKUs)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="text-slate-300 font-medium">Salesforce CRM</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 2-Way Sync</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-center mt-3">
              Webhook Latency: 120ms avg
            </div>
          </div>
        </div>
      </div>

      {/* Live Agent Activity Feed */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Live Autonomous Execution Stream</h2>
            <p className="text-xs text-slate-400">Chronological ledger of autonomous optimizations performed across channels</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg overflow-x-auto text-xs">
            {['All', 'Optimization', 'Automation', 'Sync', 'Lead Routing', 'Financial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 transition-colors rounded px-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-indigo-400">{log.agent}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{log.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{log.category}</span>
                </div>
                <div className="text-sm text-slate-200 font-medium">
                  {log.action}
                </div>
              </div>
              <div className="text-xs text-emerald-400 font-medium sm:text-right shrink-0 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1 rounded">
                {log.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
