import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  Building,
  Target,
  Send,
  Plus
} from 'lucide-react';
import { LeadRecord } from '../types';

interface CrmSalesforceViewProps {
  leads: LeadRecord[];
  onUpdateLeads: (leads: LeadRecord[]) => void;
  onAddAgentLog: (action: string, impact: string, category: 'Lead Routing' | 'Sync') => void;
}

export const CrmSalesforceView: React.FC<CrmSalesforceViewProps> = ({
  leads,
  onUpdateLeads,
  onAddAgentLog,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || 'lead-801');
  const [isQualifying, setIsQualifying] = useState<boolean>(false);
  const [testLeadResult, setTestLeadResult] = useState<any>(null);

  // Form for testing a new prospect with Gemini
  const [leadName, setLeadName] = useState<string>('Sophia Chen');
  const [company, setCompany] = useState<string>('Apex Activewear Group');
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('$310,000/mo');
  const [channels, setChannels] = useState<string>('Shopify, TikTok Shop, Amazon');
  const [message, setMessage] = useState<string>('We are losing 20% of sales due to manual inventory updates between Shopify and TikTok Shop. Also need automated ad budget reallocation.');
  const [budget, setBudget] = useState<string>('$20,000/yr+');

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  // Manual or 1-click sync to Salesforce
  const handleSyncToSalesforce = (leadId: string) => {
    const updated = leads.map((l) => {
      if (l.id !== leadId) return l;
      const newSfId = l.salesforceLeadId || `SF-00${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        ...l,
        salesforceStatus: 'Synced' as const,
        salesforceLeadId: newSfId,
        assignedRep: l.assignedRep === 'Unassigned (Self-Serve Queue)' 
          ? 'Marcus Sterling (Enterprise Pod 1)' 
          : l.assignedRep,
      };
    });

    onUpdateLeads(updated);
    const targetLead = leads.find((l) => l.id === leadId);
    onAddAgentLog(
      `Synchronized lead "${targetLead?.name}" (${targetLead?.company}) to Salesforce CRM`,
      `Created Lead Object SF-0049812 & routed to Enterprise Sales Pod 1`,
      'Lead Routing'
    );
  };

  // Run Real-Time AI Lead Qualifier with Gemini
  const handleRunAiLeadQualifier = async () => {
    setIsQualifying(true);
    try {
      const res = await fetch('/api/ai/lead-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName,
          company,
          monthlyRevenue,
          channels,
          message,
          budget,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestLeadResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQualifying(false);
    }
  };

  // Add qualified prospect directly into leads table
  const handleAddQualifiedLeadToTable = () => {
    if (!testLeadResult) return;

    const newLead: LeadRecord = {
      id: `lead-${Date.now()}`,
      name: leadName,
      email: `${leadName.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      company,
      monthlyGmv: monthlyRevenue,
      channels: channels.split(',').map((c) => c.trim()),
      score: testLeadResult.score || 92,
      tier: testLeadResult.tier || 'Tier 1 Enterprise',
      intent: testLeadResult.intent || 'High Purchase Intent',
      salesforceStatus: 'Synced',
      salesforceLeadId: `SF-00${Math.floor(10000 + Math.random() * 90000)}`,
      assignedRep: 'Marcus Sterling (Enterprise Pod 1)',
      lastInteraction: 'Just now',
      inquirySnippet: message,
      bant: {
        budget: testLeadResult.bantAnalysis?.budget || budget,
        authority: testLeadResult.bantAnalysis?.authority || 'Confirmed Decision Maker',
        need: testLeadResult.bantAnalysis?.need || 'Urgent Omnichannel Sync',
        timeline: testLeadResult.bantAnalysis?.timeline || 'Immediate',
      },
    };

    onUpdateLeads([newLead, ...leads]);
    setSelectedLeadId(newLead.id);
    onAddAgentLog(
      `AI Qualified & Synced new inbound lead "${newLead.name}" (${newLead.company})`,
      `Score: ${newLead.score}/100 -> Synced directly into Salesforce Pipeline`,
      'Lead Routing'
    );
    setTestLeadResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Header and Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Salesforce Agent Connectivity</span>
            <span aria-hidden="true">·</span>
            <span>Automated BANT Lead Qualification & 2-Way CRM Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Salesforce CRM Integration & Lead Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inbound customer inquiries and DMs across all social channels are qualified in real time with BANT scoring and automatically synchronized into Salesforce Lead & Opportunity objects.
          </p>
        </div>

        {/* Salesforce Connection Badge */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
            SF
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <span>Salesforce NA124 (Enterprise)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              2-Way Sync Active · 85ms Latency
            </div>
          </div>
        </div>
      </div>

      {/* Salesforce Pipeline Stage Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Inbound Leads</div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-1">18 Leads</div>
          <div className="text-[11px] text-slate-400 font-mono">$94,000 GMV</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-indigo-400 font-medium">AI Qualified (BANT)</div>
          <div className="text-lg font-bold font-mono tabular-nums text-indigo-300 mt-1">24 Hot</div>
          <div className="text-[11px] text-slate-400 font-mono">$148,000 GMV</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-cyan-400 font-medium">Demo Scheduled</div>
          <div className="text-lg font-bold font-mono tabular-nums text-cyan-300 mt-1">8 Accounts</div>
          <div className="text-[11px] text-slate-400 font-mono">$82,000 GMV</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-purple-400 font-medium">Proposal Sent</div>
          <div className="text-lg font-bold font-mono tabular-nums text-purple-300 mt-1">5 Accounts</div>
          <div className="text-[11px] text-slate-400 font-mono">$64,000 GMV</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium">Closed Won</div>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-400 mt-1">11 Accounts</div>
          <div className="text-[11px] text-emerald-400 font-mono">$192,000 GMV</div>
        </div>
      </div>

      {/* Main Lead Records & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inbound Lead Qualification Roster</h2>
            <span className="text-xs text-slate-400 font-mono">{leads.length} Records</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Lead & Company</th>
                  <th className="py-3 px-2 text-center">Score</th>
                  <th className="py-3 px-2">Tier</th>
                  <th className="py-3 px-2">SF Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leads.map((lead) => {
                  const isSelected = lead.id === selectedLeadId;
                  return (
                    <tr 
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`cursor-pointer hover:bg-slate-850/50 transition-colors ${
                        isSelected ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-slate-400 text-[11px]">{lead.company} · {lead.monthlyGmv}</div>
                      </td>

                      <td className="py-3 px-2 text-center font-mono tabular-nums">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          lead.score >= 90 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                            : lead.score >= 75
                            ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {lead.score}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-[11px] text-slate-300 whitespace-nowrap">
                        {lead.tier}
                      </td>

                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${
                          lead.salesforceStatus === 'Synced'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                        }`}>
                          {lead.salesforceStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {lead.salesforceStatus === 'Synced' ? (
                          <span className="text-[11px] font-mono text-slate-400">
                            {lead.salesforceLeadId}
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncToSalesforce(lead.id);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors whitespace-nowrap"
                          >
                            Sync to SF
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Deep Dive & BANT Framework */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-indigo-400 font-semibold">{selectedLead.tier}</span>
                <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                <div className="text-xs text-slate-400">{selectedLead.company} · {selectedLead.email}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Qualification Score</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{selectedLead.score}/100</div>
              </div>
            </div>

            {/* BANT Framework Box */}
            <div className="mt-4 space-y-3">
              <div className="text-xs font-semibold text-slate-300">BANT Analysis (Salesforce Mapped):</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Budget</div>
                  <div className="text-slate-200 mt-0.5">{selectedLead.bant.budget}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Authority</div>
                  <div className="text-slate-200 mt-0.5">{selectedLead.bant.authority}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Need</div>
                  <div className="text-slate-200 mt-0.5">{selectedLead.bant.need}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Timeline</div>
                  <div className="text-slate-200 mt-0.5">{selectedLead.bant.timeline}</div>
                </div>
              </div>

              {/* Inquiry Snippet */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Inbound Channel Message:</div>
                <p className="text-slate-300 italic">"{selectedLead.inquirySnippet}"</p>
              </div>

              {/* Assigned Rep & Status */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Assigned Sales Owner:</span>
                <span className="font-semibold text-slate-200">{selectedLead.assignedRep}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Last interaction: {selectedLead.lastInteraction}
            </span>
            {selectedLead.salesforceStatus !== 'Synced' && (
              <button
                onClick={() => handleSyncToSalesforce(selectedLead.id)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
              >
                Sync Lead to Salesforce
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time AI Lead Qualifier Tool (Interactive Gemini Test Suite) */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Inbound Qualification Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white">Test Inbound Prospect with Gemini 3.8 Flash</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter any prospective buyer message to see autonomous BANT classification, intent scoring, and Salesforce routing instructions.
            </p>
          </div>

          <button
            onClick={handleRunAiLeadQualifier}
            disabled={isQualifying}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isQualifying ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Evaluating Inbound...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Qualify Prospect Live</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Prospect Name</label>
            <input
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Company / Store</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Monthly GMV</label>
            <input
              type="text"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Prospect Inquiry / Social DM</label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* AI Qualification Result Output */}
        {testLeadResult && (
          <div className="p-5 rounded-xl bg-slate-950 border border-indigo-900/50 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  Score: {testLeadResult.score}/100
                </span>
                <span className="text-xs font-semibold text-white">
                  {testLeadResult.tier}
                </span>
              </div>
              <button
                onClick={handleAddQualifiedLeadToTable}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Salesforce Pipeline</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="font-semibold text-indigo-400">Identified Intent:</div>
                <p className="text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  {testLeadResult.intent}
                </p>

                <div className="font-semibold text-purple-400">Salesforce Action & Routing:</div>
                <p className="text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  {testLeadResult.salesforceAction}
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-cyan-400">BANT Breakdown:</div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1 text-slate-300 text-[11px]">
                  <div><span className="text-slate-400">Budget:</span> {testLeadResult.bantAnalysis?.budget}</div>
                  <div><span className="text-slate-400">Authority:</span> {testLeadResult.bantAnalysis?.authority}</div>
                  <div><span className="text-slate-400">Need:</span> {testLeadResult.bantAnalysis?.need}</div>
                  <div><span className="text-slate-400">Timeline:</span> {testLeadResult.bantAnalysis?.timeline}</div>
                </div>

                <div className="font-semibold text-emerald-400">Recommended Sales Outreach:</div>
                <p className="text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  {testLeadResult.recommendedOutreach}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
