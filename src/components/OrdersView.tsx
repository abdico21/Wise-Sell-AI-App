import React, { useState } from 'react';
import { SalesOrder, InventoryItem } from '../types';
import { ShoppingCart, PlusCircle, CheckCircle2, PackageCheck } from 'lucide-react';

interface OrdersViewProps {
  orders: SalesOrder[];
  inventory: InventoryItem[];
  onUpdateOrders: (orders: SalesOrder[]) => void;
  onAddAgentLog: (action: string, impact: string, category: 'Financial' | 'Sync') => void;
  currency: 'ETB' | 'USD';
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, inventory, onUpdateOrders, onAddAgentLog, currency }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [productId, setProductId] = useState(inventory[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<SalesOrder['paymentMethod']>('Telebirr');
  const [formError, setFormError] = useState('');
  const selectedProduct = inventory.find(item => item.id === productId);
  const total = (selectedProduct?.price || 0) * quantity;

  const createOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customerName.trim() || !customerContact.trim() || !selectedProduct || quantity < 1) {
      setFormError('Enter customer name, contact, a product, and a valid quantity.');
      return;
    }
    if (quantity > selectedProduct.totalStock) {
      setFormError(`Only ${selectedProduct.totalStock} units are currently listed in stock.`);
      return;
    }
    const id = `order-${Date.now()}`;
    const order: SalesOrder = {
      id, orderNumber: `WS-${Date.now().toString().slice(-8)}`, customerName: customerName.trim(),
      customerContact: customerContact.trim(), productId: selectedProduct.id, productName: selectedProduct.title,
      quantity, unitPrice: selectedProduct.price, totalAmount: total, currency,
      deliveryLocation: deliveryLocation.trim(), paymentMethod, status: 'Pending', createdAt: new Date().toISOString(),
    };
    onUpdateOrders([order, ...orders]);
    onAddAgentLog(`Sales order ${order.orderNumber} recorded`, `${quantity} × ${selectedProduct.title}; ${currency} ${total.toLocaleString()}. Stock is not deducted until fulfillment is implemented.`, 'Financial');
    setCustomerName(''); setCustomerContact(''); setQuantity(1); setDeliveryLocation(''); setFormError('');
  };

  const updateStatus = (order: SalesOrder, status: SalesOrder['status']) => {
    onUpdateOrders(orders.map(item => item.id === order.id ? { ...item, status } : item));
    onAddAgentLog(`Order ${order.orderNumber} status changed to ${status}`, 'Order status saved to the business order register.', 'Sync');
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="flex items-center gap-3"><ShoppingCart className="h-6 w-6 text-orange-400"/><div><h1 className="text-xl font-bold text-white">Sales Orders</h1><p className="text-xs text-slate-400">Record buyer orders and track fulfillment status.</p></div></div>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Total orders',orders.length],['Pending',orders.filter(o=>o.status==='Pending').length],['Confirmed',orders.filter(o=>o.status==='Confirmed').length],['Fulfilled',orders.filter(o=>o.status==='Fulfilled').length]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-800 bg-slate-950 p-3"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 text-xl font-bold text-white">{value}</div></div>)}
      </div>
    </div>
    <form onSubmit={createOrder} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h2 className="flex items-center gap-2 font-semibold text-white"><PlusCircle className="h-4 w-4 text-orange-400"/>Create buyer order</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-slate-300">Customer name<input value={customerName} onChange={e=>setCustomerName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Buyer name"/></label>
        <label className="text-xs text-slate-300">Phone / contact<input value={customerContact} onChange={e=>setCustomerContact(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Phone or email"/></label>
        <label className="text-xs text-slate-300 sm:col-span-2">Product<select value={productId} onChange={e=>setProductId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white"><option value="">Select product</option>{inventory.map(p=><option key={p.id} value={p.id}>{p.title} — {p.price} ({p.totalStock} in stock)</option>)}</select></label>
        <label className="text-xs text-slate-300">Quantity<input type="number" min="1" max={selectedProduct?.totalStock || 1} value={quantity} onChange={e=>setQuantity(Math.max(1,Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white"/></label>
        <label className="text-xs text-slate-300">Payment method<select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value as SalesOrder['paymentMethod'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white">{['Telebirr','CBE Birr','Cash on Delivery','Bank Transfer','Other'].map(v=><option key={v}>{v}</option>)}</select></label>
        <label className="text-xs text-slate-300 sm:col-span-2">Delivery location<input value={deliveryLocation} onChange={e=>setDeliveryLocation(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="City / woreda / delivery address"/></label>
      </div>
      <div className="text-sm text-slate-200">Order total: <strong>{currency} {total.toLocaleString()}</strong></div>
      {formError && <p className="text-xs text-rose-400">{formError}</p>}
      <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white">Save order</button>
      <p className="text-[11px] text-amber-300">Orders are recorded as Pending. This version does not charge payments or deduct stock automatically.</p>
    </form>
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3"><h2 className="font-semibold text-white">Order register ({orders.length})</h2>
      {orders.length===0 ? <p className="text-sm text-slate-400">No saved orders yet. Create the first buyer order above.</p> : orders.map(order=><div key={order.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><div className="font-semibold text-white">{order.orderNumber} · {order.customerName}</div><div className="text-xs text-slate-400">{order.productName} × {order.quantity} · {order.customerContact}</div></div><div className="text-sm font-bold text-orange-300">{order.currency} {order.totalAmount.toLocaleString()}</div></div>
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-400">{order.paymentMethod} · {order.deliveryLocation || 'No delivery location'}</span><select aria-label={`Status for ${order.orderNumber}`} value={order.status} onChange={e=>updateStatus(order,e.target.value as SalesOrder['status'])} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white">{['Pending','Confirmed','Fulfilled','Cancelled'].map(s=><option key={s}>{s}</option>)}</select></div>
        {order.status==='Fulfilled' && <div className="flex items-center gap-1 text-xs text-emerald-400"><PackageCheck className="h-3.5 w-3.5"/>Marked fulfilled</div>}
      </div>)}
    </div>
  </div>;
};
