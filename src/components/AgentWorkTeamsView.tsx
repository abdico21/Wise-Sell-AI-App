import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { Bot, Send, Loader2, CheckCircle2, AlertCircle, Users } from 'lucide-react';

const AGENTS = [
  { id: 'business-assistant', name: 'AI Business Assistant', task: 'Analyze business performance and prepare a practical growth plan.' },
  { id: 'sales-agent', name: 'AI Sales Agent', task: 'Qualify leads, handle objections and prepare a sales follow-up plan.' },
  { id: 'digital-marketing', name: 'Digital Marketing Agent', task: 'Create a customer acquisition campaign with channels, budget considerations and KPIs.' },
  { id: 'seo-content', name: 'SEO & Content Marketing Agent', task: 'Create a search-focused content plan and product page improvements.' },
  { id: 'social-media', name: 'Social Media Agent', task: 'Prepare platform-specific posts and a weekly engagement plan.' },
  { id: 'video-audio', name: 'Video & Audio Marketing Agent', task: 'Create a short-form video storyboard and audio advertising script.' },
];

const API = 'https://wise-sell-ai-app2.abdico-veiws22.workers.dev';

export const AgentWorkTeamsView: React.FC = () => {
  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [task, setTask] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamAnswer, setTeamAnswer] = useState('');
  const [teamError, setTeamError] = useState('');
  const [contributions, setContributions] = useState<Array<{ agent: string; answer: string }>>([]);

  const runAgent = async () => {
    setError('');
    setAnswer('');
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in to run an AI agent.');
      const message = task.trim();
      if (!message) throw new Error('Enter a business task first.');
      const token = await user.getIdToken();
      const response = await fetch(`${API}/api/agents/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error(data.detail || data.error || `Agent request failed (${response.status}).`);
      }
      setAnswer(data.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to contact the AI service.');
    } finally {
      setLoading(false);
    }
  };

  const runCoordinatedTeam = async () => {
    setTeamError('');
    setTeamAnswer('');
    setContributions([]);
    setError('');
    setAnswer('');
    setTeamLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in to run the coordinated AI team.');
      const message = task.trim();
      if (!message) throw new Error('Enter a business task first.');
      const token = await user.getIdToken();
      const response = await fetch(API + '/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error(data.detail || data.error || 'Team request failed (' + response.status + ').');
      }
      setTeamAnswer(data.answer);
      setContributions(Array.isArray(data.contributions) ? data.contributions : []);
    } catch (e) {
      setTeamError(e instanceof Error ? e.message : 'Unable to contact the coordinated AI service.');
    } finally {
      setTeamLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Wise Sell AI · Agent work teams</p>
            <h1 className="text-2xl font-bold text-white">Six AI Business Teams</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-300">Choose an agent, describe a real business task and receive an authenticated AI response. Agents currently generate advice and content; they do not independently publish posts, contact customers, change stock or spend advertising budgets.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AGENTS.map((agent, index) => (
          <button key={agent.id} onClick={() => { setAgentId(agent.id); setTask(agent.task); setAnswer(''); setError(''); }}
            className={`text-left p-4 rounded-xl border transition-colors ${agentId === agent.id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-600'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">TEAM 0{index + 1}</span>
              <Bot className="w-4 h-4 text-orange-400" />
            </div>
            <h2 className="mt-2 text-sm font-bold text-white">{agent.name}</h2>
            <p className="mt-1 text-xs text-slate-400">{agent.task}</p>
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2" htmlFor="agent-task">Business task</label>
          <textarea id="agent-task" value={task} onChange={e => setTask(e.target.value)} rows={5} maxLength={8000}
            placeholder="Example: I sell coffee in Addis Ababa. Create a 7-day plan to attract wholesale buyers, convert inquiries and track stock needs."
            className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500" />
          <p className="mt-1 text-[10px] text-slate-500 text-right">{task.length}/8000</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={runAgent} disabled={loading || teamLoading || !task.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-4 py-3 text-sm font-semibold text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Working…' : 'Run selected agent'}
          </button>
          <button onClick={runCoordinatedTeam} disabled={teamLoading || loading || !task.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-3 text-sm font-semibold text-white">
            {teamLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            {teamLoading ? 'Coordinating six agents…' : 'Coordinate all six agents'}
          </button>
        </div>
        {teamError && <div role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{teamError}</div>}
        {error && <div role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        {answer && <div className="rounded-xl border border-emerald-900 bg-slate-950 p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-3"><CheckCircle2 className="w-4 h-4" /> AI response · {AGENTS.find(a => a.id === agentId)?.name}</div>
          <div className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{answer}</div>
        </div>}
        {teamAnswer && <div className="rounded-xl border border-orange-700/60 bg-slate-950 p-4 space-y-4">
          <div className="flex items-center gap-2 text-orange-300 text-xs font-semibold"><CheckCircle2 className="w-4 h-4" /> Coordinated six-agent action plan</div>
          <div className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{teamAnswer}</div>
          {contributions.length > 0 && <div className="space-y-2 border-t border-slate-800 pt-3">
            <p className="text-xs font-semibold text-slate-300">Specialist handoffs</p>
            {contributions.map(item => (
              <details key={item.agent} className="rounded-lg border border-slate-800 p-3">
                <summary className="cursor-pointer text-sm font-medium text-orange-200">{AGENTS.find(agent => agent.id === item.agent)?.name || item.agent}</summary>
                <div className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-300">{item.answer}</div>
              </details>
            ))}
          </div>}
          <p className="text-[11px] text-slate-500">All agents share the same task. The Business Assistant combines their findings into one plan. Recommendations only—no external posts, messages, purchases or account changes were made.</p>
        </div>}
      </section>
    </div>
  );
};
