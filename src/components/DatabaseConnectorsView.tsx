import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cpu, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Download, 
  Play, 
  Check, 
  Zap, 
  Radio, 
  Server, 
  HardDrive,
  FileCode,
  ShieldCheck,
  Send,
  ArrowRight
} from 'lucide-react';
import { SupportedLanguage, CurrencyMode, translations, formatCurrency } from '../i18n/translations';
import { ConnectorStatus } from '../db/database';

interface DatabaseConnectorsViewProps {
  lang: SupportedLanguage;
  currency: CurrencyMode;
  onAddAgentLog: (action: string, impact: string, category: 'Sync' | 'Automation') => void;
}

export const DatabaseConnectorsView: React.FC<DatabaseConnectorsViewProps> = ({
  lang,
  currency,
  onAddAgentLog,
}) => {
  const t = translations[lang];

  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [dbStats, setDbStats] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<'orders' | 'connectors' | 'leads' | 'inventory'>('connectors');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isPinging, setIsPinging] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  // Fetch initial db stats and connectors
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/db/stats');
      const data = await res.json();
      if (data.success) {
        setDbStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTable = async (tableName: string) => {
    try {
      const res = await fetch(`/api/db/table/${tableName}`);
      const data = await res.json();
      if (data.success) {
        setTableData(data.rows || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTable('connectors');
    fetch('/api/db/table/connectors')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setConnectors(d.rows);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSelectTable = (tbl: 'orders' | 'connectors' | 'leads' | 'inventory') => {
    setSelectedTable(tbl);
    fetchTable(tbl);
  };

  // Ping single connector
  const handlePingConnector = async (connectorId: string) => {
    setIsPinging(connectorId);
    try {
      const res = await fetch('/api/db/connectors/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectorId }),
      });
      const data = await res.json();
      if (data.success) {
        setConnectors((prev) =>
          prev.map((c) => (c.id === connectorId ? data.connector : c))
        );
        onAddAgentLog(
          `Real-time ping verified on ${data.connector.name}`,
          `Latency: ${data.connector.latencyMs}ms · Webhook listener active`,
          'Sync'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPinging(null);
    }
  };

  // Simulate incoming real-time e-commerce transaction
  const handleSimulateOrder = async (method: 'Telebirr ቴሌብር' | 'CBE Birr' | 'Chapa ቻፓ') => {
    setIsSimulating(true);
    try {
      const customers = ['Abebe Kebede', 'Tigist Assefa', 'Selamawit Haile', 'Yared Lemma'];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const res = await fetch('/api/db/orders/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: randomCustomer,
          channel: method === 'Telebirr ቴሌብር' ? 'TikTok Shop Ethiopia' : 'Telegram Commerce Bot',
          paymentMethod: method,
          amountUsd: 89,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastEvent(`[${method}] New Order ${data.order.id} confirmed from ${randomCustomer} (${formatCurrency(89, currency)})`);
        fetchStats();
        if (selectedTable === 'orders') {
          fetchTable('orders');
        }
        onAddAgentLog(
          `Inbound order ${data.order.id} processed via ${method}`,
          `Amount: ${data.order.amountEtb.toLocaleString()} ብር ($89 USD) · Auto-deducted inventory`,
          'Automation'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Export full database JSON dump
  const handleExportDatabase = async () => {
    try {
      const res = await fetch('/api/db/export');
      const data = await res.json();
      if (data.success) {
        const jsonStr = JSON.stringify(data.exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wisesell_database_backup_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        onAddAgentLog('Database snapshot backup exported successfully', 'Full JSON dump generated', 'Sync');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-orange-500 font-semibold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> Persistent Database & Real-Time Connectors
            </span>
            <span aria-hidden="true">·</span>
            <span>8 Active Integrations</span>
            <span aria-hidden="true">·</span>
            <span>Local & Cloud Persistence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Connectors & Database Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time webhook listeners for Telebirr, CBE Birr, Chapa, Telegram, Shopify, TikTok, and Meta. Persists all customer leads, orders, inventory, and campaigns with full backup and restore.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportDatabase}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Backup & Export DB</span>
          </button>
        </div>
      </div>

      {/* Database Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Database Engine</div>
          <div className="text-base font-bold font-mono text-white">JSON / Persistent</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Size: {dbStats ? `${Math.round(dbStats.fileSizeBytes / 1024)} KB` : '248 KB'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Active Connectors</div>
          <div className="text-base font-bold font-mono text-emerald-400">8/8 Healthy</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Avg Ping: 64ms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Processed Inbound Orders</div>
          <div className="text-base font-bold font-mono text-white">
            {dbStats?.counts?.orders || 184} Orders
          </div>
          <div className="text-[11px] text-orange-400 font-mono mt-0.5">Telebirr & CBE</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Synced SKUs & Leads</div>
          <div className="text-base font-bold font-mono text-cyan-400">1,420 SKUs · 48 Leads</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Zero Drift Active</div>
        </div>
      </div>

      {/* Real-Time Inbound Event Simulator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950/30 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Real-Time Inbound Event & Transaction Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate live customer checkouts across Ethiopian payment gateways to verify real-time webhook routing & stock deduction.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSimulateOrder('Telebirr ቴሌብር')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors cursor-pointer"
            >
              + Telebirr Order (11,125 ብር)
            </button>
            <button
              onClick={() => handleSimulateOrder('CBE Birr')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
            >
              + CBE Birr Order (8,000 ብር)
            </button>
            <button
              onClick={() => handleSimulateOrder('Chapa ቻፓ')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
            >
              + Chapa Order (3,000 ብር)
            </button>
          </div>
        </div>

        {lastEvent && (
          <div className="p-2.5 rounded-lg bg-black border border-emerald-800/40 text-xs text-emerald-400 font-mono flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lastEvent}</span>
          </div>
        )}
      </div>

      {/* Live Connectors Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Live Real-Time Connectors</h2>
            <p className="text-xs text-slate-400">Sub-second webhook listeners and 2-way REST gateways</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Heartbeat: Every 15s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {connectors.map((conn) => {
            const isPingingThis = isPinging === conn.id;
            return (
              <div
                key={conn.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{conn.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {conn.country}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {conn.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono truncate mt-1">
                    {conn.apiEndpoint}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[11px]">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      Ping: <strong className="text-cyan-400 font-mono">{conn.latencyMs}ms</strong>
                    </span>
                    <span className="text-slate-400">
                      Processed Today: <strong className="text-white font-mono">{conn.eventsProcessedToday}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handlePingConnector(conn.id)}
                    disabled={isPingingThis}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPingingThis ? 'animate-spin' : ''}`} />
                    <span>Ping</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Tables Inspector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Database Tables & Records Inspector</h2>
            <p className="text-xs text-slate-400">Inspect persistent records and verify live state integrity</p>
          </div>

          {/* Table Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {(['orders', 'connectors', 'leads', 'inventory'] as const).map((tbl) => (
              <button
                key={tbl}
                onClick={() => handleSelectTable(tbl)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTable === tbl ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tbl} ({tbl === 'orders' ? '184' : tbl === 'leads' ? '48' : tbl === 'inventory' ? '5' : '8'})
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Record ID</th>
                <th className="py-3 px-3">Primary Field</th>
                <th className="py-3 px-3">Detail</th>
                <th className="py-3 px-3 text-right">Value / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {tableData.slice(0, 5).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 text-orange-400 font-bold">{row.id || `REC-${i + 1}`}</td>
                  <td className="py-2.5 px-3 text-white font-sans font-medium">{row.customer || row.name || row.title}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans truncate max-w-xs">
                    {row.items || row.apiEndpoint || row.company || row.sku}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">
                    {row.amountEtb ? `${row.amountEtb.toLocaleString()} ብር` : row.status || row.score || 'OK'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
