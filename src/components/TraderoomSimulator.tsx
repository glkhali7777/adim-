import React, { useState, useEffect, useRef } from 'react';
import { Asset, Trade, BrokerBrandConfig } from '../types/broker';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ChevronDown, 
  QrCode, 
  Coins, 
  Copy, 
  Check, 
  Clock, 
  TrendingUp, 
  Wallet,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatBRL, calculateTraderProfit, validateBetAmount } from '../utils/brokerCalculations';

interface TraderoomSimulatorProps {
  assets: Asset[];
  config: BrokerBrandConfig;
  onBackToAdmin: () => void;
  onTradeExecuted: (trade: Trade) => void;
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const TraderoomSimulator: React.FC<TraderoomSimulatorProps> = ({
  assets,
  config,
  onBackToAdmin,
  onTradeExecuted
}) => {
  // Currently active asset
  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0] || {
    id: '1',
    symbol: 'EUR/USD',
    name: 'Euro / Dólar Americano',
    category: 'turbo',
    payout: 92,
    minBet: 5,
    maxBet: 10000,
    enabled: true,
    currentPrice: 1.08452,
    change24h: 0.34,
    priceHistory: []
  });

  // Account Type & Balance
  const [accountType, setAccountType] = useState<'REAL' | 'DEMO'>('REAL');
  const [realBalance, setRealBalance] = useState<number>(1450.00);
  const [demoBalance, setDemoBalance] = useState<number>(10000.00);

  // Trade Inputs
  const [stake, setStake] = useState<number>(50);
  const [durationSec, setDurationSec] = useState<number>(10); // 10s for snappy interactive testing!
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Deposit Modal
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'PIX' | 'USDT'>('PIX');
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [copiedCode, setCopiedCode] = useState(false);

  // Asset picker dropdown
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  // Live Chart Simulation (Candles + Current ticking price)
  const [currentPrice, setCurrentPrice] = useState<number>(selectedAsset.currentPrice);
  const [candles, setCandles] = useState<Candle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize candles for selected asset
  useEffect(() => {
    const base = selectedAsset.currentPrice;
    const initialCandles: Candle[] = [];
    let price = base;
    const now = Date.now();

    for (let i = 24; i >= 0; i--) {
      const open = price;
      const change = (Math.random() - 0.49) * (base * 0.0006);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (base * 0.0003);
      const low = Math.min(open, close) - Math.random() * (base * 0.0003);
      initialCandles.push({
        time: now - i * 3000,
        open,
        high,
        low,
        close
      });
      price = close;
    }
    setCandles(initialCandles);
    setCurrentPrice(price);
  }, [selectedAsset.id]);

  // Live micro-tick generator (1 second interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prevPrice) => {
        const delta = (Math.random() - 0.49) * (prevPrice * 0.0003);
        const newPrice = Math.max(prevPrice * 0.5, prevPrice + delta);

        // Update active candle
        setCandles((prevCandles) => {
          if (prevCandles.length === 0) return prevCandles;
          const lastCandle = { ...prevCandles[prevCandles.length - 1] };
          lastCandle.close = newPrice;
          lastCandle.high = Math.max(lastCandle.high, newPrice);
          lastCandle.low = Math.min(lastCandle.low, newPrice);
          return [...prevCandles.slice(0, -1), lastCandle];
        });

        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic candle advance (every 5 seconds a new candle starts)
  useEffect(() => {
    const candleInterval = setInterval(() => {
      setCandles((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const lastCandle = prevCandles[prevCandles.length - 1];
        const newCandle: Candle = {
          time: Date.now(),
          open: lastCandle.close,
          high: lastCandle.close,
          low: lastCandle.close,
          close: lastCandle.close
        };
        // keep at most 30 candles on screen
        return [...prevCandles.slice(-29), newCandle];
      });
    }, 5000);

    return () => clearInterval(candleInterval);
  }, []);

  // Draw smooth Canvas Candlestick Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support device pixel ratio
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    if (candles.length < 2) return;

    // Find min and max price across visible candles
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    const padding = (maxPrice - minPrice) * 0.15 || 0.001;
    minPrice -= padding;
    maxPrice += padding;

    const priceToY = (price: number) => {
      return height - ((price - minPrice) / (maxPrice - minPrice)) * height;
    };

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Price labels
      const priceVal = maxPrice - (i / 5) * (maxPrice - minPrice);
      ctx.fillStyle = '#5F6B8A';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        priceVal < 10 ? priceVal.toFixed(5) : priceVal.toFixed(2),
        width - 10,
        y - 4
      );
    }

    // Draw Candles
    const candleWidth = Math.max(6, (width - 100) / candles.length - 4);
    const spacing = (width - 100) / candles.length;

    candles.forEach((c, idx) => {
      const x = idx * spacing + spacing / 2;
      const isGreen = c.close >= c.open;
      const candleColor = isGreen ? '#22C55E' : '#EF4444';

      const yOpen = priceToY(c.open);
      const yClose = priceToY(c.close);
      const yHigh = priceToY(c.high);
      const yLow = priceToY(c.low);

      // Wick line
      ctx.strokeStyle = candleColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body box
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillStyle = candleColor;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // Draw Current Price Pulsing Line across full width
    const currentY = priceToY(currentPrice);
    ctx.strokeStyle = 'rgba(255, 119, 0, 0.7)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Price badge on the right axis
    ctx.fillStyle = '#FF7700';
    ctx.fillRect(width - 85, currentY - 11, 80, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      currentPrice < 10 ? currentPrice.toFixed(5) : currentPrice.toFixed(2),
      width - 45,
      currentY + 4
    );

    // Draw Active Strike lines for open trades
    activeTrades.forEach((t) => {
      const strikeY = priceToY(t.strikePrice);
      ctx.strokeStyle = t.direction === 'CALL' ? '#22C55E' : '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, strikeY);
      ctx.lineTo(width - 90, strikeY);
      ctx.stroke();

      ctx.fillStyle = t.direction === 'CALL' ? '#22C55E' : '#EF4444';
      ctx.fillRect(10, strikeY - 10, 60, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${t.direction} R$${t.amount}`, 40, strikeY + 4);
    });
  }, [candles, currentPrice, activeTrades]);

  // Execute Trade (CALL or PUT)
  const handlePlaceTrade = (direction: 'CALL' | 'PUT') => {
    // Validate bounds
    const validation = validateBetAmount(stake, selectedAsset.minBet, selectedAsset.maxBet);
    if (!validation.valid) {
      setTradeMessage(validation.error || 'Valor inválido.');
      setTimeout(() => setTradeMessage(null), 3000);
      return;
    }

    // Check Balance
    const currentBalance = accountType === 'REAL' ? realBalance : demoBalance;
    if (currentBalance < stake) {
      setTradeMessage('Saldo insuficiente. Realize um depósito ou mude para a Conta Demo.');
      setTimeout(() => setTradeMessage(null), 3500);
      return;
    }

    // Deduct Stake
    if (accountType === 'REAL') {
      setRealBalance(prev => prev - stake);
    } else {
      setDemoBalance(prev => prev - stake);
    }

    const tradeId = `ord_${Math.floor(Math.random() * 90000) + 10000}`;
    const newTrade: Trade = {
      id: tradeId,
      userId: 'user_operator',
      userName: 'Operador / Teste',
      assetSymbol: selectedAsset.symbol,
      direction,
      amount: stake,
      payoutPercent: selectedAsset.payout,
      strikePrice: currentPrice,
      status: 'OPEN',
      accountType,
      openedAt: Date.now(),
      expiresAt: Date.now() + durationSec * 1000
    };

    setActiveTrades(prev => [newTrade, ...prev]);
    onTradeExecuted(newTrade);

    setTradeMessage(`Ordem ${direction} aberta em ${selectedAsset.symbol} por ${formatBRL(stake)} (${durationSec}s)!`);
    setTimeout(() => setTradeMessage(null), 2500);

    // Schedule Settle after durationSec
    setTimeout(() => {
      // Compare close price vs strike price
      const close = currentPrice;
      const won = direction === 'CALL' ? close > newTrade.strikePrice : close < newTrade.strikePrice;
      const profit = won ? calculateTraderProfit(newTrade.amount, newTrade.payoutPercent) : -newTrade.amount;

      if (won) {
        const returnedAmount = newTrade.amount + profit;
        if (accountType === 'REAL') {
          setRealBalance(prev => prev + returnedAmount);
        } else {
          setDemoBalance(prev => prev + returnedAmount);
        }
      }

      const settledTrade: Trade = {
        ...newTrade,
        status: won ? 'WON' : 'LOST',
        closePrice: close,
        profit
      };

      setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
      onTradeExecuted(settledTrade);

      setTradeMessage(
        won 
          ? `Parabéns! Operação VENCEDORA em ${selectedAsset.symbol}: +${formatBRL(profit)}` 
          : `Operação ENCERRADA em ${selectedAsset.symbol}: ${formatBRL(-newTrade.amount)}`
      );
      setTimeout(() => setTradeMessage(null), 4000);
    }, durationSec * 1000);
  };

  const handleDepositConfirm = () => {
    setRealBalance(prev => prev + depositAmount);
    setIsDepositOpen(false);
    setTradeMessage(`Depósito de ${formatBRL(depositAmount)} via ${depositMethod} confirmado na Conta Real!`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  const copyPixCode = () => {
    navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136brokerqx-pix-gateway-instantaneo5204000053039865404100.005802BR5913BROKER QX ME6009SAO PAULO62070503***6304E5F2');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const potentialProfit = calculateTraderProfit(stake, selectedAsset.payout);

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col bg-[#080C18] select-none">
      {/* Top Banner Alert to Return to Admin */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-4 py-2 flex items-center justify-between text-xs text-white shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Modo Simulação do Traderoom — Visualização fiel da interface de negociação do cliente
          </span>
          <span className="hidden md:inline text-orange-200">
            · Payouts sincronizados diretamente com as configurações do operador ({selectedAsset.payout}%)
          </span>
        </div>
        <button
          onClick={onBackToAdmin}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white font-bold transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Painel Admin</span>
        </button>
      </div>

      {/* Traderoom Sub-Header */}
      <div className="h-14 px-4 bg-[#0F1426] border-b border-white/[0.08] flex items-center justify-between gap-4">
        {/* Left: Asset Selector */}
        <div className="relative">
          <button
            onClick={() => setIsAssetPickerOpen(!isAssetPickerOpen)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.10] text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
              {selectedAsset.symbol.slice(0, 3)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-tight">{selectedAsset.symbol}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 font-mono">
                  {selectedAsset.payout}%
                </span>
              </div>
              <span className="text-[10px] text-[#8C97B3] block">{selectedAsset.category}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8C97B3]" />
          </button>

          {/* Asset Dropdown */}
          {isAssetPickerOpen && (
            <div className="absolute left-0 top-12 z-40 w-72 p-2 rounded-2xl glass-panel bg-[#0B1020] border border-white/[0.12] shadow-2xl space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#8C97B3] uppercase">
                Escolha o Ativo
              </div>
              {assets.filter(a => a.enabled).map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setIsAssetPickerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    selectedAsset.id === asset.id ? 'bg-[#FF7700] text-white' : 'hover:bg-white/[0.05] text-[#E9EDF8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{asset.symbol}</span>
                    <span className="text-[10px] opacity-75 capitalize">{asset.category}</span>
                  </div>
                  <span className="font-mono font-bold">{asset.payout}%</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Live Notification message */}
        {tradeMessage && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-200 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7700]" />
            <span>{tradeMessage}</span>
          </div>
        )}

        {/* Right: Balance Switcher & Deposit Button */}
        <div className="flex items-center gap-3">
          {/* Real vs Demo Balance selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
            <button
              onClick={() => setAccountType('REAL')}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                accountType === 'REAL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#8C97B3] hover:text-white'
              }`}
            >
              Real: {formatBRL(realBalance)}
            </button>
            <button
              onClick={() => setAccountType('DEMO')}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                accountType === 'DEMO'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-[#8C97B3] hover:text-white'
              }`}
            >
              Demo: {formatBRL(demoBalance)}
            </button>
          </div>

          {/* Deposit Button */}
          <button
            onClick={() => setIsDepositOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Depositar</span>
          </button>
        </div>
      </div>

      {/* Main Traderoom Body: Chart on Left, Trading Controls on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Chart Container */}
        <div className="flex-1 relative flex flex-col p-4 bg-[#080C18]">
          {/* Chart Header Bar */}
          <div className="flex items-center justify-between text-xs text-[#8C97B3] mb-2 px-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-base font-mono">
                {currentPrice < 10 ? currentPrice.toFixed(5) : currentPrice.toFixed(2)}
              </span>
              <span className={`font-mono text-xs ${
                selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10.5px]">Vela 5s</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10.5px]">Tempo Real</span>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative w-full h-[380px] lg:h-full rounded-2xl bg-[#0B1020]/90 border border-white/[0.06] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Active Trades Bar on Bottom */}
          {activeTrades.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 animate-spin" />
                <span>{activeTrades.length} operação(ões) ativa(s) na tela</span>
              </span>
              <div className="flex items-center gap-2">
                {activeTrades.map(t => (
                  <span 
                    key={t.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      t.direction === 'CALL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {t.direction} {formatBRL(t.amount)} ({selectedAsset.payout}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Trading Desk Controls */}
        <div className="w-full lg:w-80 p-5 bg-[#0F1426] border-t lg:border-t-0 lg:border-l border-white/[0.08] flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Painel de Operações
            </div>

            {/* Stake Input */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8C97B3] mb-1">
                Valor do Investimento (R$)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="10"
                  min={selectedAsset.minBet}
                  max={selectedAsset.maxBet}
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FF7700]"
                />
              </div>

              {/* Quick stake buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStake(val)}
                    className="py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-[#8C97B3] hover:text-white border border-white/[0.06] transition-colors"
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration / Expiry */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8C97B3] mb-1">
                Tempo de Expiração
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { sec: 10, label: '10s (Rápido)' },
                  { sec: 30, label: '30s' },
                  { sec: 60, label: '1 min' }
                ].map(opt => (
                  <button
                    key={opt.sec}
                    type="button"
                    onClick={() => setDurationSec(opt.sec)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-colors border ${
                      durationSec === opt.sec
                        ? 'bg-[#FF7700] text-white border-transparent'
                        : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.06]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout & Lucro Estimado */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8C97B3]">
                <span>Rendimento da Casa:</span>
                <span className="font-bold text-orange-400 font-mono">
                  {selectedAsset.payout}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8C97B3]">Lucro Estimado:</span>
                <span className="font-bold text-emerald-400 font-mono tabular-nums text-base">
                  +{formatBRL(potentialProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: CALL (Cima) / PUT (Baixo) */}
          <div className="space-y-3 pt-2">
            {/* CALL Button */}
            <button
              onClick={() => handlePlaceTrade('CALL')}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold flex items-center justify-between px-5 shadow-lg shadow-emerald-900/30 transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <ArrowUp className="w-6 h-6" />
                <span className="text-base tracking-tight">PARA CIMA</span>
              </div>
              <span className="font-mono text-sm opacity-90">CALL</span>
            </button>

            {/* PUT Button */}
            <button
              onClick={() => handlePlaceTrade('PUT')}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold flex items-center justify-between px-5 shadow-lg shadow-red-900/30 transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <ArrowDown className="w-6 h-6" />
                <span className="text-base tracking-tight">PARA BAIXO</span>
              </div>
              <span className="font-mono text-sm opacity-90">PUT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Modal (PIX & USDT) */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel bg-[#0B1020] border border-white/[0.12] shadow-2xl">
            <button
              onClick={() => setIsDepositOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-[#8C97B3] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Adicionar Fundos — Broker QX
            </h3>
            <p className="text-xs text-[#8C97B3] mb-4">
              Métodos autorizados pela plataforma: PIX com liquidação instantânea ou Tether USDT TRC20.
            </p>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setDepositMethod('PIX')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-colors ${
                  depositMethod === 'PIX'
                    ? 'bg-emerald-600 text-white border-transparent'
                    : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>PIX Brasil (CPF)</span>
              </button>

              <button
                type="button"
                onClick={() => setDepositMethod('USDT')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-colors ${
                  depositMethod === 'USDT'
                    ? 'bg-teal-600 text-white border-transparent'
                    : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Tether (USDT) TRC20</span>
              </button>
            </div>

            {/* Amount presets */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#8C97B3] mb-1.5">
                Valor do Depósito (R$)
              </label>
              <input
                type="number"
                min={config.pixMinDeposit}
                max={config.pixMaxDeposit}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FF7700]"
              />

              <div className="grid grid-cols-4 gap-2 mt-2">
                {[50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-white border border-white/[0.06]"
                  >
                    R$ {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code / Details */}
            {depositMethod === 'PIX' ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 text-center">
                <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                  <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center text-black font-mono text-[10px] text-center font-bold">
                    [QR CODE PIX<br/>R$ {depositAmount}]
                  </div>
                </div>

                <div className="text-[11px] text-[#8C97B3]">
                  Escaneie o QR Code no seu banco ou use a chave Copia e Cola:
                </div>

                <button
                  type="button"
                  onClick={copyPixCode}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] text-xs font-mono text-white flex items-center justify-center gap-2 border border-white/[0.08]"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Código PIX Copiado!' : 'Copiar Código PIX'}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
                <span className="text-[#8C97B3] block">Endereço TRC20 Oficial da Corretora:</span>
                <div className="p-2 rounded bg-black font-mono text-[11px] text-teal-300 break-all select-all">
                  TXYZ98234857201948572019847501928475
                </div>
                <div className="text-[11px] text-[#8C97B3]">
                  Apenas envie USDT na rede TRON (TRC20).
                </div>
              </div>
            )}

            {/* Confirm button */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsDepositOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#8C97B3] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDepositConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg"
              >
                Simular Pagamento Aprovado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
