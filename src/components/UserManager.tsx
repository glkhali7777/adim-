import React, { useState } from 'react';
import { User, KycStatus } from '../types/broker';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Crown, 
  PlusCircle, 
  DollarSign, 
  ShieldCheck,
  Ban,
  UserCheck
} from 'lucide-react';
import { formatBRL } from '../utils/brokerCalculations';

interface UserManagerProps {
  users: User[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  onUpdateUser
}) => {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [vipFilter, setVipFilter] = useState<boolean | 'all'>('all');
  
  // Balance adjustment modal state
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('100');
  const [balanceType, setBalanceType] = useState<'real' | 'demo'>('real');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          user.cpf.includes(search) ||
                          user.phone.includes(search);
    const matchesKyc = kycFilter === 'all' || user.kycStatus === kycFilter;
    const matchesVip = vipFilter === 'all' || user.isVip === vipFilter;
    return matchesSearch && matchesKyc && matchesVip;
  });

  const handleApproveKyc = (id: string) => {
    onUpdateUser(id, { kycStatus: 'verified' });
  };

  const handleRejectKyc = (id: string) => {
    onUpdateUser(id, { kycStatus: 'rejected' });
  };

  const handleToggleVip = (id: string, currentVip: boolean) => {
    onUpdateUser(id, { isVip: !currentVip });
  };

  const handleToggleBlock = (id: string, currentStatus: 'active' | 'blocked') => {
    onUpdateUser(id, { status: currentStatus === 'active' ? 'blocked' : 'active' });
  };

  const handleSaveBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;

    const val = parseFloat(adjustmentAmount);
    if (isNaN(val) || val <= 0) return;

    if (balanceType === 'real') {
      const newBal = adjustmentType === 'add' 
        ? selectedUserForBalance.realBalance + val 
        : Math.max(0, selectedUserForBalance.realBalance - val);
      onUpdateUser(selectedUserForBalance.id, { realBalance: newBal });
    } else {
      const newBal = adjustmentType === 'add' 
        ? selectedUserForBalance.demoBalance + val 
        : Math.max(0, selectedUserForBalance.demoBalance - val);
      onUpdateUser(selectedUserForBalance.id, { demoBalance: newBal });
    }

    setSelectedUserForBalance(null);
  };

  const getKycBadge = (status: KycStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Aprovado</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-orange-500/15 text-orange-400">
            <Clock className="w-3 h-3" />
            <span>Em Análise</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-red-500/15 text-red-400">
            <XCircle className="w-3 h-3" />
            <span>Rejeitado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-white/[0.05] text-[#8C97B3]">
            <span>Não Enviado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl glass-panel-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF7700]" />
            <span>Gestão de Contas de Clientes & Verificação KYC</span>
          </h2>
          <p className="text-xs text-[#8C97B3] mt-1">
            Audite cadastros, aprove documentos KYC, defina privilégios VIP e ajuste saldos de conta real/demo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className="text-[#8C97B3]">Total de Clientes:</span>{' '}
            <span className="text-white font-bold font-mono">{users.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
            <span className="text-orange-300">VIPs Ativos:</span>{' '}
            <span className="text-orange-400 font-bold font-mono">
              {users.filter(u => u.isVip).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C97B3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, CPF ou telefone..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-[#5F6B8A] focus:border-[#FF7700]/70 focus:outline-none transition-colors"
          />
        </div>

        {/* KYC & VIP Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:border-[#FF7700] focus:outline-none"
          >
            <option value="all" className="bg-[#0B1020]">Status KYC: Todos</option>
            <option value="verified" className="bg-[#0B1020]">KYC Aprovado</option>
            <option value="pending" className="bg-[#0B1020]">KYC Pendente</option>
            <option value="rejected" className="bg-[#0B1020]">KYC Rejeitado</option>
          </select>

          <select
            value={String(vipFilter)}
            onChange={(e) => setVipFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
            className="h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:border-[#FF7700] focus:outline-none"
          >
            <option value="all" className="bg-[#0B1020]">Nível VIP: Todos</option>
            <option value="true" className="bg-[#0B1020]">Apenas Clientes VIP</option>
            <option value="false" className="bg-[#0B1020]">Apenas Padrão</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-2xl glass-panel-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-[#8C97B3]">
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Documento & Contato</th>
              <th className="pb-3 font-medium text-right">Saldo Real</th>
              <th className="pb-3 font-medium text-right">Saldo Demo</th>
              <th className="pb-3 font-medium text-center">Status KYC</th>
              <th className="pb-3 font-medium text-center">Nível VIP</th>
              <th className="pb-3 font-medium text-right">Ações do Operador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                {/* User Name & Avatar */}
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-white/[0.12] bg-[#1A2238]"
                    />
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.status === 'blocked' && (
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded font-normal">
                            Bloqueado
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8C97B3]">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* CPF & Phone */}
                <td className="py-3.5 pr-3 font-mono text-[11px] text-[#8C97B3]">
                  <div>CPF: {user.cpf}</div>
                  <div>Tel: +{user.phone}</div>
                </td>

                {/* Real Balance */}
                <td className="py-3.5 pr-3 text-right font-mono font-bold text-white tabular-nums">
                  {formatBRL(user.realBalance)}
                </td>

                {/* Demo Balance */}
                <td className="py-3.5 pr-3 text-right font-mono text-[#8C97B3] tabular-nums">
                  {formatBRL(user.demoBalance)}
                </td>

                {/* KYC Badge */}
                <td className="py-3.5 pr-3 text-center">
                  {getKycBadge(user.kycStatus)}
                </td>

                {/* VIP Status */}
                <td className="py-3.5 pr-3 text-center">
                  <button
                    onClick={() => handleToggleVip(user.id, user.isVip)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold transition-colors ${
                      user.isVip 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30' 
                        : 'bg-white/[0.04] text-[#8C97B3] hover:text-white'
                    }`}
                    title={user.isVip ? 'Remover status VIP' : 'Promover para VIP'}
                  >
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{user.isVip ? 'VIP Ativo' : 'Tornar VIP'}</span>
                  </button>
                </td>

                {/* Operator Actions */}
                <td className="py-3.5 text-right space-x-1.5">
                  {/* Balance Adjustment button */}
                  <button
                    onClick={() => setSelectedUserForBalance(user)}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-orange-300 border border-white/[0.08] transition-colors"
                    title="Ajustar saldo real ou demo"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </button>

                  {/* KYC Approve / Reject */}
                  {user.kycStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveKyc(user.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                        title="Aprovar Documentos KYC"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectKyc(user.id)}
                        className="px-2 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-medium text-[11px] transition-colors"
                        title="Recusar Documentos KYC"
                      >
                        Recusar
                      </button>
                    </>
                  ) : user.kycStatus !== 'verified' ? (
                    <button
                      onClick={() => handleApproveKyc(user.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-[#8C97B3] hover:text-emerald-400 transition-colors"
                      title="Validar KYC Manualmente"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  {/* Block / Unblock */}
                  <button
                    onClick={() => handleToggleBlock(user.id, user.status)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      user.status === 'blocked' 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-white/[0.04] text-[#8C97B3] hover:text-red-400'
                    }`}
                    title={user.status === 'blocked' ? 'Desbloquear Conta' : 'Bloquear Conta'}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Balance Adjustment Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel bg-[#0B1020] border border-white/[0.12] shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Ajuste Manual de Saldo de Cliente
            </h3>
            <p className="text-xs text-[#8C97B3] mb-4">
              Cliente: <strong className="text-white">{selectedUserForBalance.name}</strong> ({selectedUserForBalance.email})
            </p>

            <form onSubmit={handleSaveBalanceAdjustment} className="space-y-4">
              {/* Account Type (Real vs Demo) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#8C97B3] uppercase mb-1.5">
                  Carteira Alvo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceType('real')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      balanceType === 'real'
                        ? 'bg-[#FF7700] text-white border-transparent'
                        : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                    }`}
                  >
                    Conta Real (BRL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceType('demo')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      balanceType === 'demo'
                        ? 'bg-[#FF7700] text-white border-transparent'
                        : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                    }`}
                  >
                    Conta Demo
                  </button>
                </div>
              </div>

              {/* Action: Add vs Subtract */}
              <div>
                <label className="block text-[11px] font-semibold text-[#8C97B3] uppercase mb-1.5">
                  Operação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      adjustmentType === 'add'
                        ? 'bg-emerald-600 text-white border-transparent'
                        : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                    }`}
                  >
                    + Creditar Saldo
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('subtract')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      adjustmentType === 'subtract'
                        ? 'bg-red-600 text-white border-transparent'
                        : 'bg-white/[0.04] text-[#8C97B3] border-white/[0.08]'
                    }`}
                  >
                    - Debitar Saldo
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-[11px] font-semibold text-[#8C97B3] uppercase mb-1.5">
                  Valor da Operação (R$)
                </label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-sm font-mono text-white focus:border-[#FF7700] focus:outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8C97B3] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF7700] hover:bg-[#E05E00] transition-colors"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
