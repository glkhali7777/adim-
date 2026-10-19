import React from 'react';
import { Eye, LogOut } from 'lucide-react';

export type AdminTab = 'overview' | 'assets' | 'users' | 'financial' | 'trades' | 'settings';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onToggleTraderoom: () => void;
  onLogout: () => void;
  adminEmail: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  onToggleTraderoom,
  onLogout,
  adminEmail
}) => {
  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'assets', label: 'Ativos & Payouts' },
    { id: 'users', label: 'Usuários & KYC' },
    { id: 'financial', label: 'Financeiro PIX/USDT' },
    { id: 'trades', label: 'Operações ao Vivo' },
    { id: 'settings', label: 'Configurações' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3.5 bg-[#080C18]/90 border-b border-white/[0.08] backdrop-blur-md">
        {/* Zone 1: Single element Brand Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white selo-orange">
            BQ
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#E9EDF8] whitespace-nowrap">
              Broker QX
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-orange-400/90 uppercase tracking-wider">
              Operador
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                    : 'text-[#8C97B3] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Session controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleTraderoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-200 bg-orange-500/15 border border-orange-500/30 hover:bg-orange-500/25 transition-all whitespace-nowrap shrink-0"
            title="Abrir o Traderoom interativo do cliente com os payouts configurados"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF7700]" />
            <span>Ver Traderoom</span>
          </button>

          <div className="h-4 w-[1px] bg-white/[0.10] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-[10px] font-bold text-orange-300">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[#8C97B3] max-w-[120px] truncate">
              {adminEmail}
            </span>
          </div>

          <button
            onClick={onLogout}
            aria-label="Encerrar sessão de operador"
            className="p-1.5 rounded-lg text-[#8C97B3] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Secondary Scrollable Tab Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-b border-white/[0.06] bg-[#0A0F1F] no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#FF7700] text-white shadow-sm font-semibold'
                  : 'text-[#8C97B3] hover:text-white bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
};
