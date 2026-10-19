import React, { useState } from 'react';
import { Transaction, PaymentMethodType, BrokerBrandConfig } from '../types/broker';
import { 
  CreditCard, 
  QrCode, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Check, 
  X, 
  Clock, 
  Search,
  Filter,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatBRL } from '../utils/brokerCalculations';

interface FinancialManagerProps {
  transactions: Transaction[];
  config: BrokerBrandConfig;
  onUpdateConfig: (updates: Partial<BrokerBrandConfig>) => void;
  onApproveTransaction: (id: string) => void;
  onRejectTransaction: (id: string) => void;
}

export const FinancialManager: React.FC<FinancialManagerProps> = ({
  transactions,
  config,
  onUpdateConfig,
  onApproveTransaction,
  onRejectTransaction
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.userName.toLowerCase().includes(search.toLowerCase()) ||
                          (tx.pixKey && tx.pixKey.includes(search)) ||
                          (tx.txHash && tx.txHash.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || 
                        (filterType === 'DEPOSIT' && tx.type === 'DEPOSIT') ||
                        (filterType === 'WITHDRAWAL' && tx.type === 'WITHDRAWAL') ||
                        (filterType === 'PENDING' && tx.status === 'PENDING');
    return matchesSearch && matchesType;
  });

  const totalDepositsApproved = transactions
    .filter(t => t.type === 'DEPOSIT' && t.status === 'APPROVED')
    .reduce((sum, t) => sum + t.amount, 0) + 48650;

  const totalWithdrawalsApproved = transactions
    .filter(t => t.type === 'WITHDRAWAL' && t.status === 'APPROVED')
    .reduce((sum, t) => sum + t.amount, 0) + 18200;

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Depósitos Totais Recebidos</span>
            <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mb-1">
            {formatBRL(totalDepositsApproved)}
          </div>
          <div className="text-xs text-emerald-400">
            Gateway PIX & Tether TRC20 online
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Saques Pagos aos Clientes</span>
            <div className="p-1.5 rounded-md bg-blue-500/15 text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mb-1">
            {formatBRL(totalWithdrawalsApproved)}
          </div>
          <div className="text-xs text-[#8C97B3]">
            Tempo médio de liberação: 4 minutos
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel-subtle">
          <div className="flex items-center justify-between text-[#8C97B3] mb-2">
            <span className="text-xs font-medium">Saques Pendentes na Fila</span>
            <div className="p-1.5 rounded-md bg-orange-500/15 text-[#FF7700]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-300 font-mono tabular-nums mb-1">
            {transactions.filter(t => t.status === 'PENDING').length} solicitações
          </div>
          <div className="text-xs text-orange-400/90">
            Aguardando validação do operador
          </div>
        </div>
      </div>

      {/* Gateway Configuration Panel */}
      <div className="p-6 rounded-2xl glass-panel-subtle space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#FF7700]" />
          <span>Configuração dos Meios de Pagamento (PIX & USDT)</span>
        </h3>
        <p className="text-xs text-[#8C97B3]">
          Defina limites mínimos, máximos e habilite os métodos liberados na tela de depósito da corretora.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Method 3010: PIX (Apenas seu CPF) */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  PIX
                </div>
                <div>
                  <div className="text-xs font-bold text-white">PIX Brasil (Apenas seu CPF)</div>
                  <div className="text-[11px] text-[#8C97B3]">ID: 3010 · Liquidação Instantânea</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpdateConfig({ pixEnabled: !config.pixEnabled })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  config.pixEnabled 
                    ? 'bg-emerald-500/15 text-emerald-400' 
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {config.pixEnabled ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#8C97B3] text-[10.5px] block">Mínimo Depósito</span>
                <input
                  type="number"
                  value={config.pixMinDeposit}
                  onChange={(e) => onUpdateConfig({ pixMinDeposit: Number(e.target.value) })}
                  className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF7700]"
                />
              </div>
              <div>
                <span className="text-[#8C97B3] text-[10.5px] block">Máximo Depósito</span>
                <input
                  type="number"
                  value={config.pixMaxDeposit}
                  onChange={(e) => onUpdateConfig({ pixMaxDeposit: Number(e.target.value) })}
                  className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF7700]"
                />
              </div>
            </div>
          </div>

          {/* Method 3190: Tether (USDT) TRC20 */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-xs">
                  USDT
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Tether (USDT) TRC20</div>
                  <div className="text-[11px] text-[#8C97B3]">ID: 3190 · Rede Tron Blockchain</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpdateConfig({ usdtEnabled: !config.usdtEnabled })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  config.usdtEnabled 
                    ? 'bg-emerald-500/15 text-emerald-400' 
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {config.usdtEnabled ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#8C97B3] text-[10.5px] block">Mínimo Depósito (R$)</span>
                <input
                  type="number"
                  value={config.usdtMinDeposit}
                  onChange={(e) => onUpdateConfig({ usdtMinDeposit: Number(e.target.value) })}
                  className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF7700]"
                />
              </div>
              <div>
                <span className="text-[#8C97B3] text-[10.5px] block">Máximo Depósito (R$)</span>
                <input
                  type="number"
                  value={config.usdtMaxDeposit}
                  onChange={(e) => onUpdateConfig({ usdtMaxDeposit: Number(e.target.value) })}
                  className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF7700]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions & Cashier Ledger */}
      <div className="p-5 rounded-2xl glass-panel-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">
            Extrato Geral de Movimentações Financeiras
          </h3>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C97B3]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente ou chave..."
                className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-[#5F6B8A] focus:outline-none"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none"
            >
              <option value="all" className="bg-[#0B1020]">Todos os Tipos</option>
              <option value="PENDING" className="bg-[#0B1020]">Apenas Pendentes</option>
              <option value="DEPOSIT" className="bg-[#0B1020]">Apenas Depósitos</option>
              <option value="WITHDRAWAL" className="bg-[#0B1020]">Apenas Saques</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#8C97B3]">
                <th className="pb-3 font-medium">Transação</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Método</th>
                <th className="pb-3 font-medium">Destino / Chave</th>
                <th className="pb-3 font-medium text-right">Valor</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3 font-mono text-[11px]">
                    <div className="font-semibold text-white">{tx.id}</div>
                    <div className="text-[#8C97B3]">{tx.createdAt}</div>
                  </td>

                  <td className="py-3 pr-3 font-semibold text-white">
                    {tx.userName}
                  </td>

                  <td className="py-3 pr-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                      tx.method === 'PIX' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-teal-500/15 text-teal-400'
                    }`}>
                      {tx.method}
                    </span>
                  </td>

                  <td className="py-3 pr-3 font-mono text-[11px] text-[#8C97B3] max-w-[200px] truncate">
                    {tx.pixKey ? `PIX: ${tx.pixKey}` : tx.txHash ? `Hash: ${tx.txHash}` : `CPF: ${tx.cpf || 'Cadastrado'}`}
                  </td>

                  <td className="py-3 pr-3 text-right font-mono font-bold tabular-nums">
                    <span className={tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-orange-300'}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{formatBRL(tx.amount)}
                    </span>
                  </td>

                  <td className="py-3 pr-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-medium ${
                      tx.status === 'APPROVED' 
                        ? 'bg-emerald-500/15 text-emerald-400' 
                        : tx.status === 'PENDING' 
                        ? 'bg-orange-500/15 text-orange-400 font-bold' 
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {tx.status === 'APPROVED' ? 'Confirmado' : tx.status === 'PENDING' ? 'Pendente' : 'Recusado'}
                    </span>
                  </td>

                  <td className="py-3 text-right space-x-1.5">
                    {tx.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => onRejectTransaction(tx.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Recusar
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#5F6B8A]">Processado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
