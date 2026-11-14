import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase/config';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, writeBatch, query, where } from 'firebase/firestore';
import { Bot, BriefcaseBusiness, ChartNoAxesCombined, Megaphone, Search, Share2, Clapperboard, Boxes, Store, Send, LogOut, Languages, Plus, Trash2, Package, MessageSquare, LoaderCircle, Link2 } from 'lucide-react';

const API = 'https://wise-sell-ai-app2.abdico-veiws22.workers.dev';
const AGENTS = [
  { id: 'business-assistant', name: 'AI Business Assistant', icon: BriefcaseBusiness, desc: 'Business planning, operations and decision support', prompt: 'You are the owner’s practical small-business COO for Ethiopia. Diagnose the request, state assumptions and missing data, then provide prioritized actions, timelines, defensible ETB estimates, risks and KPIs. Cover cash flow, pricing, procurement, service, inventory and weekly execution. Never invent business records.' },
  { id: 'sales-agent', name: 'AI Sales Agent', icon: ChartNoAxesCombined, desc: 'Sales strategy, lead qualification and customer conversion', prompt: 'You are a consultative sales leader for Ethiopian SMEs. Build customer segments, qualification questions, discovery scripts, objection handling, follow-up sequences, offers and a sales funnel. Use ETB and relevant local channels. Never claim a sale occurred.' },
  { id: 'digital-marketing', name: 'Digital Marketing Agent', icon: Megaphone, desc: 'Campaign strategy, ads and marketing plans', prompt: 'You are a performance marketing strategist. Create campaign objectives, audience, offer, messages, creative variations, channel mix, budget assumptions, funnel, tests and KPIs. Adapt for Ethiopian mobile-first audiences and languages. Do not invent campaign spend or results.' },
  { id: 'seo-content', name: 'SEO & Content Marketing Agent', icon: Search, desc: 'Keyword strategy, SEO audits and content plans', prompt: 'You are a technical and content SEO specialist. Deliver search intent, keyword clusters, page mapping, title/meta drafts, internal linking, structured data guidance, content brief and measurement plan. Do not fabricate search volumes, rankings, backlinks or indexing.' },
  { id: 'social-media', name: 'Social Media Agent', icon: Share2, desc: 'Platform-specific social posts and calendars', prompt: 'You are a social commerce strategist. Create platform-tailored posts, captions, hooks, hashtags, creative briefs, community replies and 7/30-day calendars for WhatsApp, Telegram, Facebook, Instagram, TikTok, X, LinkedIn and YouTube. Label content as drafts; never claim publishing, scheduling or account access without verified official integration and user authorization.' },
  { id: 'video-audio', name: 'Video & Audio Marketing Agent', icon: Clapperboard, desc: 'Video concepts, scripts, voiceovers and audio ads', prompt: 'You are a video/audio campaign producer. Deliver a hook, concept, timed storyboard, shot list, on-screen text, full voiceover, CTA, captions, thumbnail idea and production checklist for vertical video, YouTube and audio ads. Clearly distinguish scripts from rendered media.' }
];

const PLATFORMS = [
  { name: 'WhatsApp', purpose: 'Customer conversations and product enquiries' },
  { name: 'Telegram', purpose: 'Business channels, groups and bot workflows' },
  { name: 'Facebook', purpose: 'Pages, communities and customer acquisition' },
  { name: 'Instagram', purpose: 'Visual product discovery and creator content' },
  { name: 'TikTok', purpose: 'Short-form product videos and discovery' },
  { name: 'X (Twitter)', purpose: 'Announcements, conversations and brand visibility' },
  { name: 'LinkedIn', purpose: 'B2B networking and professional leads' },
  { name: 'YouTube', purpose: 'Product demonstrations and video education' },
];
const labels = {
  en: { workspace: 'AI Workspace', inventory: 'Inventory', marketplace: 'Marketplace', signIn: 'Sign in', email: 'Email', password: 'Password', send: 'Send to agent', placeholder: 'Describe your business task...', signOut: 'Sign out', add: 'Add item', item: 'Product name', qty: 'Quantity', price: 'Price (ETB)', list: 'Create listing', listing: 'Marketplace listings', empty: 'No items yet', language: 'Language' },
  am: { workspace: 'የAI የሥራ ቦታ', inventory: 'እቃ አስተዳደር', marketplace: 'ገበያ', signIn: 'ግባ', email: 'ኢሜይል', password: 'የይለፍ ቃል', send: 'ለAI ላክ', placeholder: 'የንግድ ሥራዎን ይግለጹ...', signOut: 'ውጣ', add: 'እቃ ጨምር', item: 'የምርት ስም', qty: 'ብዛት', price: 'ዋጋ (ብር)', list: 'ወደ ገበያ አስገባ', listing: 'የገበያ ዝርዝሮች', empty: 'እስካሁን እቃ የለም', language: 'ቋንቋ' },
  om: { workspace: 'Iddoo hojii AI', inventory: 'Kuusaa', marketplace: 'Gabaa', signIn: 'Seeni', email: 'Imeelii', password: 'Jecha darbii', send: 'Ergi', placeholder: 'Hojii daldalaa ibsi...', signOut: 'Ba’i', add: 'Meeshaa dabali', item: 'Maqaa oomishaa', qty: 'Baay’ina', price: 'Gatii (ETB)', list: 'Gabaatti galchi', listing: 'Tarree gabaa', empty: 'Meeshaan hin jiru', language: 'Afaan' }
};
type Lang = 'en' | 'am' | 'om';
type Stock = { id: string; name: string; quantity: number; price: number; listed: boolean };
type MarketplaceListing = { id: string; itemId: string; ownerId: string; name: string; quantity: number; price: number; currency: string; status: string };

type ChatMessage = { id: string; senderId: string; text: string; createdAt?: any };type MarketplaceOrder = { id: string; listingId: string; itemName: string; buyerId: string; sellerId: string; quantity: number; unitPrice: number; totalPrice: number; currency: string; status: 'pending' | 'accepted' | 'rejected' };
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [authError, setAuthError] = useState('');
  const [lang, setLang] = useState<Lang>('en');
  const [section, setSection] = useState('workspace');
  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [error, setError] = useState('');
  const [stock, setStock] = useState<Stock[]>([]);
  const [publicListings, setPublicListings] = useState<MarketplaceListing[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [requestQuantities, setRequestQuantities] = useState<Record<string, string>>({});
  
  const [activeChatOrder, setActiveChatOrder] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatBusy, setChatBusy] = useState(false);const [orderBusy, setOrderBusy] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const t = labels[lang];
  const agent = useMemo(() => AGENTS.find(a => a.id === agentId) || AGENTS[0], [agentId]);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user?.uid) { setStock([]); return; }
    const inventoryRef = collection(db, 'users', user.uid, 'inventory');
    const unsubscribe = onSnapshot(inventoryRef, snapshot => {
      setStock(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as Stock)));
    }, err => setError('Could not sync inventory: ' + err.message));
    return unsubscribe;
  }, [user?.uid]);
  useEffect(() => {
    if (!user?.uid) { setPublicListings([]); return; }
    const unsubscribe = onSnapshot(query(collection(db, 'marketplace_listings'), where('status', '==', 'active')), snapshot => {
      setPublicListings(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as MarketplaceListing)).filter(item => item.status === 'active'));
    }, err => setError('Could not load marketplace: ' + err.message));
    return unsubscribe;
  }, [user?.uid]);
  useEffect(() => {
    if (!user?.uid) { setOrders([]); return; }
    const received = onSnapshot(query(collection(db, 'marketplace_orders'), where('sellerId', '==', user.uid)), snap => {
      const incoming = snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketplaceOrder));
      setOrders(current => [...current.filter(o => o.buyerId === user.uid), ...incoming]);
    }, err => setError('Could not load received orders: ' + err.message));
    const placed = onSnapshot(query(collection(db, 'marketplace_orders'), where('buyerId', '==', user.uid)), snap => {
      const outgoing = snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketplaceOrder));
      setOrders(current => [...current.filter(o => o.sellerId === user.uid), ...outgoing]);
    }, err => setError('Could not load your order requests: ' + err.message));
    return () => { received(); placed(); };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !activeChatOrder || !orders.some(o => o.id === activeChatOrder && (o.buyerId === user.uid || o.sellerId === user.uid))) { setChatMessages([]); return; }
    return onSnapshot(collection(db, 'marketplace_orders', activeChatOrder, 'messages'), snapshot => {
      const rows = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      rows.sort((a,b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
      setChatMessages(rows);
    }, err => setError('Could not load conversation: ' + err.message));
  }, [user?.uid, activeChatOrder, orders]);
  async function sendChatMessage(e: React.FormEvent) {
    e.preventDefault(); const order = orders.find(o => o.id === activeChatOrder); const body = chatDraft.trim();
    if (!user?.uid || !order || !body || body.length > 2000) return;
    setChatBusy(true);
    try { await setDoc(doc(db, 'marketplace_orders', order.id, 'messages', crypto.randomUUID()), { senderId: user.uid, text: body, createdAt: serverTimestamp() }); setChatDraft(''); setError(''); }
    catch (err: any) { setError('Could not send message: ' + (err?.message || 'Unknown error')); }
    finally { setChatBusy(false); }
  }
  async function requestOrder(listing: MarketplaceListing) {
    if (!user?.uid || listing.ownerId === user.uid) return;
    const qty = Number(requestQuantities[listing.id] || '1');
    if (!Number.isInteger(qty) || qty < 1 || qty > listing.quantity) {
      setError('Enter a whole-number quantity between 1 and the available stock.'); return;
    }
    setOrderBusy(listing.id); setError('');
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'marketplace_orders', id), {
        listingId: listing.id, itemName: listing.name, buyerId: user.uid,
        sellerId: listing.ownerId, quantity: qty, unitPrice: listing.price,
        totalPrice: qty * listing.price, currency: 'ETB', status: 'pending',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
      setRequestQuantities(current => ({ ...current, [listing.id]: '1' }));
    } catch (err: any) { setError('Could not send order request: ' + (err?.message || 'Unknown error')); }
    finally { setOrderBusy(null); }
  }
  async function updateOrderStatus(order: MarketplaceOrder, status: 'accepted' | 'rejected') {
    if (order.sellerId !== user?.uid || order.status !== 'pending') return;
    try {
      await setDoc(doc(db, 'marketplace_orders', order.id), { status, updatedAt: serverTimestamp() }, { merge: true });
      setError('');
    } catch (err: any) { setError('Could not update order: ' + (err?.message || 'Unknown error')); }
  }
  async function authenticate(e: React.FormEvent) {
    e.preventDefault(); setAuthError('');
    try { if (register) await createUserWithEmailAndPassword(auth, email.trim(), password); else await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (err: any) { setAuthError(err?.message || 'Authentication failed'); }
  }
  async function runAgent(e: React.FormEvent) {
    e.preventDefault(); if (!message.trim() || !user) return;
    setBusy(true); setError(''); setAnswer('');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/agents/${agentId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message: `${agent.prompt}\n\nBusiness context from your inventory: ${stock.length ? stock.map(i => `${i.name}: ${i.quantity} units at ${i.price} ETB each`).join('; ') : 'No inventory items recorded.'}\n\nRespond in ${lang === 'am' ? 'Amharic' : lang === 'om' ? 'Afaan Oromo' : 'English'}. Use clear headings, practical steps and useful tables. Never invent missing data.\n\nUser request: ${message.trim()}` }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || `Request failed (${res.status})`);
      if (!data.answer) throw new Error('The AI service returned no answer. Please try again.');
      setAnswer(data.answer);
    } catch (err: any) { setError(err?.message || 'Could not contact the AI service.'); }
    finally { setBusy(false); }
  }
  async function continueAgentResponse() {
    if (!user || !answer.trim() || continuing) return;
    setContinuing(true); setError('');
    try {
      const token = await user.getIdToken();
      const continuationPrompt = `${agent.prompt}

Business context from your inventory: ${stock.length ? stock.map(i => `${i.name}: ${i.quantity} units at ${i.price} ETB each`).join('; ') : 'No inventory items recorded.'}

Respond in ${lang === 'am' ? 'Amharic' : lang === 'om' ? 'Afaan Oromo' : 'English'}.
The user's original request was: ${message.trim()}

Your previous response ended here:
${answer}

Continue the response from the exact point where it stopped. Do not repeat the previous text. Finish the unfinished sentence or section, then complete every remaining part of the requested answer. Keep the same language, headings and formatting.`;
      const res = await fetch(`${API}/api/agents/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: continuationPrompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || `Request failed (${res.status})`);
      if (!data.answer) throw new Error('The AI service returned no continuation. Please try again.');
      setAnswer(previous => previous + '\n\n' + data.answer);
    } catch (err: any) {
      setError(err?.message || 'Could not continue the AI response.');
    } finally {
      setContinuing(false);
    }
  }
  async function addStock(e: React.FormEvent) {
    e.preventDefault(); if (!itemName.trim() || !user?.uid) return;
    const item: Stock = { id: crypto.randomUUID(), name: itemName.trim(), quantity: Math.max(0, Number(quantity) || 0), price: Math.max(0, Number(price) || 0), listed: false };
    try {
      await setDoc(doc(db, 'users', user.uid, 'inventory', item.id), { ...item, ownerId: user.uid, updatedAt: serverTimestamp() });
      setItemName(''); setQuantity('1'); setPrice(''); setError('');
    } catch (err: any) { setError('Could not save inventory item: ' + (err?.message || 'Unknown error')); }
  }
  async function toggleListing(id: string) {
    if (!user?.uid) return;
    const item = stock.find(s => s.id === id); if (!item) return;
    const nextListed = !item.listed;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', user.uid, 'inventory', id), { ...item, listed: nextListed, ownerId: user.uid, updatedAt: serverTimestamp() });
      const listingRef = doc(db, 'marketplace_listings', id);
      if (nextListed) batch.set(listingRef, { itemId: id, ownerId: user.uid, name: item.name, quantity: item.quantity, price: item.price, currency: 'ETB', status: 'active', updatedAt: serverTimestamp() });
      else batch.delete(listingRef);
      await batch.commit();
      setError('');
    } catch (err: any) { setError('Could not update marketplace listing: ' + (err?.message || 'Unknown error')); }
  }
  async function removeStock(id: string) {
    if (!user?.uid) return;
    try {
      const item = stock.find(s => s.id === id);
      const batch = writeBatch(db);
      batch.delete(doc(db, 'users', user.uid, 'inventory', id));
      if (item?.listed) batch.delete(doc(db, 'marketplace_listings', id));
      await batch.commit();
      setError('');
    } catch (err: any) { setError('Could not remove item: ' + (err?.message || 'Unknown error')); }
  }
  if (!user) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-5"><form onSubmit={authenticate} className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-7 space-y-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-500 p-3"><Bot size={26}/></div><div><h1 className="text-2xl font-bold">Wise Sell AI</h1><p className="text-sm text-slate-400">Business growth workspace</p></div></div><div className="flex justify-end"><select aria-label={t.language} value={lang} onChange={e => setLang(e.target.value as Lang)} className="rounded-xl bg-slate-800 p-2 text-sm"><option value="en">English</option><option value="am">አማርኛ</option><option value="om">Afaan Oromo</option></select></div><h2 className="text-lg font-semibold">{register ? 'Create account' : t.signIn}</h2><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.email} className="w-full rounded-xl bg-slate-800 p-3 outline-none"/><input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={t.password} className="w-full rounded-xl bg-slate-800 p-3 outline-none"/>{authError && <p className="text-sm text-rose-400">{authError}</p>}<button className="w-full rounded-xl bg-emerald-500 p-3 font-semibold text-slate-950">{register ? 'Create account' : t.signIn}</button><button type="button" onClick={()=>setRegister(!register)} className="w-full text-sm text-emerald-300">{register ? 'Already have an account? Sign in' : 'Create a new account'}</button><p className="text-xs text-slate-500">Secure sign-in is provided by Firebase Authentication.</p></form></div>;
  return <div className="min-h-screen bg-slate-950 text-slate-100"><header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-500 p-2 text-slate-950"><Bot size={22}/></div><div><h1 className="font-bold">Wise Sell AI</h1><p className="text-xs text-slate-400">AI-powered business platform · Ethiopia</p></div></div><div className="flex items-center gap-2"><Languages size={16}/><select value={lang} onChange={e=>setLang(e.target.value as Lang)} className="max-w-28 rounded-lg bg-slate-800 p-2 text-xs"><option value="en">English</option><option value="am">አማርኛ</option><option value="om">Afaan Oromo</option></select><button onClick={()=>signOut(auth)} title={t.signOut} className="rounded-lg bg-slate-800 p-2"><LogOut size={17}/></button></div></div></header>
  <div className="mx-auto grid max-w-7xl gap-5 p-4 md:grid-cols-[245px_1fr]"><aside className="space-y-2"><button onClick={()=>setSection('workspace')} className={`w-full rounded-xl p-3 text-left ${section==='workspace'?'bg-emerald-500 text-slate-950':'bg-slate-900'}`}><MessageSquare className="mr-2 inline" size={17}/>{t.workspace}</button>{AGENTS.map(a=><button key={a.id} onClick={()=>{setSection('workspace');setAgentId(a.id);setAnswer('');setError('')}} className={`w-full rounded-xl p-3 text-left text-sm ${section==='workspace'&&agentId===a.id?'bg-slate-800 text-emerald-300':'text-slate-300 hover:bg-slate-900'}`}><a.icon className="mr-2 inline" size={16}/>{a.name}</button>)}<div className="my-3 border-t border-slate-800"/><button onClick={()=>setSection('inventory')} className={`w-full rounded-xl p-3 text-left ${section==='inventory'?'bg-emerald-500 text-slate-950':'bg-slate-900'}`}><Boxes className="mr-2 inline" size={17}/>{t.inventory}</button><button onClick={()=>setSection('marketplace')} className={`w-full rounded-xl p-3 text-left ${section==='marketplace'?'bg-emerald-500 text-slate-950':'bg-slate-900'}`}><Store className="mr-2 inline" size={17}/>{t.marketplace}</button><button onClick={()=>setSection('integrations')} className={`w-full rounded-xl p-3 text-left ${section==='integrations'?'bg-emerald-500 text-slate-950':'bg-slate-900'}`}><Link2 className="mr-2 inline" size={17}/>Social connections</button></aside>
  <main className="min-w-0 space-y-5">{section==='workspace' ? <><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-start gap-3"><agent.icon size={26} className="mt-1 text-emerald-400"/><div><h2 className="text-xl font-bold">{agent.name}</h2><p className="text-sm text-slate-400">{agent.desc}</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{AGENTS.map(a=><button key={a.id} onClick={()=>{setAgentId(a.id);setAnswer('');setError('')}} className={`rounded-xl border p-3 text-left text-xs ${agentId===a.id?'border-emerald-500 bg-emerald-500/10':'border-slate-700 bg-slate-950'}`}>{a.name}</button>)}</div></section><form onSubmit={runAgent} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3"><label className="text-sm font-semibold">Your business request</label><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} placeholder={t.placeholder} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-emerald-500"/><button disabled={busy||!message.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 p-3 font-semibold text-slate-950 disabled:opacity-50">{busy?<><LoaderCircle className="animate-spin" size={18}/>Working...</>:<><Send size={17}/>{t.send}</>}</button></form>{error&&<div className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-300">{error}</div>}{answer&&<section className="rounded-2xl border border-emerald-800 bg-slate-900 p-5"><h3 className="mb-3 font-semibold text-emerald-300">AI response</h3><div className="whitespace-pre-wrap text-sm leading-7">{answer}</div><button type="button" onClick={continueAgentResponse} disabled={continuing||busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950/50 p-3 text-sm font-semibold text-emerald-300 disabled:opacity-50">{continuing?<><LoaderCircle className="animate-spin" size={16}/>Continuing response...</>:"Continue response"}</button></section>}</> : section==='inventory' ? <><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-xl font-bold">{t.inventory}</h2><p className="mt-1 text-sm text-slate-400">Your products sync securely with your Firebase account.</p><form onSubmit={addStock} className="mt-4 grid gap-3 sm:grid-cols-4"><input required value={itemName} onChange={e=>setItemName(e.target.value)} placeholder={t.item} className="rounded-xl bg-slate-950 p-3 sm:col-span-2"/><input type="number" min="0" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder={t.qty} className="rounded-xl bg-slate-950 p-3"/><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} placeholder={t.price} className="rounded-xl bg-slate-950 p-3"/><button className="rounded-xl bg-emerald-500 p-3 font-semibold text-slate-950 sm:col-span-4"><Plus className="mr-2 inline" size={17}/>{t.add}</button></form></section><section className="space-y-3">{stock.length===0?<p className="rounded-xl bg-slate-900 p-5 text-slate-400">{t.empty}</p>:stock.map(s=><div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-center gap-3"><Package className="text-emerald-400"/><div><p className="font-semibold">{s.name}</p><p className="text-xs text-slate-400">{s.quantity} units · {s.price.toLocaleString()} ETB</p></div></div><div className="flex gap-2"><button onClick={()=>toggleListing(s.id)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs">{s.listed?'Unlist':'List in marketplace'}</button><button onClick={()=>removeStock(s.id)} className="rounded-lg bg-rose-950 p-2 text-rose-300"><Trash2 size={16}/></button></div></div>)}</section></> : section==='integrations' ? <><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center gap-2"><Link2 className="text-emerald-400"/><h2 className="text-xl font-bold">Social platform connections</h2></div><p className="mt-2 text-sm leading-6 text-slate-400">Prepare Wise Sell AI to work with your business channels. Each platform requires its own approved API access and account authorization before messages, analytics, scheduling or publishing can run.</p><div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-200">No social accounts are connected yet. Wise Sell AI will not claim to publish or message on your behalf until an official connection is completed.</div></section><section className="grid gap-3 sm:grid-cols-2">{PLATFORMS.map(p=><div key={p.name} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{p.name}</h3><span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">Not connected</span></div><p className="mt-2 text-sm text-slate-400">{p.purpose}</p><p className="mt-3 text-xs text-slate-500">Connection requires official platform authorization.</p></div>)}</section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="font-semibold">Connection rollout</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-400"><li>Choose the first business channel to connect.</li><li>Register or configure its official developer application.</li><li>Set secure OAuth redirect and server-side credentials.</li><li>Authorize the business account and test permitted scopes.</li><li>Enable only the features approved by that platform.</li></ol></section></> : <><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-xl font-bold">{t.listing}</h2><p className="mt-1 text-sm text-slate-400">Browse active product listings shared by Wise Sell AI sellers.</p></section>{publicListings.length===0?<p className="rounded-xl bg-slate-900 p-5 text-slate-400">No active listings yet. Sellers can publish products from Inventory.</p>:publicListings.map(s=><div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{s.name}</p><p className="text-sm text-slate-400">{s.price.toLocaleString()} {s.currency} · Available: {s.quantity}</p><p className="mt-1 text-xs text-slate-500">{s.ownerId===user.uid?'Your product':'Seller on Wise Sell AI'}</p></div>{s.ownerId===user.uid?<span className="rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-300">Your listing</span>:<span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Available</span>}</div>{s.ownerId!==user.uid&&<div className="mt-3 flex flex-wrap gap-2"><input aria-label="Order quantity" type="number" min="1" max={s.quantity} value={requestQuantities[s.id]??'1'} onChange={e=>setRequestQuantities(v=>({...v,[s.id]:e.target.value}))} className="w-24 rounded-lg bg-slate-950 p-2 text-sm"/><button disabled={orderBusy===s.id||s.quantity<1} onClick={()=>requestOrder(s)} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{orderBusy===s.id?'Sending...':'Request to buy'}</button></div>}</div>)}
<section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="text-lg font-bold">Buyer & seller orders</h3><p className="mt-1 text-sm text-slate-400">Order requests are visible only to the buyer and the seller.</p>{orders.length===0?<p className="mt-3 text-sm text-slate-500">No order requests yet.</p>:<div className="mt-3 space-y-3">{orders.map(o=><div key={o.id} className="rounded-xl border border-slate-700 p-3"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-semibold">{o.itemName}</p><p className="text-xs text-slate-400">{o.quantity} × {o.unitPrice.toLocaleString()} ETB = {o.totalPrice.toLocaleString()} ETB</p><p className="text-xs text-slate-500">{o.buyerId===user.uid?'You requested':'Incoming buyer request'} · Status: {o.status}</p></div><div className="flex flex-wrap gap-2">{o.sellerId===user.uid&&o.status==='pending'&&<><button onClick={()=>updateOrderStatus(o,'accepted')} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold">Accept</button><button onClick={()=>updateOrderStatus(o,'rejected')} className="rounded-lg bg-rose-900 px-3 py-2 text-xs">Reject</button></>}<button onClick={()=>setActiveChatOrder(o.id)} className="rounded-lg bg-slate-700 px-3 py-2 text-xs">Open messages</button></div></div></div>)}</div>}</section>{activeChatOrder&&<section className="rounded-2xl border border-emerald-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><div><h3 className="font-bold">Order conversation</h3><p className="text-xs text-slate-400">{orders.find(o=>o.id===activeChatOrder)?.itemName}</p></div><button onClick={()=>setActiveChatOrder(null)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs">Close</button></div><div className="mt-4 max-h-72 space-y-2 overflow-y-auto">{chatMessages.length===0?<p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>:chatMessages.map(m=><div key={m.id} className={m.senderId===user.uid?'ml-8 rounded-xl bg-emerald-950 p-3':'mr-8 rounded-xl bg-slate-800 p-3'}><p className="text-xs text-slate-400">{m.senderId===user.uid?'You':'Other participant'}</p><p className="whitespace-pre-wrap text-sm">{m.text}</p></div>)}</div><form onSubmit={sendChatMessage} className="mt-3 flex gap-2"><input value={chatDraft} onChange={e=>setChatDraft(e.target.value)} maxLength={2000} placeholder="Write a message..." className="min-w-0 flex-1 rounded-xl bg-slate-950 p-3 text-sm"/><button disabled={chatBusy||!chatDraft.trim()} className="rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-slate-950 disabled:opacity-50">{chatBusy?'Sending...':'Send'}</button></form></section>}</>}</main></div></div>;
}
