import React, { useState } from 'react';
import { 
  Package, 
  Workflow, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Truck, 
  ArrowUpRight, 
  FileText,
  Clock,
  Layers,
  ShoppingBag,
  Plus,
  Filter,
  Search,
  Sparkles,
  X,
  Tag,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { InventoryItem, IndustryType } from '../types';
import { SupportedLanguage, CurrencyMode, translations, formatCurrency } from '../i18n/translations';

interface InventoryChannelsViewProps {
  inventory: InventoryItem[];
  onUpdateInventory: (inventory: InventoryItem[]) => void;
  onAddAgentLog: (action: string, impact: string, category: 'Sync' | 'Automation') => void;
  lang?: SupportedLanguage;
  currency?: CurrencyMode;
}

export const InventoryChannelsView: React.FC<InventoryChannelsViewProps> = ({
  inventory,
  onUpdateInventory,
  onAddAgentLog,
  lang = 'en',
  currency = 'ETB',
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedPoItem, setSelectedPoItem] = useState<InventoryItem | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(250);

  // Filter states
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);

  // Add Product Form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSku, setNewSku] = useState<string>('');
  const [newIndustry, setNewIndustry] = useState<IndustryType>('Coffee & Agriculture');
  const [newProductType, setNewProductType] = useState<string>('Specialty Coffee Beans');
  const [newCategory, setNewCategory] = useState<string>('Gourmet Single-Origin');
  const [newPrice, setNewPrice] = useState<number>(38);
  const [newStock, setNewStock] = useState<number>(150);
  const [newReorder, setNewReorder] = useState<number>(50);
  const [newMargin, setNewMargin] = useState<number>(65);

  const t = translations[lang];

  // Industry List with counts
  const industries: { id: string; labelEn: string; labelAm: string }[] = [
    { id: 'All', labelEn: 'All Industries', labelAm: 'ሁሉም ዘርፎች' },
    { id: 'Coffee & Agriculture', labelEn: '☕ Coffee & Agriculture', labelAm: '☕ ቡናና ግብርና' },
    { id: 'Fashion & Traditional Apparel', labelEn: '👗 Fashion & Traditional Apparel', labelAm: '👗 ባህላዊ አልባሳትና ፋሽን' },
    { id: 'Consumer Electronics', labelEn: '⚡ Consumer Electronics', labelAm: '⚡ ኤሌክትሮኒክስና ቴክ' },
    { id: 'Natural Cosmetics & Wellness', labelEn: '🌿 Natural Cosmetics & Oils', labelAm: '🌿 የተፈጥሮ ቅባቶችና ውበት' },
    { id: 'Handcrafted Home & Artisan', labelEn: '🏺 Handcrafted Home & Crafts', labelAm: '🏺 የሸክላና የቆዳ እደ-ጥበብ' },
  ];

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesIndustry = selectedIndustry === 'All' || item.industry === selectedIndustry;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.productType && item.productType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  // Calculate industry summary statistics
  const totalSkus = filteredInventory.length;
  const totalUnits = filteredInventory.reduce((acc, i) => acc + i.totalStock, 0);
  const lowStockCount = filteredInventory.filter(
    (i) => i.stockStatus === 'Low Stock' || i.stockStatus === 'Critical Reorder'
  ).length;

  // Trigger marketplace sync across all channels
  const handleSyncAllChannels = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updated = inventory.map((item) => ({
        ...item,
        channels: item.channels.map((ch) => ({
          ...ch,
          lastSyncTime: 'Just now',
          synced: true,
        })),
      }));
      onUpdateInventory(updated);
      setIsSyncing(false);
      onAddAgentLog(
        'Autonomous stock parity sync executed across Telebirr, Telegram, TikTok Shop, Shopify & Amazon',
        '0 units of stock drift across multi-industry product listings',
        'Sync'
      );
    }, 1200);
  };

  // Dispatch supplier PO
  const handleIssuePo = () => {
    if (!selectedPoItem) return;

    const updated = inventory.map((item) => {
      if (item.id !== selectedPoItem.id) return item;
      return {
        ...item,
        totalStock: item.totalStock + poQuantity,
        stockStatus: 'In Stock' as const,
      };
    });

    onUpdateInventory(updated);
    onAddAgentLog(
      `Issued Supplier Restock PO for ${poQuantity} units of ${selectedPoItem.sku} (${selectedPoItem.title})`,
      `Supplier PO dispatched. Reorder lead time: ${selectedPoItem.supplierLeadDays} days`,
      'Automation'
    );
    setSelectedPoItem(null);
  };

  // Add new product handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSku) return;

    const newProd: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newSku.toUpperCase(),
      title: newTitle,
      industry: newIndustry,
      productType: newProductType,
      category: newCategory,
      price: newPrice,
      marginPercent: newMargin,
      totalStock: newStock,
      reorderPoint: newReorder,
      stockStatus: newStock <= newReorder ? 'Low Stock' : 'In Stock',
      channels: [
        { name: 'Shopify', allocatedStock: Math.floor(newStock * 0.4), synced: true, lastSyncTime: 'Just now' },
        { name: 'TikTok Shop', allocatedStock: Math.floor(newStock * 0.3), synced: true, lastSyncTime: 'Just now' },
        { name: 'Telebirr Store', allocatedStock: Math.floor(newStock * 0.2), synced: true, lastSyncTime: 'Just now' },
        { name: 'Telegram Commerce', allocatedStock: Math.floor(newStock * 0.1), synced: true, lastSyncTime: 'Just now' },
      ],
      monthlyVelocity: Math.floor(newStock * 1.2),
      supplierLeadDays: 14,
    };

    onUpdateInventory([newProd, ...inventory]);
    onAddAgentLog(
      `Created new product in ${newIndustry}: ${newProd.sku} - ${newProd.title}`,
      `Allocated across Shopify, TikTok Shop, Telebirr Store & Telegram`,
      'Sync'
    );
    setIsAddProductOpen(false);
    setNewTitle('');
    setNewSku('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-orange-400 font-semibold">{t.agents.inventory}</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Industry Stock Parity</span>
            <span aria-hidden="true">·</span>
            <span>5 Major Marketplaces + Telebirr</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {lang === 'am' ? 'የዕቃዎች መጋዘንና የገበያ መድረኮች ማመሳሰያ' : 'Omnichannel Inventory & Multi-Industry Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            WiseSell AI manages multi-industry catalogs across Ethiopian Specialty Coffee, Traditional Habesha Kemis, Consumer Electronics, Black Seed Cosmetics, and Handcrafted Artisan Goods with zero stock drift.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Add Product</span>
          </button>

          <button
            onClick={handleSyncAllChannels}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : t.actions.syncAll}</span>
          </button>
        </div>
      </div>

      {/* Multi-Industry Quick Filter Strip */}
      <div className="p-3 bg-black border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-orange-400" />
            <span>Select Industry & Product Vertical:</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {totalSkus} SKUs · {totalUnits.toLocaleString()} units
          </div>
        </div>

        {/* Industry Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {industries.map((ind) => {
            const count = ind.id === 'All' 
              ? inventory.length 
              : inventory.filter(i => i.industry === ind.id).length;
            const isSelected = selectedIndustry === ind.id;

            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{lang === 'am' ? ind.labelAm : ind.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Filter */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, product title, or product type (e.g. Yirgacheffe, Kemis, MagSafe, Black Seed)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Channel Connectivity Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">Telebirr Store</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">420 SKUs</div>
          <div className="text-[11px] text-orange-400 font-mono mt-0.5">ቴሌብር Pay Active</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">Telegram Bot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">310 SKUs</div>
          <div className="text-[11px] text-blue-400 font-mono mt-0.5">Direct Checkout</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">Shopify Plus</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">1,420 SKUs</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Live 2-Way Sync</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">TikTok Shop</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">890 SKUs</div>
          <div className="text-[11px] text-cyan-400 font-mono mt-0.5">Flash Buffer Active</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">Amazon FBA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">1,180 SKUs</div>
          <div className="text-[11px] text-indigo-400 font-mono mt-0.5">Auto-Parity</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-white">CBE Birr</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">280 SKUs</div>
          <div className="text-[11px] text-purple-400 font-mono mt-0.5">IPN Gateway</div>
        </div>
      </div>

      {/* Low-Stock Automated Alerts Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="text-xs font-bold text-amber-300">
                Automated Stockout Protection: {lowStockCount} SKUs Below Reorder Buffer
              </div>
              <div className="text-[11px] text-amber-300/80">
                WiseSell AI automatically protected inventory on Amazon & TikTok Shop while auto-calculating supplier replenishment quantities.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const critical = filteredInventory.find((i) => i.stockStatus === 'Critical Reorder' || i.stockStatus === 'Low Stock') || filteredInventory[0];
              setSelectedPoItem(critical);
            }}
            className="px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Review & Issue Supplier PO
          </button>
        </div>
      )}

      {/* Multi-Channel Inventory Matrix Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Multi-Industry Stock Parity Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Master inventory, product types, wholesale margin %, and live channel allocations
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Sync Heartbeat: 60s</span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU & Product Details</th>
                <th className="py-3 px-3">Industry Vertical</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-3 text-right">Margin %</th>
                <th className="py-3 px-3 text-right">Stock</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4">Channel Allocation Breakdown</th>
                <th className="py-3 px-3 text-right">Velocity</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      <span className="text-orange-400">{item.sku}</span> · {item.productType || item.category}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium whitespace-nowrap">
                      {item.industry}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-200">
                    {formatCurrency(item.price, currency)}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                    {item.marginPercent ? `${item.marginPercent}%` : '58%'}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                    <div className="font-bold text-white text-sm">{item.totalStock}</div>
                    <div className="text-[10px] text-slate-500">Buffer: {item.reorderPoint}</div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap ${
                      item.stockStatus === 'In Stock'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                        : item.stockStatus === 'Low Stock'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                        : item.stockStatus === 'Critical Reorder'
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/40'
                    }`}>
                      {item.stockStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.channels.map((ch, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                          <span className="text-slate-400">{ch.name}:</span>
                          <span className="font-semibold text-white">{ch.allocatedStock}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-300">
                    <div>{item.monthlyVelocity} /mo</div>
                    <div className="text-[10px] text-slate-500">{item.supplierLeadDays}d lead</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedPoItem(item);
                        setPoQuantity(Math.max(150, item.monthlyVelocity - item.totalStock));
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Issue PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 px-6 border-b border-slate-900 bg-black/60">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Add Product to Omnichannel Catalog</h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Yirgacheffe Washed Grade-1 Beans or Habesha Kemis Dress"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. WS-COF-YIRG2"
                    required
                    className="w-full font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-orange-400 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Vertical</label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Coffee & Agriculture">Coffee & Agriculture</option>
                    <option value="Fashion & Traditional Apparel">Fashion & Traditional Apparel</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Natural Cosmetics & Wellness">Natural Cosmetics & Wellness</option>
                    <option value="Handcrafted Home & Artisan">Handcrafted Home & Artisan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Product Type</label>
                  <input
                    type="text"
                    value={newProductType}
                    onChange={(e) => setNewProductType(e.target.value)}
                    placeholder="e.g. Specialty Beans, Silk Dress"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Unit Price ($ USD)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                    required
                    className="w-full font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={newReorder}
                    onChange={(e) => setNewReorder(parseInt(e.target.value) || 0)}
                    required
                    className="w-full font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Gross Margin %</label>
                  <input
                    type="number"
                    value={newMargin}
                    onChange={(e) => setNewMargin(parseInt(e.target.value) || 0)}
                    required
                    className="w-full font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                ✨ Automated Multi-Channel Split: Stock will be automatically distributed across Shopify, TikTok Shop, Telebirr Store, and Telegram with zero-drift synchronization.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Save & Distribute Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Restock PO Modal */}
      {selectedPoItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-orange-400 font-semibold">Autonomous PO Generator</span>
                <h3 className="text-lg font-bold text-white">{selectedPoItem.title}</h3>
                <div className="text-xs text-slate-400 font-mono">
                  {selectedPoItem.sku} · {selectedPoItem.industry} · Lead: {selectedPoItem.supplierLeadDays} days
                </div>
              </div>
              <button
                onClick={() => setSelectedPoItem(null)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">Current Stock:</span>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{selectedPoItem.totalStock} units</div>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Run Rate:</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{selectedPoItem.monthlyVelocity} units/mo</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Restock Order Quantity (Units):</label>
                <input
                  type="number"
                  value={poQuantity}
                  onChange={(e) => setPoQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Wholesale Cost:</span>
                  <span className="font-mono">{formatCurrency(selectedPoItem.price * 0.38, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Total Purchase Order Value:</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(poQuantity * selectedPoItem.price * 0.38, currency)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPoItem(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleIssuePo}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transmit PO to Supplier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
