import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldAlert, 
  Zap,
  CheckCircle,
  Activity
} from 'lucide-react';
import { formatBRL } from '../utils/brokerCalculations';
import { Asset, User, Transaction, Trade } from '../types/broker';
import { AdminTab } from './AdminHeader';

interface DashboardOverviewProps {
  assets: Asset[];
  users: User[];
  transactions: Transaction[];
  trades: Trade[];
  onNavigateTab: (tab: AdminTab) => void;
  onApproveTransaction: (txId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  assets,
  users,
  transactions,
  trades,
  onNavigateTab,
  onApproveTransaction
}) => {
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING');
  const pendingKycUsers = users.filter(u => u.kycStatus === 'pending');
  const totalVolume = trades.reduce((acc, t) => acc + t.amount, 0) + 1284500;
  const houseGGR = 184220; // Calculated house profit
  const depositsToday = 48650;
  const activeTraders = 142;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for House Operator if pending items exist */}
      {(pendingTransactions.length > 0 || pendingKycUsers.length > 0) && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/25 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-[#FF7700]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-orange-200">
                Ações Administrativas Pendentes
              </h2>
              <p className="text-xs text-[#8C97B3]">
                {pendingTransactions.length} solicitação(ões) de saque e {pendingKycUsers.length} verificação(ões) de KYC aguardando revisão.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingTransactions.length > 0 && (
              <button
                onClick={() => onNavigateTab('financial')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF7700] hover:bg-[#E05E00] text-white transition-colors"
              >
                Revisar Saques ({pendingTransactions.length})
              </button>
            )}
            {pendingKycUsers.length > 0 && (
              <button
                onClick={() => onNavigateTab('users')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-white transition-colors border border-white/[0.12]"
              >
                Analisar KYC
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GGR da Casa */}
        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">GGR da Casa (Lucro Líquido)</span>
            <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {formatBRL(houseGGR)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.3% em relação a ontem</span>
          </div>
        </div>

        {/* Card 2: Volume Total Negociado */}
        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Volume Total de Apostas</span>
            <div className="p-1.5 rounded-md bg-blue-500/15 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {formatBRL(totalVolume)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8C97B3]">
            <span>Taxa média de turnover: 12.8x</span>
          </div>
        </div>

        {/* Card 3: Depósitos Hoje (PIX / USDT) */}
        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Depósitos Processados Hoje</span>
            <div className="p-1.5 rounded-md bg-orange-500/15 text-[#FF7700]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {formatBRL(depositsToday)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8C97B3]">
            <span className="text-emerald-400 font-medium">84% PIX</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-400 font-medium">16% USDT</span>
          </div>
        </div>

        {/* Card 4: Traders Conectados */}
        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Traders Online Agora</span>
            <div className="p-1.5 rounded-md bg-purple-500/15 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {activeTraders}
            </span>
            <span className="text-xs text-[#8C97B3]">operadores ativos</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8C97B3]">
            <span className="text-orange-400">89 Conta Real</span>
            <span aria-hidden="true">·</span>
            <span>53 Demo</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live House Performance & Pending Cashier Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Payouts Summary & Real-time House Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Assets Status Table */}
          <div className="p-5 rounded-2xl glass-panel-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Resumo de Ativos & Payouts Vigentes
                </h3>
                <p className="text-xs text-[#8C97B3]">
                  Configurações sincronizadas em tempo real com o Traderoom
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('assets')}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Gerenciar Todos &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8C97B3]">
                    <th className="pb-2.5 font-medium">Ativo</th>
                    <th className="pb-2.5 font-medium">Modalidade</th>
                    <th className="pb-2.5 font-medium">Preço Atual</th>
                    <th className="pb-2.5 font-medium">Variação 24h</th>
                    <th className="pb-2.5 font-medium text-right">Payout ao Cliente</th>
                    <th className="pb-2.5 font-medium text-right">Margem da Casa</th>
                    <th className="pb-2.5 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {assets.slice(0, 5).map((asset) => {
                    const houseEdge = 100 - asset.payout;
                    return (
                      <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          <span>{asset.symbol}</span>
                        </td>
                        <td className="py-2.5 text-[#8C97B3] capitalize">{asset.category}</td>
                        <td className="py-2.5 font-mono tabular-nums text-white">
                          {asset.currentPrice < 10 ? asset.currentPrice.toFixed(5) : asset.currentPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 font-mono tabular-nums">
                          <span className={asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-orange-300 tabular-nums">
                          {asset.payout}%
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#8C97B3] tabular-nums">
                          {houseEdge}%
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-medium ${
                            asset.enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                          }`}>
                            {asset.enabled ? 'Ativo' : 'Suspenso'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick House Edge & Risk Control */}
          <div className="p-5 rounded-2xl glass-panel-subtle">
            <h3 className="text-sm font-semibold text-white mb-2">
              Controle de Risco e Algoritmo de Execução
            </h3>
            <p className="text-xs text-[#8C97B3] mb-4">
              Parâmetros de proteção da banca da casa contra oscilações bruscas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-[#8C97B3] mb-1">Win Rate Global dos Traders</div>
                <div className="text-lg font-bold text-white font-mono tabular-nums">47.8%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Faixa segura (&lt; 50%)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-[#8C97B3] mb-1">Exposição Máxima por Vela</div>
                <div className="text-lg font-bold text-white font-mono tabular-nums">R$ 50.000</div>
                <div className="text-[10px] text-[#8C97B3] mt-0.5">Limite global por ativo</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-[#8C97B3] mb-1">Spread Dinâmico</div>
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">Ativado</div>
                <div className="text-[10px] text-[#8C97B3] mt-0.5">Proteção contra bots</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Approvals Queue & Quick Admin Actions */}
        <div className="space-y-6">
          {/* Pending Withdrawals Quick Approval */}
          <div className="p-5 rounded-2xl glass-panel-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Fila de Saques PIX / USDT</span>
              </h3>
              <span className="text-xs text-[#8C97B3] font-mono">
                {pendingTransactions.length} pendente(s)
              </span>
            </div>

            {pendingTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8C97B3]">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                Nenhuma solicitação de saque pendente.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTransactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{tx.userName}</span>
                      <span className="font-bold text-orange-300 font-mono tabular-nums">
                        {formatBRL(tx.amount)}
                      </span>
                    </div>
                    <div className="text-[#8C97B3] text-[11px] flex items-center justify-between">
                      <span>Método: {tx.method}</span>
                      <span>{tx.createdAt}</span>
                    </div>
                    {tx.pixKey && (
                      <div className="p-1.5 rounded bg-black/40 font-mono text-[10.5px] text-[#8C97B3] truncate">
                        Chave PIX: {tx.pixKey}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onApproveTransaction(tx.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        Aprovar Pagamento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl glass-panel-subtle space-y-3">
            <h3 className="text-sm font-semibold text-white mb-2">
              Acesso Rápido às Funções
            </h3>
            
            <button
              onClick={() => onNavigateTab('assets')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-left text-xs transition-colors border border-white/[0.06] flex items-center justify-between text-white"
            >
              <span>Configurar Payouts (EUR/USD, BTC)</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C97B3]" />
            </button>

            <button
              onClick={() => onNavigateTab('users')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-left text-xs transition-colors border border-white/[0.06] flex items-center justify-between text-white"
            >
              <span>Gerenciar Contas & Saldo de Clientes</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C97B3]" />
            </button>

            <button
              onClick={() => onNavigateTab('financial')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-left text-xs transition-colors border border-white/[0.06] flex items-center justify-between text-white"
            >
              <span>Limites de Depósito PIX & Tether</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C97B3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
