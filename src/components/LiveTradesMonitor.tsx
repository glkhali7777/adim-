import React, { useState } from 'react';
import { Trade } from '../types/broker';
import { 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Filter
} from 'lucide-react';
import { formatBRL } from '../utils/brokerCalculations';

interface LiveTradesMonitorProps {
  trades: Trade[];
}

export const LiveTradesMonitor: React.FC<LiveTradesMonitorProps> = ({ trades }) => {
  const [filterType, setFilterType] = useState<'all' | 'OPEN' | 'WON' | 'LOST'>('all');
  const [accountFilter, setAccountFilter] = useState<'all' | 'REAL' | 'DEMO'>('all');

  const filteredTrades = trades.filter(t => {
    const matchesStatus = filterType === 'all' || t.status === filterType;
    const matchesAccount = accountFilter === 'all' || t.accountType === accountFilter;
    return matchesStatus && matchesAccount;
  });

  const openTrades = trades.filter(t => t.status === 'OPEN');
  const totalOpenExposure = openTrades.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Risk Exposure Bar */}
      <div className="p-6 rounded-2xl glass-panel-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF7700]" />
            <span>Monitoramento de Operações ao Vivo (Feed em Tempo Real)</span>
          </h2>
          <p className="text-xs text-[#8C97B3] mt-1">
            Acompanhe ordens de Call e Put abertas no traderoom, exposição de risco e liquidação.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs">
            <span className="text-[#8C97B3] block text-[10px]">Exposição em Aberto:</span>
            <span className="text-lg font-bold font-mono text-orange-400 tabular-nums">
              {formatBRL(totalOpenExposure)}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs">
            <span className="text-[#8C97B3] block text-[10px]">Operações em Andamento:</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {openTrades.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {(['all', 'OPEN', 'WON', 'LOST'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterType(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === status
                  ? 'bg-[#FF7700] text-white shadow-sm'
                  : 'text-[#8C97B3] hover:text-white'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'OPEN' ? 'Em Aberto' : status === 'WON' ? 'Finalizadas: Vitória' : 'Finalizadas: Derrota'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value as any)}
            className="h-8 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none"
          >
            <option value="all" className="bg-[#0B1020]">Contas: Todas</option>
            <option value="REAL" className="bg-[#0B1020]">Apenas Conta Real</option>
            <option value="DEMO" className="bg-[#0B1020]">Apenas Conta Demo</option>
          </select>
        </div>
      </div>

      {/* Live Trades Table */}
      <div className="p-5 rounded-2xl glass-panel-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-[#8C97B3]">
              <th className="pb-3 font-medium">ID da Ordem</th>
              <th className="pb-3 font-medium">Trader</th>
              <th className="pb-3 font-medium">Conta</th>
              <th className="pb-3 font-medium">Ativo</th>
              <th className="pb-3 font-medium">Direção</th>
              <th className="pb-3 font-medium text-right">Investimento</th>
              <th className="pb-3 font-medium text-right">Preço de Entrada</th>
              <th className="pb-3 font-medium text-right">Preço Final</th>
              <th className="pb-3 font-medium text-right">Resultado</th>
              <th className="pb-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredTrades.map(trade => {
              const isCall = trade.direction === 'CALL';
              return (
                <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3 font-mono text-[11px] text-[#8C97B3]">
                    {trade.id}
                  </td>

                  <td className="py-3 pr-3 font-semibold text-white">
                    {trade.userName}
                  </td>

                  <td className="py-3 pr-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trade.accountType === 'REAL' ? 'bg-orange-500/20 text-orange-300' : 'bg-white/[0.05] text-[#8C97B3]'
                    }`}>
                      {trade.accountType}
                    </span>
                  </td>

                  <td className="py-3 pr-3 font-bold text-white">
                    {trade.assetSymbol}
                  </td>

                  <td className="py-3 pr-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                      isCall ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCall ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span>{trade.direction}</span>
                    </span>
                  </td>

                  <td className="py-3 pr-3 text-right font-mono font-bold text-white tabular-nums">
                    {formatBRL(trade.amount)}
                  </td>

                  <td className="py-3 pr-3 text-right font-mono text-[#8C97B3] tabular-nums">
                    {trade.strikePrice < 10 ? trade.strikePrice.toFixed(5) : trade.strikePrice.toFixed(2)}
                  </td>

                  <td className="py-3 pr-3 text-right font-mono text-white tabular-nums">
                    {trade.closePrice ? (
                      trade.closePrice < 10 ? trade.closePrice.toFixed(5) : trade.closePrice.toFixed(2)
                    ) : (
                      <span className="text-orange-400 animate-pulse">Em análise...</span>
                    )}
                  </td>

                  <td className="py-3 pr-3 text-right font-mono font-bold tabular-nums">
                    {trade.status === 'WON' ? (
                      <span className="text-emerald-400">+{formatBRL(trade.profit || 0)}</span>
                    ) : trade.status === 'LOST' ? (
                      <span className="text-red-400">-{formatBRL(trade.amount)}</span>
                    ) : (
                      <span className="text-[#8C97B3]">Pendente</span>
                    )}
                  </td>

                  <td className="py-3 text-center">
                    {trade.status === 'OPEN' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Aberta</span>
                      </span>
                    ) : trade.status === 'WON' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Vitória</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400">
                        <XCircle className="w-3 h-3" />
                        <span>Derrota</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
