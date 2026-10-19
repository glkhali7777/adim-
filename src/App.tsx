import React, { useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminHeader, AdminTab } from './components/AdminHeader';
import { DashboardOverview } from './components/DashboardOverview';
import { AssetManager } from './components/AssetManager';
import { UserManager } from './components/UserManager';
import { FinancialManager } from './components/FinancialManager';
import { LiveTradesMonitor } from './components/LiveTradesMonitor';
import { BrokerSettings } from './components/BrokerSettings';
import { TraderoomSimulator } from './components/TraderoomSimulator';

import { 
  INITIAL_ASSETS, 
  INITIAL_USERS, 
  INITIAL_TRADES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CONFIG 
} from './data/mockData';
import { Asset, User, Trade, Transaction, BrokerBrandConfig } from './types/broker';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@brokerqx.pro');

  // Application Data State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [viewMode, setViewMode] = useState<'admin' | 'traderoom'>('admin');

  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [config, setConfig] = useState<BrokerBrandConfig>(INITIAL_CONFIG);

  // Login handler
  const handleLoginSuccess = (email: string) => {
    setAdminEmail(email);
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode('admin');
  };

  // Asset modification
  const handleUpdateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleBulkUpdatePayout = (payout: number) => {
    setAssets(prev => prev.map(a => ({ ...a, payout })));
  };

  // User modification
  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  // Transaction approvals
  const handleApproveTransaction = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
  };

  const handleRejectTransaction = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
  };

  // Config updates
  const handleUpdateConfig = (updates: Partial<BrokerBrandConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Traderoom new trade
  const handleTradeExecuted = (trade: Trade) => {
    setTrades(prev => {
      const existing = prev.find(t => t.id === trade.id);
      if (existing) {
        return prev.map(t => t.id === trade.id ? trade : t);
      }
      return [trade, ...prev];
    });
  };

  // If unauthenticated, show the exact dark glassmorphism Login page requested
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // If in Traderoom mode, show client trading simulator
  if (viewMode === 'traderoom') {
    return (
      <TraderoomSimulator
        assets={assets}
        config={config}
        onBackToAdmin={() => setViewMode('admin')}
        onTradeExecuted={handleTradeExecuted}
      />
    );
  }

  // Admin Operator Back-Office
  return (
    <div className="min-h-screen bg-[#080C18] text-[#E9EDF8] flex flex-col antialiased">
      {/* Top Header */}
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleTraderoom={() => setViewMode('traderoom')}
        onLogout={handleLogout}
        adminEmail={adminEmail}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            assets={assets}
            users={users}
            transactions={transactions}
            trades={trades}
            onNavigateTab={setActiveTab}
            onApproveTransaction={handleApproveTransaction}
          />
        )}

        {activeTab === 'assets' && (
          <AssetManager
            assets={assets}
            onUpdateAsset={handleUpdateAsset}
            onBulkUpdatePayout={handleBulkUpdatePayout}
          />
        )}

        {activeTab === 'users' && (
          <UserManager
            users={users}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {activeTab === 'financial' && (
          <FinancialManager
            transactions={transactions}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onApproveTransaction={handleApproveTransaction}
            onRejectTransaction={handleRejectTransaction}
          />
        )}

        {activeTab === 'trades' && (
          <LiveTradesMonitor
            trades={trades}
          />
        )}

        {activeTab === 'settings' && (
          <BrokerSettings
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-4 px-6 text-center text-xs text-[#5F6B8A] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Broker QX Back-Office Operador · Versão 4.225b</span>
        </div>
        <div>
          ACESSO RESTRITO AO OPERADOR DA CASA
        </div>
      </footer>
    </div>
  );
}
