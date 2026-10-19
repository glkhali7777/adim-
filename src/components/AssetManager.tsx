import React, { useState } from 'react';
import { Asset, AssetCategory } from '../types/broker';
import { 
  Sliders, 
  Search, 
  Check, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Moon,
  Layers
} from 'lucide-react';
import { formatBRL } from '../utils/brokerCalculations';

interface AssetManagerProps {
  assets: Asset[];
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void;
  onBulkUpdatePayout: (payout: number) => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  assets,
  onUpdateAsset,
  onBulkUpdatePayout
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos os Ativos' },
    { id: 'turbo', label: 'Turbo (1-5 min)' },
    { id: 'binary', label: 'Binárias' },
    { id: 'blitz', label: 'Blitz (30s)' },
    { id: 'digital', label: 'Digital' },
    { id: 'trade-rush', label: 'Trade Rush' }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePayoutChange = (id: string, value: number) => {
    const safeValue = Math.max(50, Math.min(98, value));
    onUpdateAsset(id, { payout: safeValue });
  };

  const handleMinBetChange = (id: string, value: number) => {
    onUpdateAsset(id, { minBet: Math.max(1, value) });
  };

  const handleMaxBetChange = (id: string, value: number) => {
    onUpdateAsset(id, { maxBet: Math.max(100, value) });
  };

  const handleToggleEnabled = (id: string, current: boolean) => {
    onUpdateAsset(id, { enabled: !current });
    showToast(`Ativo ${!current ? 'ativado' : 'suspenso'} no Traderoom com sucesso.`);
  };

  const applyPreset = (presetPayout: number, name: string) => {
    onBulkUpdatePayout(presetPayout);
    showToast(`Preset "${name}" aplicado: Payout definido para ${presetPayout}% em todos os ativos.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl border border-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header with Title and Quick Presets */}
      <div className="p-6 rounded-2xl glass-panel-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FF7700]" />
            <span>Gestão de Ativos & Overrides de Payout</span>
          </h2>
          <p className="text-xs text-[#8C97B3] mt-1">
            Altere payouts, limites de aposta e suspensão em tempo real (atualização direta no motor WS/Traderoom).
          </p>
        </div>

        {/* Quick presets buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset(95, 'Alta Volatilidade 95%')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preset 95% Payout</span>
          </button>

          <button
            onClick={() => applyPreset(90, 'Competitivo Padrão 90%')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF7700]" />
            <span>Preset 90% Padrão</span>
          </button>

          <button
            onClick={() => applyPreset(85, 'Proteção Noturna 85%')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
          >
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span>Preset 85% Noturno</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C97B3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por símbolo ou par..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-[#5F6B8A] focus:border-[#FF7700]/70 focus:outline-none transition-colors"
          />
        </div>

        {/* Categories segmented controls */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#FF7700] text-white shadow-sm'
                  : 'text-[#8C97B3] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const houseEdge = 100 - asset.payout;
          return (
            <div 
              key={asset.id} 
              className={`p-5 rounded-2xl glass-panel-subtle border transition-all ${
                asset.enabled ? 'border-white/[0.08]' : 'border-red-500/20 opacity-75'
              }`}
            >
              {/* Asset Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white tracking-tight">
                      {asset.symbol}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.06] text-[#8C97B3] uppercase">
                      {asset.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#8C97B3] mt-0.5">
                    {asset.name}
                  </div>
                </div>

                {/* Enable / Suspend Toggle Button */}
                <button
                  onClick={() => handleToggleEnabled(asset.id, asset.enabled)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    asset.enabled 
                      ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' 
                      : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                  }`}
                >
                  {asset.enabled ? 'Ativo' : 'Suspenso'}
                </button>
              </div>

              {/* Price and Live Market Info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04] mb-4 text-xs font-mono">
                <div>
                  <span className="text-[#8C97B3] block text-[10px]">Cotação Atual</span>
                  <span className="text-white font-bold tabular-nums">
                    {asset.currentPrice < 10 ? asset.currentPrice.toFixed(5) : asset.currentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C97B3] block text-[10px]">Oscilação 24h</span>
                  <span className={`font-semibold tabular-nums ${
                    asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </span>
                </div>
              </div>

              {/* Payout Adjustment Slider & Input */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#8C97B3] font-medium">Payout ao Cliente</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-lg font-bold text-orange-300 tabular-nums">
                        {asset.payout}%
                      </span>
                      <span className="text-[11px] text-[#8C97B3]">
                        (Margem casa: {houseEdge}%)
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="98"
                    step="1"
                    value={asset.payout}
                    onChange={(e) => handlePayoutChange(asset.id, Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-white/[0.1] accent-[#FF7700] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#5F6B8A] font-mono mt-1">
                    <span>50%</span>
                    <span>75%</span>
                    <span>90%</span>
                    <span>98%</span>
                  </div>
                </div>

                {/* Min Bet & Max Bet Bounds */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-[10.5px] text-[#8C97B3] mb-1">
                      Aposta Mínima (R$)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={asset.minBet}
                      onChange={(e) => handleMinBetChange(asset.id, Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white focus:border-[#FF7700] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-[#8C97B3] mb-1">
                      Aposta Máxima (R$)
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={asset.maxBet}
                      onChange={(e) => handleMaxBetChange(asset.id, Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white focus:border-[#FF7700] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
