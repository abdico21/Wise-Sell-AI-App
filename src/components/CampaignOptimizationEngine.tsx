import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  SlidersHorizontal, 
  RefreshCw, 
  TrendingUp, 
  Target, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Check, 
  Layers, 
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CrossPlatformChannelTelemetry, EngineOptimizationProposal } from '../types';

interface CampaignOptimizationEngineProps {
  channels: CrossPlatformChannelTelemetry[];
  onUpdateChannels: (channels: CrossPlatformChannelTelemetry[]) => void;
  onAddAgentLog: (action: string, impact: string, category: 'Optimization' | 'Automation') => void;
}

export const CampaignOptimizationEngine: React.FC<CampaignOptimizationEngineProps> = ({
  channels,
  onUpdateChannels,
  onAddAgentLog,
}) => {
  const [activeTab, setActiveTab] = useState<'bidding' | 'targeting' | 'creatives' | 'budget'>('budget');
  const [targetGoal, setTargetGoal] = useState<string>('Maximize Blended ROAS > 4.2x while keeping CPA < $24');
  const [maxBudgetShift, setMaxBudgetShift] = useState<number>(25);
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [proposal, setProposal] = useState<EngineOptimizationProposal | null>(null);
  const [isAutoPilotActive, setIsAutoPilotActive] = useState<boolean>(true);

  // Totals calculation
  const totalSpend = channels.reduce((sum, c) => sum + c.monthlySpend, 0);
  const totalAttributedRevenue = channels.reduce((sum, c) => sum + c.shopifyAttributedRevenue, 0);
  const blendedRoas = (totalAttributedRevenue / (totalSpend || 1)).toFixed(2);
  const avgCpa = (channels.reduce((sum, c) => sum + c.cpa, 0) / channels.length).toFixed(2);

  // Run AI Optimization Loop
  const handleRunOptimizationEngine = async () => {
    setIsEngineRunning(true);
    try {
      const res = await fetch('/api/ai/campaign-engine-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels,
          ecomAttribution: {
            totalRevenue: totalAttributedRevenue,
            cartAbandonmentRate: '68.4%',
            serverMatchRate: '94.2%',
          },
          targetGoal,
          constraints: {
            maxDailyBudgetShiftPercent: maxBudgetShift,
            minConfidence: 95,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProposal(data.data);
        onAddAgentLog(
          'Campaign Optimization Engine computed 4-vector cross-platform adjustments',
          `Forecasted ${data.data.projectedOverallImpact?.expectedBlendedRoas || '4.35x'} blended ROAS`,
          'Optimization'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEngineRunning(false);
    }
  };

  // Execute All Autonomous Proposals
  const handleApplyAllOptimizations = () => {
    if (!proposal) return;

    // Apply budget reallocations to channels
    const updated = channels.map((ch) => {
      const budgetItem = proposal.budgetAllocationMatrix.find(
        (b) => b.channel.toLowerCase().includes(ch.channel.toLowerCase().slice(0, 4))
      );
      const biddingItem = proposal.biddingStrategyAdjustments.find(
        (b) => b.channel.toLowerCase().includes(ch.channel.toLowerCase().slice(0, 4))
      );

      return {
        ...ch,
        monthlySpend: budgetItem ? budgetItem.recommendedBudget : ch.monthlySpend,
        activeStrategy: biddingItem ? biddingItem.recommendedStrategy : ch.activeStrategy,
        creativeFatigueScore: 'Nominal' as const,
        lastOptimizedTime: 'Just now',
      };
    });

    onUpdateChannels(updated);
    onAddAgentLog(
      'Executed full cross-platform campaign optimization matrix',
      `Rebalanced $32,300 across 4 platforms, updated 4 bidding models & deployed 2 fresh creative hooks`,
      'Optimization'
    );
    setProposal(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Engine Banner & Master Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Autonomous Engine Active
            </span>
            <span aria-hidden="true">·</span>
            <span>Meta, TikTok, Google, Amazon Ads + Shopify CAPI</span>
            <span aria-hidden="true">·</span>
            <span>Sub-Second Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Cross-Platform Campaign Optimization Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time algorithmic engine that continuously synchronizes ad performance with 1st-party e-commerce sales. Automatically tunes bidding strategies, refines audience targeting, auto-refreshes fatigued creatives, and rebalances cross-platform budget.
          </p>
        </div>

        {/* Action and Auto-Pilot toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div className={`w-2 h-2 rounded-full ${isAutoPilotActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className="text-slate-300">Continuous Auto-Pilot:</span>
            <button
              onClick={() => setIsAutoPilotActive(!isAutoPilotActive)}
              className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                isAutoPilotActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isAutoPilotActive ? 'Active (Every 2h)' : 'Paused'}
            </button>
          </div>

          <button
            onClick={handleRunOptimizationEngine}
            disabled={isEngineRunning}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            {isEngineRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Engine Evaluating Channels...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Run Engine Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Cross-Platform Telemetry Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Managed Cross-Platform Spend</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">${totalSpend.toLocaleString()}/mo</div>
          <div className="text-[11px] text-slate-400 mt-1">4 Connected Platforms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Shopify Attributed Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">${totalAttributedRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Server CAPI Match: 94.2%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Blended Cross-Platform ROAS</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">{blendedRoas}x</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">+0.48x vs static ads</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Blended CPA</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">${avgCpa}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Target: $24.00</div>
        </div>
      </div>

      {/* Real-Time Platform Ad Performance Matrix */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Live Cross-Platform Telemetry Matrix</h2>
            <p className="text-xs text-slate-400">Integrated ad sets synchronized directly with Shopify e-commerce conversion data</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Sync Interval: 60s</span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Platform Channel</th>
                <th className="py-3 px-3">Active Bidding Strategy</th>
                <th className="py-3 px-3 text-right">Spend</th>
                <th className="py-3 px-3 text-right">ROAS</th>
                <th className="py-3 px-3 text-right">CPA (Target)</th>
                <th className="py-3 px-3 text-right">CVR / CTR</th>
                <th className="py-3 px-3 text-center">Frequency / Fatigue</th>
                <th className="py-3 px-3 text-right">Shopify Revenue</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {channels.map((ch) => {
                const isFatigued = ch.creativeFatigueScore === 'Fatigued';
                return (
                  <tr key={ch.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ch.channel}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{ch.topPerformingAudience}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                        {ch.activeStrategy}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-200">
                      ${ch.monthlySpend.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold">
                      <span className={ch.roas >= 4.0 ? 'text-emerald-400' : ch.roas >= 3.4 ? 'text-cyan-400' : 'text-slate-300'}>
                        {ch.roas.toFixed(2)}x
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <div className={ch.cpa <= ch.targetCpa ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                        ${ch.cpa.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">Target: ${ch.targetCpa.toFixed(2)}</div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      <div>{ch.cvr.toFixed(2)}% CVR</div>
                      <div className="text-[10px] text-slate-500">{ch.ctr.toFixed(2)}% CTR</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="font-mono text-slate-200">{ch.frequency.toFixed(2)}x</div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        isFatigued 
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/50 font-bold' 
                          : ch.creativeFatigueScore === 'Moderate'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                      }`}>
                        {ch.creativeFatigueScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-medium">
                      ${ch.shopifyAttributedRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        ch.status === 'Active' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      }`}>
                        {ch.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engine Control & 4-Vector Adjustment Panels */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">4-Vector Autonomous Optimization Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any optimization vector to inspect real-time algorithmic decisions or review the complete proposal below.
            </p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'budget' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Cross-Platform Budget
            </button>
            <button
              onClick={() => setActiveTab('bidding')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'bidding' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Bidding Strategies
            </button>
            <button
              onClick={() => setActiveTab('targeting')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'targeting' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Audience Targeting
            </button>
            <button
              onClick={() => setActiveTab('creatives')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'creatives' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Creative Auto-Refresh
            </button>
          </div>
        </div>

        {/* Vector 1: Cross-Platform Budget Allocation */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-white">Algorithmic Capital Redistribution Rule:</span>
                <p className="text-slate-400 mt-0.5">
                  Shifts capital from sub-target ROAS channels into top-performing channels dynamically every hour based on Shopify CAPI revenue validation.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400">Max Shift Limit:</span>
                <span className="font-mono font-bold text-white">{maxBudgetShift}%</span>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={maxBudgetShift}
                  onChange={(e) => setMaxBudgetShift(parseInt(e.target.value))}
                  className="w-24 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { channel: 'Meta Ads', current: '$12,400', suggested: '$10,800', delta: '-$1,600', pct: '-12.9%', reason: 'Fatigued top creative, trim broad audience' },
                { channel: 'TikTok Ads', current: '$8,900', suggested: '$11,200', delta: '+$2,300', pct: '+25.8%', reason: 'Scale viral Spark UGC (4.15x ROAS)' },
                { channel: 'Google Search', current: '$6,200', suggested: '$6,900', delta: '+$700', pct: '+11.3%', reason: 'Capture unmet high-intent shopping queries' },
                { channel: 'Amazon Sponsored', current: '$4,800', suggested: '$3,400', delta: '-$1,400', pct: '-29.2%', reason: 'Throttle low-stock SKU ad spend' },
              ].map((card, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{card.channel}</span>
                    <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      card.delta.startsWith('+') 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                        : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                    }`}>
                      {card.delta} ({card.pct})
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="text-xs text-slate-400">Current: <span className="font-mono text-slate-300">{card.current}</span></div>
                    <div className="text-xs font-semibold text-white">Target: <span className="font-mono text-cyan-400">{card.suggested}</span></div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                    {card.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vector 2: Bidding Strategies Controller */}
        {activeTab === 'bidding' && (
          <div className="space-y-3">
            {[
              {
                platform: 'Meta Ads',
                current: 'Lowest Cost (Auto-Bid)',
                proposed: 'Target Cost / Cost Cap ($22.50)',
                multipliers: '+22% evening (19:00-23:00 EST), -8% overnight',
                impact: 'Prevents midday auction overbidding and stabilizes CPA at $22.50 ceiling',
              },
              {
                platform: 'TikTok Ads',
                current: 'Bid Cap ($18.00)',
                proposed: 'Value Optimization (tROAS 4.2x)',
                multipliers: '+18% for 18-34 mobile shoppers watching > 75% video',
                impact: 'Prioritizes high-AOV cart buyers, elevating blended order value from $89 to $112',
              },
              {
                platform: 'Google Search & Shopping',
                current: 'Maximize Conversions',
                proposed: 'Target ROAS (tROAS 450%)',
                multipliers: '+30% exact match keywords, -50% broad phrase match',
                impact: 'Protects gross margins on high-volume desk organizer queries',
              },
              {
                platform: 'Amazon Sponsored Ads',
                current: 'Dynamic Bids - Up & Down',
                proposed: 'Dynamic Bids - Down Only with +20% Top-of-Search Multiplier',
                multipliers: '+20% top-of-search placement, -15% rest-of-search',
                impact: 'Captures 78% of conversions at $16.20 CPA while pruning unprofitable placements',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.platform}</span>
                    <span className="text-slate-400 font-mono">Current: {item.current}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {item.proposed}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">Multipliers: {item.multipliers}</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <span className="text-slate-400 font-medium">Algorithmic Rationale: </span>
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Vector 3: Dynamic Audience Targeting */}
        {activeTab === 'targeting' && (
          <div className="space-y-3">
            {[
              {
                channel: 'Meta Ads',
                action: 'Automatic Exclusion & Seed Expansion',
                audience: 'Exclude 14-day Shopify purchasers; seed 1% Lookalike of top 10% highest LTV customers ($250+ AOV)',
                impact: 'Reduces ad waste by $680/week and increases CTR from 2.9% to 3.8%',
                status: 'Auto-Synced via Shopify CAPI'
              },
              {
                channel: 'TikTok Ads',
                action: 'Dynamic Custom Retargeting',
                audience: 'Real-time server CAPI audience of cart abandoners < 48 hours with dynamic product card feed',
                impact: 'Recovers ~24 abandoned checkout carts weekly, projecting +$2,100 incremental GMV',
                status: 'Ready to Deploy'
              },
              {
                channel: 'Google & Amazon Ads',
                action: 'Negative Keyword Pruning',
                audience: 'Auto-added 18 non-commercial query negatives ("free", "diy", "schematic", "pdf", "used")',
                impact: 'Saves $420 monthly in wasted ad clicks with 0 conversion probability',
                status: 'Continuous Rule'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.channel}</span>
                    <span className="text-indigo-400 font-medium">· {item.action}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-slate-200 text-[11px]">
                  {item.audience}
                </div>
                <p className="text-slate-400 text-[11px]">
                  <span className="text-emerald-400 font-medium">Projected Outcome: </span>
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Vector 4: Creative Auto-Refresh */}
        {activeTab === 'creatives' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-start gap-3 text-xs">
              <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Creative Fatigue Alert Triggered on Meta & TikTok:</span>
                <p className="text-amber-400/80 mt-0.5">
                  Ad frequency on Meta Variant A has reached 3.84x with a 24% CTR decay. WiseSell AI has drafted fresh scroll-stopping hooks and headlines to replace fatigued creatives automatically before CPA degrades.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Meta Ads Creative Swap</span>
                  <span className="text-rose-400 font-mono text-[10px] bg-rose-950 px-1.5 py-0.2 rounded">Frequency: 3.84x</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Retiring: <span className="line-through text-slate-500">Variant A (Feature List Video)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-indigo-900/40 space-y-1.5">
                  <div className="text-[10px] font-semibold text-cyan-400 uppercase">AI Replacement Hook:</div>
                  <div className="text-white font-medium">"The 1 mistake 80% of remote workers make with their nightstand setup ⚡"</div>
                  <div className="text-[11px] text-slate-300">Headline: Qi2 Certified 15W Magnetic Fast Charger | Zero Cable Mess</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">TikTok Ads Spark UGC Swap</span>
                  <span className="text-rose-400 font-mono text-[10px] bg-rose-950 px-1.5 py-0.2 rounded">Frequency: 4.12x</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Retiring: <span className="line-through text-slate-500">Spark UGC Ad #4 (Desk Tour Short)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-indigo-900/40 space-y-1.5">
                  <div className="text-[10px] font-semibold text-cyan-400 uppercase">AI Replacement Hook:</div>
                  <div className="text-white font-medium">"My roommate said I wasted $89 on this charger... until she saw my desk 💀"</div>
                  <div className="text-[11px] text-slate-300">Headline: Shop the viral 3-in-1 Qi2 Charging Hub before stock sells out</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Proposal Drawer / Card */}
        {proposal && (
          <div className="p-6 rounded-xl bg-slate-950 border border-indigo-900/60 space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">Gemini 3.8 Flash Cross-Platform Proposal</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Confidence: 97.4%
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Projected: {proposal.projectedOverallImpact.expectedBlendedRoas} · CPA: {proposal.projectedOverallImpact.expectedCpaDrop}
                </div>
              </div>

              <button
                onClick={handleApplyAllOptimizations}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Execute All Autonomous Adjustments</span>
              </button>
            </div>

            {/* Impact metric banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Blended ROAS Forecast:</span>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {proposal.projectedOverallImpact.expectedBlendedRoas}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Projected CPA Reduction:</span>
                <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
                  {proposal.projectedOverallImpact.expectedCpaDrop}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Monthly Incremental Revenue:</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {proposal.projectedOverallImpact.monthlyIncrementalRevenue}
                </div>
              </div>
            </div>

            {/* Summary List */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Ready to Auto-Deploy:
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-850">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Budget Shift:</strong> Reallocate +$2,300 to TikTok Ads and +$700 to Google Search from Meta & Amazon.</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-850">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Bidding Rules:</strong> Switch Meta Ads to Cost Cap ($22.50) and TikTok to Value Optimization (4.2x ROAS).</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-850">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Audience Parity:</strong> Auto-exclude recent 14-day purchasers and deploy 48h cart abandonment retargeting.</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-850">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Creative Refresh:</strong> Retire 2 fatigued ads (freq &gt; 3.8x) and publish fresh Gemini-drafted hooks.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
