import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  PackageCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Calendar,
  Activity,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { SupportedLanguage, CurrencyMode, translations, formatCurrency } from '../i18n/translations';
import { SparklinePoint } from '../types';

interface PerformanceDashboardProps {
  lang: SupportedLanguage;
  currency: CurrencyMode;
  onNavigateTab?: (tab: any) => void;
  isCycleRunning?: boolean;
}

type Timeframe = '7D' | '30D' | '90D';

interface MetricConfig {
  id: string;
  titleEn: string;
  titleAm: string;
  titleOm: string;
  titleTi: string;
  titleSo: string;
  valueUsd: number;
  valueDisplayOverride?: string;
  changePercent: string;
  isPositive: boolean;
  sublabelEn: string;
  sublabelAm: string;
  colorScheme: {
    line: string;
    gradientStart: string;
    gradientStop: string;
    dot: string;
    badgeBg: string;
    badgeText: string;
  };
  data7d: number[];
  data30d: number[];
  data90d: number[];
  labels7d: string[];
  labels30d: string[];
  labels90d: string[];
  targetTab?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  lang,
  currency,
  onNavigateTab,
  isCycleRunning = false,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const metrics: MetricConfig[] = [
    {
      id: 'total-sales',
      titleEn: 'Total Sales',
      titleAm: 'ጠቅላላ ሽያጭ',
      titleOm: 'Gurgurtaa Waliigalaa',
      titleTi: 'ጠቕላላ መሸጣ',
      titleSo: 'Wadarta Iibka',
      valueUsd: 384200,
      changePercent: '+18.4%',
      isPositive: true,
      sublabelEn: 'Omnichannel GMV across 5 channels',
      sublabelAm: 'በ5 የገበያ መድረኮች የተገኘ ጠቅላላ ገቢ',
      colorScheme: {
        line: '#F97316', // Orange
        gradientStart: 'rgba(249, 115, 22, 0.35)',
        gradientStop: 'rgba(249, 115, 22, 0.0)',
        dot: '#EA580C',
        badgeBg: 'bg-orange-950/60 border-orange-800/40',
        badgeText: 'text-orange-400',
      },
      data7d: [38000, 42500, 41000, 49800, 52000, 56400, 61200],
      labels7d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data30d: [240000, 255000, 270000, 295000, 310000, 335000, 350000, 384200],
      labels30d: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      data90d: [680000, 740000, 810000, 890000, 960000, 1080000],
      labels90d: ['M-3', 'M-2.5', 'M-2', 'M-1.5', 'M-1', 'Now'],
      targetTab: 'business',
    },
    {
      id: 'active-campaigns',
      titleEn: 'Active Campaigns',
      titleAm: 'ንቁ የማስታወቂያ ዘመቻዎች',
      titleOm: 'Kampeniiwwan Hojii Irra Jiran',
      titleTi: 'ንቑሓት ዘመተታት',
      titleSo: 'Xayeysiisyada Shaqeynaya',
      valueUsd: 0,
      valueDisplayOverride: '14 Active (4.12x ROAS)',
      changePercent: '+0.42x ROAS',
      isPositive: true,
      sublabelEn: 'Meta, TikTok, Google & Telegram',
      sublabelAm: 'ሜታ፣ ቲክቶክ፣ ጉግልና ቴሌግራም',
      colorScheme: {
        line: '#2563EB', // Blue
        gradientStart: 'rgba(37, 99, 235, 0.35)',
        gradientStop: 'rgba(37, 99, 235, 0.0)',
        dot: '#3B82F6',
        badgeBg: 'bg-blue-950/60 border-blue-800/40',
        badgeText: 'text-blue-400',
      },
      data7d: [3.2, 3.4, 3.5, 3.7, 3.8, 4.0, 4.12],
      labels7d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data30d: [2.8, 3.0, 3.2, 3.4, 3.6, 3.75, 3.9, 4.12],
      labels30d: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      data90d: [2.4, 2.7, 3.1, 3.4, 3.8, 4.12],
      labels90d: ['M-3', 'M-2.5', 'M-2', 'M-1.5', 'M-1', 'Now'],
      targetTab: 'engine',
    },
    {
      id: 'inventory-health',
      titleEn: 'Inventory Health',
      titleAm: 'የዕቃዎች መጋዘን ጤንነት',
      titleOm: 'Fayyaa Kuusaa Meeshaa',
      titleTi: 'ጥዕና ዕቑር ኣቑሑት',
      titleSo: 'Caafimaadka Bakhaarka',
      valueUsd: 0,
      valueDisplayOverride: '96.8% Stock Parity',
      changePercent: '2 Low-Stock POs',
      isPositive: true,
      sublabelEn: '1,420 SKUs synchronized across 5 channels',
      sublabelAm: '1,420 ዕቃዎች በ5 ገበያዎች የተመሳሰሉ',
      colorScheme: {
        line: '#10B981', // Emerald
        gradientStart: 'rgba(16, 185, 129, 0.35)',
        gradientStop: 'rgba(16, 185, 129, 0.0)',
        dot: '#059669',
        badgeBg: 'bg-emerald-950/60 border-emerald-800/40',
        badgeText: 'text-emerald-400',
      },
      data7d: [92.1, 93.4, 94.0, 95.2, 95.8, 96.4, 96.8],
      labels7d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data30d: [86.0, 88.5, 91.0, 92.4, 94.2, 95.0, 96.1, 96.8],
      labels30d: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      data90d: [78.0, 82.5, 87.0, 91.5, 94.0, 96.8],
      labels90d: ['M-3', 'M-2.5', 'M-2', 'M-1.5', 'M-1', 'Now'],
      targetTab: 'inventory',
    },
    {
      id: 'net-growth',
      titleEn: 'Net Growth',
      titleAm: 'የተጣራ የንግድ ዕድገት',
      titleOm: 'Guddina Qulqulluu',
      titleTi: 'ጽሩይ ዕብየት ንግዲ',
      titleSo: 'Koraalka Saafiya',
      valueUsd: 124800,
      changePercent: '+31.4% QoQ',
      isPositive: true,
      sublabelEn: 'Net margin compounding + customer LTV',
      sublabelAm: 'የተጣራ ትርፍና የደንበኞች የረጅም ጊዜ ዋጋ',
      colorScheme: {
        line: '#A855F7', // Purple
        gradientStart: 'rgba(168, 85, 247, 0.35)',
        gradientStop: 'rgba(168, 85, 247, 0.0)',
        dot: '#9333EA',
        badgeBg: 'bg-purple-950/60 border-purple-800/40',
        badgeText: 'text-purple-400',
      },
      data7d: [14200, 15100, 16400, 18000, 19500, 21000, 23400],
      labels7d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data30d: [72000, 79000, 86000, 94000, 102000, 111000, 118000, 124800],
      labels30d: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      data90d: [180000, 215000, 255000, 305000, 350000, 412000],
      labels90d: ['M-3', 'M-2.5', 'M-2', 'M-1.5', 'M-1', 'Now'],
      targetTab: 'business',
    },
  ];

  // Helper to get localized title
  const getMetricTitle = (m: MetricConfig) => {
    switch (lang) {
      case 'am': return m.titleAm;
      case 'om': return m.titleOm;
      case 'ti': return m.titleTi;
      case 'so': return m.titleSo;
      default: return m.titleEn;
    }
  };

  const getMetricSublabel = (m: MetricConfig) => {
    return lang === 'am' ? m.sublabelAm : m.sublabelEn;
  };

  // Helper to format SVG Sparkline Path
  const renderSparklineSvg = (m: MetricConfig) => {
    const rawData = timeframe === '7D' ? m.data7d : timeframe === '30D' ? m.data30d : m.data90d;
    const labels = timeframe === '7D' ? m.labels7d : timeframe === '30D' ? m.labels30d : m.labels90d;
    const minVal = Math.min(...rawData);
    const maxVal = Math.max(...rawData);
    const range = maxVal - minVal || 1;

    const width = 280;
    const height = 64;
    const padding = 6;

    const points = rawData.map((val, idx) => {
      const x = padding + (idx / (rawData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return { x, y, val, label: labels[idx] };
    });

    const pathD = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth cubic bezier or straight lines
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    const gradientId = `spark-grad-${m.id}`;

    return (
      <div className="relative w-full h-16 mt-2 overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.colorScheme.gradientStart} />
              <stop offset="100%" stopColor={m.colorScheme.gradientStop} />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Line Stroke */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={m.colorScheme.line} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Endpoint Pulse */}
          <circle 
            cx={points[points.length - 1].x} 
            cy={points[points.length - 1].y} 
            r="3.5" 
            fill={m.colorScheme.dot} 
            className="animate-pulse"
          />

          {/* Interactive Hover Point */}
          {hoveredMetric === m.id && hoveredPointIndex !== null && points[hoveredPointIndex] && (
            <g>
              <line 
                x1={points[hoveredPointIndex].x} 
                y1={0} 
                x2={points[hoveredPointIndex].x} 
                y2={height} 
                stroke="#64748B" 
                strokeDasharray="2,2" 
                strokeWidth="1" 
              />
              <circle 
                cx={points[hoveredPointIndex].x} 
                cy={points[hoveredPointIndex].y} 
                r="4.5" 
                fill="#FFFFFF" 
                stroke={m.colorScheme.line} 
                strokeWidth="2" 
              />
            </g>
          )}
        </svg>

        {/* Hover Coordinate Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity cursor-crosshair"
          onMouseLeave={() => {
            setHoveredMetric(null);
            setHoveredPointIndex(null);
          }}
        >
          {points.map((pt, pIdx) => (
            <div 
              key={pIdx} 
              className="flex-1 h-full z-10"
              onMouseEnter={() => {
                setHoveredMetric(m.id);
                setHoveredPointIndex(pIdx);
              }}
            />
          ))}
        </div>

        {/* Tooltip on Active Point */}
        {hoveredMetric === m.id && hoveredPointIndex !== null && (
          <div className="absolute top-0 right-1 pointer-events-none bg-black/90 border border-slate-700 text-[10px] text-white px-2 py-0.5 rounded shadow-lg font-mono">
            <span>{labels[hoveredPointIndex]}: </span>
            <span className="font-bold text-orange-400">
              {m.valueDisplayOverride ? `${rawData[hoveredPointIndex]}` : formatCurrency(rawData[hoveredPointIndex], currency)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-black border border-slate-800 p-5 shadow-2xl space-y-4">
      {/* Top Header Row with Timeframe Switcher & Pulse Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500/20 to-blue-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {lang === 'am' ? 'የአፈጻጸም ዳሽቦርድ (Performance Dashboard)' : 'Performance Dashboard'}
              </h2>
              {isCycleRunning && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Sync
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'am'
                ? 'በእውነተኛ ጊዜ የሽያጭ፣ ዘመቻዎች፣ ዕቃዎችና የዕድገት መረጃዎች ከስፓርክላይን ግራፍ ጋር'
                : 'Real-time telemetry across sales, campaigns, inventory parity, and net growth velocity'}
            </p>
          </div>
        </div>

        {/* Timeframe Selector Pill Group */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          {(['7D', '30D', '90D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Card Grid with Sparkline Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const displayValue = metric.valueDisplayOverride
            ? metric.valueDisplayOverride
            : formatCurrency(metric.valueUsd, currency);

          return (
            <div
              key={metric.id}
              onClick={() => metric.targetTab && onNavigateTab && onNavigateTab(metric.targetTab)}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Top Row: Title & Change Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                    {getMetricTitle(metric)}
                  </span>
                  <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white mt-1">
                    {displayValue}
                  </div>
                </div>

                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${metric.colorScheme.badgeBg} ${metric.colorScheme.badgeText}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{metric.changePercent}</span>
                </div>
              </div>

              {/* Sparkline Graphic */}
              {renderSparklineSvg(metric)}

              {/* Bottom Meta & Sublabel */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900 mt-2">
                <span className="truncate max-w-[190px]">{getMetricSublabel(metric)}</span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {timeframe} trend
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
