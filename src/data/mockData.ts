import { Asset, User, Trade, Transaction, BrokerBrandConfig } from '../types/broker';

export const INITIAL_CONFIG: BrokerBrandConfig = {
  brandName: 'Broker QX',
  logoUrl: '/branding/logo.png',
  footerLogoUrl: '/branding/developer_logo.png',
  preloaderGifUrl: '/branding/preloader_gif.gif',
  faviconUrl: '/branding/favicon.png',
  pwaLiberado: true,
  pixEnabled: true,
  usdtEnabled: true,
  pixMinDeposit: 10,
  pixMaxDeposit: 50000,
  usdtMinDeposit: 50,
  usdtMaxDeposit: 100000,
  depositBonusEnabled: true,
  depositBonusPercent: 50,
  maintenanceMode: false,
  systemNotification: 'Servidores operando normalmente. Latência média: 14ms.'
};

export const INITIAL_ASSETS: Asset[] = [
  {
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
    priceHistory: [1.0820, 1.0828, 1.0835, 1.0831, 1.0840, 1.0842, 1.0845, 1.08452]
  },
  {
    id: '2',
    symbol: 'GBP/USD',
    name: 'Libra Esterlina / Dólar Americano',
    category: 'turbo',
    payout: 90,
    minBet: 5,
    maxBet: 10000,
    enabled: true,
    currentPrice: 1.29140,
    change24h: -0.18,
    priceHistory: [1.2930, 1.2925, 1.2920, 1.2918, 1.2915, 1.2912, 1.2914]
  },
  {
    id: '3',
    symbol: 'BTC/USD',
    name: 'Bitcoin / Dólar Americano',
    category: 'blitz',
    payout: 95,
    minBet: 10,
    maxBet: 25000,
    enabled: true,
    currentPrice: 68420.50,
    change24h: 3.42,
    priceHistory: [67100, 67450, 67800, 68050, 68300, 68410, 68420.50]
  },
  {
    id: '4',
    symbol: 'USD/JPY',
    name: 'Dólar Americano / Iene Japonês',
    category: 'binary',
    payout: 88,
    minBet: 5,
    maxBet: 8000,
    enabled: true,
    currentPrice: 153.24,
    change24h: 0.12,
    priceHistory: [153.10, 153.15, 153.18, 153.20, 153.22, 153.24]
  },
  {
    id: '5',
    symbol: 'ETH/USD',
    name: 'Ethereum / Dólar Americano',
    category: 'digital',
    payout: 91,
    minBet: 10,
    maxBet: 15000,
    enabled: true,
    currentPrice: 3480.20,
    change24h: 1.85,
    priceHistory: [3410, 3430, 3450, 3465, 3472, 3480.20]
  },
  {
    id: '6',
    symbol: 'XAU/USD',
    name: 'Ouro / Dólar Americano',
    category: 'turbo',
    payout: 89,
    minBet: 5,
    maxBet: 12000,
    enabled: true,
    currentPrice: 2724.80,
    change24h: 0.65,
    priceHistory: [2710, 2714, 2718, 2720, 2722, 2724.80]
  },
  {
    id: '7',
    symbol: 'EUR/JPY',
    name: 'Euro / Iene Japonês',
    category: 'trade-rush',
    payout: 87,
    minBet: 5,
    maxBet: 5000,
    enabled: false,
    currentPrice: 166.15,
    change24h: -0.45,
    priceHistory: [166.8, 166.6, 166.4, 166.3, 166.2, 166.15]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_101',
    name: 'Lucas Ferreira Mendes',
    email: 'lucas.mendes@email.com',
    phone: '5511987654321',
    cpf: '384.921.058-22',
    realBalance: 3450.00,
    demoBalance: 10000.00,
    isVip: true,
    kycStatus: 'verified',
    status: 'active',
    totalDeposited: 12500.00,
    totalWithdrawn: 7800.00,
    registeredAt: '12/03/2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
  },
  {
    id: 'user_102',
    name: 'Camila Rocha Santos',
    email: 'camila.rocha@email.com',
    phone: '5521998123456',
    cpf: '412.839.192-04',
    realBalance: 820.50,
    demoBalance: 12400.00,
    isVip: false,
    kycStatus: 'verified',
    status: 'active',
    totalDeposited: 2500.00,
    totalWithdrawn: 1200.00,
    registeredAt: '28/05/2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80'
  },
  {
    id: 'user_103',
    name: 'Rodrigo Albuquerque',
    email: 'rodrigo.albuquerque@email.com',
    phone: '5531976543210',
    cpf: '198.472.930-18',
    realBalance: 14200.00,
    demoBalance: 8000.00,
    isVip: true,
    kycStatus: 'verified',
    status: 'active',
    totalDeposited: 35000.00,
    totalWithdrawn: 28000.00,
    registeredAt: '04/01/2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80'
  },
  {
    id: 'user_104',
    name: 'Juliana Castro Silva',
    email: 'juliana.castro@email.com',
    phone: '5541988887777',
    cpf: '529.183.049-71',
    realBalance: 150.00,
    demoBalance: 10000.00,
    isVip: false,
    kycStatus: 'pending',
    status: 'active',
    totalDeposited: 300.00,
    totalWithdrawn: 0.00,
    registeredAt: '18/10/2026',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80'
  },
  {
    id: 'user_105',
    name: 'Marcos Vinicius Duarte',
    email: 'marcos.v@email.com',
    phone: '5561991234567',
    cpf: '638.291.847-55',
    realBalance: 0.00,
    demoBalance: 9800.00,
    isVip: false,
    kycStatus: 'not_submitted',
    status: 'active',
    totalDeposited: 100.00,
    totalWithdrawn: 0.00,
    registeredAt: '19/10/2026',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=128&q=80'
  }
];

export const INITIAL_TRADES: Trade[] = [
  {
    id: 'tr_901',
    userId: 'user_101',
    userName: 'Lucas Ferreira',
    assetSymbol: 'EUR/USD',
    direction: 'CALL',
    amount: 150.00,
    payoutPercent: 92,
    strikePrice: 1.08440,
    status: 'OPEN',
    accountType: 'REAL',
    openedAt: Date.now() - 25000,
    expiresAt: Date.now() + 35000
  },
  {
    id: 'tr_902',
    userId: 'user_103',
    userName: 'Rodrigo Albuquerque',
    assetSymbol: 'BTC/USD',
    direction: 'PUT',
    amount: 500.00,
    payoutPercent: 95,
    strikePrice: 68410.00,
    status: 'OPEN',
    accountType: 'REAL',
    openedAt: Date.now() - 40000,
    expiresAt: Date.now() + 20000
  },
  {
    id: 'tr_903',
    userId: 'user_102',
    userName: 'Camila Rocha',
    assetSymbol: 'EUR/USD',
    direction: 'CALL',
    amount: 50.00,
    payoutPercent: 92,
    strikePrice: 1.08430,
    closePrice: 1.08455,
    status: 'WON',
    accountType: 'REAL',
    openedAt: Date.now() - 120000,
    expiresAt: Date.now() - 60000,
    profit: 46.00
  },
  {
    id: 'tr_904',
    userId: 'user_104',
    userName: 'Juliana Castro',
    assetSymbol: 'GBP/USD',
    direction: 'PUT',
    amount: 25.00,
    payoutPercent: 90,
    strikePrice: 1.29130,
    closePrice: 1.29150,
    status: 'LOST',
    accountType: 'REAL',
    openedAt: Date.now() - 180000,
    expiresAt: Date.now() - 120000,
    profit: -25.00
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_501',
    userId: 'user_101',
    userName: 'Lucas Ferreira Mendes',
    type: 'WITHDRAWAL',
    method: 'PIX',
    amount: 1500.00,
    status: 'PENDING',
    createdAt: '19/10/2026 12:45',
    pixKey: '384.921.058-22',
    cpf: '384.921.058-22'
  },
  {
    id: 'tx_502',
    userId: 'user_103',
    userName: 'Rodrigo Albuquerque',
    type: 'WITHDRAWAL',
    method: 'USDT',
    amount: 5000.00,
    status: 'PENDING',
    createdAt: '19/10/2026 11:20',
    txHash: 'TY1823901bca9082348ff98a12bc9e248'
  },
  {
    id: 'tx_503',
    userId: 'user_102',
    userName: 'Camila Rocha Santos',
    type: 'DEPOSIT',
    method: 'PIX',
    amount: 500.00,
    status: 'APPROVED',
    createdAt: '19/10/2026 10:15',
    cpf: '412.839.192-04'
  },
  {
    id: 'tx_504',
    userId: 'user_104',
    userName: 'Juliana Castro Silva',
    type: 'DEPOSIT',
    method: 'PIX',
    amount: 150.00,
    status: 'APPROVED',
    createdAt: '19/10/2026 09:30',
    cpf: '529.183.049-71'
  }
];
