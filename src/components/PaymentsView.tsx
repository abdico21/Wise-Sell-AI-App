import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { CreditCard, ShieldCheck, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

const API = 'https://wise-sell-ai-app2.abdico-veiws22.workers.dev';
type Provider = { id: string; name: string; available: boolean; mode: string };
type Payment = { reference: string; status: string; checkoutUrl?: string | null; amountMinor?: number; currency?: string };

export const PaymentsView: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [amount, setAmount] = useState('100');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [selected, setSelected] = useState('chapa');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProviders = async () => {
    try {
      const response = await fetch(API + '/api/payments/providers');
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.providers)) throw new Error(data.error || 'Could not load payment providers.');
      setProviders(data.providers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment service unavailable.');
    }
  };
  useEffect(() => { void loadProviders(); }, []);

  const createCheckout = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Sign in before starting a payment.');
      const parsed = Number(amount);
      if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed * 100)) throw new Error('Enter a valid ETB amount with up to two decimal places.');
      if (!email.trim()) throw new Error('Enter the payer email address.');
      const token = await user.getIdToken();
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch(API + '/api/payments/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ provider: selected, amountMinor: Math.round(parsed * 100), currency: 'ETB', email: email.trim() })
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.payment) throw new Error(data.detail || data.error || 'Checkout could not be initialized.');
      setPayment(data.payment);
      if (data.payment.checkoutUrl) window.location.assign(data.payment.checkoutUrl);
      else setNotice('Payment intent is recorded. Checkout URL is not yet available; retry or contact support.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start checkout.');
    } finally { setBusy(false); }
  };

  const verifyPayment = async () => {
    if (!payment?.reference) return;
    setError(''); setNotice(''); setBusy(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Sign in to verify this payment.');
      const token = await user.getIdToken();
      const response = await fetch(API + '/api/payments/' + encodeURIComponent(payment.reference) + '/verify', {
        method: 'POST', headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.detail || data.error || 'Payment verification failed.');
      setPayment(data.payment);
      setNotice(data.payment.status === 'paid' ? 'Payment verified successfully by Chapa.' : 'Payment is not yet confirmed. Do not fulfill the order.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not verify payment.');
    } finally { setBusy(false); }
  };

  return <div className="space-y-5">
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-orange-400"/><div><h1 className="text-xl font-bold text-white">Payments & Provider Connections</h1><p className="text-xs text-slate-400">Ethiopian payment methods · ETB · authenticated server-side checkout</p></div></div>
      <p className="mt-3 text-sm text-slate-300">Payment providers are enabled only after merchant credentials and secure server configuration are verified. A checkout redirect is not proof of payment. This staging flow is test-mode and platform-merchant only; it is not yet connected to seller accounts or marketplace orders.</p>
    </section>
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {providers.map(provider => <div key={provider.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex items-center justify-between gap-2"><strong className="text-white">{provider.name}</strong><span className={provider.available ? 'text-xs text-emerald-400' : 'text-xs text-amber-300'}>{provider.available ? 'Available' : 'Setup required'}</span></div>
        <p className="mt-2 text-xs text-slate-400">{provider.mode.replaceAll('_', ' ')}</p>
        <button type="button" disabled={!provider.available} onClick={() => setSelected(provider.id)} className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${selected === provider.id ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-200'} disabled:opacity-40`}>{selected === provider.id ? 'Selected' : 'Select provider'}</button>
      </div>)}
    </section>
    <form onSubmit={createCheckout} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h2 className="font-semibold text-white">Start secure checkout</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-slate-300">Amount (ETB)<input type="number" min="1" step="0.01" required value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white"/></label>
        <label className="text-xs text-slate-300">Payer email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="customer@example.com"/></label>
      </div>
      <button disabled={busy || !auth.currentUser || !providers.find(p=>p.id===selected)?.available} className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{busy ? 'Please wait…' : 'Continue to provider checkout'}</button>
      {!auth.currentUser && <p className="text-xs text-amber-300">Sign in to initiate a payment.</p>}
      <p className="text-[11px] text-slate-400">Chapa is currently a platform test checkout only. Seller-specific collections, order fulfillment, Telebirr direct and CBE Birr direct remain disabled until merchant onboarding and secure provider integrations are completed.</p>
    </form>
    {payment && <section className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck className="h-4 w-4 text-orange-400"/>Payment reference: {payment.reference}</div>
      <p className="text-sm text-slate-300">Status: <strong>{payment.status}</strong> · {payment.currency || 'ETB'} {payment.amountMinor ? (payment.amountMinor / 100).toFixed(2) : ''}</p>
      <button type="button" onClick={verifyPayment} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white disabled:opacity-40"><RefreshCw className="h-4 w-4"/>Verify payment with provider</button>
    </section>}
    {error && <p role="alert" className="flex items-center gap-2 rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200"><AlertCircle className="h-4 w-4"/>{error}</p>}
    {notice && <p className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">{notice}</p>}
  </div>;
};
