import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw,
  Compass,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';

interface BusinessAdvisorViewProps {
  onAddAgentLog: (action: string, impact: string, category: 'Financial') => void;
}

export const BusinessAdvisorView: React.FC<BusinessAdvisorViewProps> = ({
  onAddAgentLog,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [growthReport, setGrowthReport] = useState<any>(null);

  // Financial inputs for scenario simulation
  const [gmv, setGmv] = useState<string>('$384,200');
  const [grossMargin, setGrossMargin] = useState<string>('59.2%');
  const [cac, setCac] = useState<string>('$36.40');
  const [ltv, setLtv] = useState<string>('$158.00');
  const [adRoas, setAdRoas] = useState<string>('3.82x');
  const [targetGrowth, setTargetGrowth] = useState<string>('35% QoQ');

  const handleRunStrategicAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/business-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gmv,
          grossMargin,
          cac,
          ltv,
          adRoas,
          targetGrowth,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGrowthReport(data.data);
        onAddAgentLog(
          'AI Business Assistant generated executive strategic growth roadmap',
          `Forecasted +$42,000 incremental monthly GMV via TikTok Shop catalog expansion`,
          'Financial'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>AI Business Assistant & CFO Advisor</span>
            <span aria-hidden="true">·</span>
            <span>Financial Trend Analysis & Strategic Growth Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Financial Trends & Strategic Growth Advisor
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            WiseSell AI continuously analyzes margins, unit economics, working capital runway, and channel profitability to formulate strategic growth recommendations.
          </p>
        </div>

        <button
          onClick={handleRunStrategicAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          {isAnalyzing ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Analyzing Unit Economics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate Strategic Growth Roadmap</span>
            </>
          )}
        </button>
      </div>

      {/* Financial Health & Unit Economics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Monthly GMV</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">$384,200</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">+18.4% MoM</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Gross Margin</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">59.2%</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Benchmark: 55%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Blended CAC</div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">$36.40</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">-18% via AI CRO</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Customer LTV</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">$158.00</div>
          <div className="text-[11px] text-indigo-400 font-mono mt-1">LTV:CAC 4.34x</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Blended ROAS</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">3.82x</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">+0.42x lift</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Cash Runway</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">18.5 mos</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">$18k net burn/mo</div>
        </div>
      </div>

      {/* Strategic Scenario Simulation Parameters */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-semibold text-white">Strategic Scenario Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Monthly GMV</label>
            <input
              type="text"
              value={gmv}
              onChange={(e) => setGmv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Gross Margin</label>
            <input
              type="text"
              value={grossMargin}
              onChange={(e) => setGrossMargin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Current CAC</label>
            <input
              type="text"
              value={cac}
              onChange={(e) => setCac(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Expected LTV</label>
            <input
              type="text"
              value={ltv}
              onChange={(e) => setLtv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Blended ROAS</label>
            <input
              type="text"
              value={adRoas}
              onChange={(e) => setAdRoas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Target QoQ Growth</label>
            <input
              type="text"
              value={targetGrowth}
              onChange={(e) => setTargetGrowth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* AI Strategic Growth Output */}
      {growthReport && (
        <div className="p-6 rounded-xl bg-slate-950 border border-indigo-900/50 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono text-base border border-indigo-500/20">
                {growthReport.financialHealthScore || 88}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Executive Strategic Growth Assessment</h3>
                <div className="text-xs text-slate-400">Financial Health Score: {growthReport.financialHealthScore || 88}/100 · Strong Unit Economics</div>
              </div>
            </div>

            <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
              High Scalability Readiness
            </span>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">Executive Summary</div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {growthReport.executiveSummary}
            </p>
          </div>

          {/* 3 Strategic Growth Pillars */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Strategic Growth Pillars & Impact Projections:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {growthReport.strategicRecommendations?.map((rec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Pillar {idx + 1}: {rec.pillar}
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {rec.opportunity}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-xs font-semibold text-emerald-400">
                    {rec.projectedImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Simulation & Urgent Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-cyan-400">Working Capital & Runway Forecast:</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {growthReport.scenarioSimulation}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-amber-900/50 space-y-1">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Critical Risk Factor to Mitigate:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {growthReport.urgentRisk}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Channel Profitability Breakdown */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-semibold text-white">Channel Unit Economics & Margin Matrix</h2>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Sales Channel</th>
                <th className="py-3 px-3 text-right">Monthly GMV</th>
                <th className="py-3 px-3 text-right">Gross Margin %</th>
                <th className="py-3 px-3 text-right">CAC</th>
                <th className="py-3 px-3 text-right">Channel ROAS</th>
                <th className="py-3 px-4">Strategic Growth Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {[
                { channel: 'Shopify Storefront', gmv: '$186,000', margin: '68.4%', cac: '$32.10', roas: '4.20x', action: 'Scale VIP email/SMS flows and 1-click Shop Pay' },
                { channel: 'Amazon US Store', gmv: '$118,000', margin: '51.2%', cac: '$44.50', roas: '3.10x', action: 'Re-negotiate FBA long-term storage fees' },
                { channel: 'TikTok Shop', gmv: '$54,200', margin: '62.0%', cac: '$24.80', roas: '4.85x', action: 'Scale creator affiliate sample seeding (+150 creators)' },
                { channel: 'eBay & WooCommerce', gmv: '$26,000', margin: '58.0%', cac: '$38.00', roas: '3.40x', action: 'Automate zero-drift inventory allocation' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{row.channel}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">{row.gmv}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">{row.margin}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{row.cac}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-indigo-400">{row.roas}</td>
                  <td className="py-3 px-4 text-xs text-slate-300">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
