export type AssetCategory = 'turbo' | 'binary' | 'blitz' | 'digital' | 'trade-rush';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  payout: number; // e.g. 92 for 92%
  minBet: number;
  maxBet: number;
  enabled: boolean;
  currentPrice: number;
  change24h: number;
  priceHistory: number[];
}

export type KycStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  realBalance: number;
  demoBalance: number;
  isVip: boolean;
  kycStatus: KycStatus;
  status: 'active' | 'blocked';
  totalDeposited: number;
  totalWithdrawn: number;
  registeredAt: string;
  avatarUrl: string;
}

export interface Trade {
  id: string;
  userId: string;
  userName: string;
  assetSymbol: string;
  direction: 'CALL' | 'PUT';
  amount: number;
  payoutPercent: number;
  strikePrice: number;
  closePrice?: number;
  status: 'OPEN' | 'WON' | 'LOST';
  accountType: 'REAL' | 'DEMO';
  openedAt: number; // timestamp
  expiresAt: number; // timestamp
  profit?: number;
}

export type PaymentMethodType = 'PIX' | 'USDT';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  method: PaymentMethodType;
  amount: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  pixKey?: string;
  txHash?: string;
  cpf?: string;
}

export interface BrokerBrandConfig {
  brandName: string;
  logoUrl: string;
  footerLogoUrl: string;
  preloaderGifUrl: string;
  faviconUrl: string;
  pwaLiberado: boolean;
  pixEnabled: boolean;
  usdtEnabled: boolean;
  pixMinDeposit: number;
  pixMaxDeposit: number;
  usdtMinDeposit: number;
  usdtMaxDeposit: number;
  depositBonusEnabled: boolean;
  depositBonusPercent: number;
  maintenanceMode: boolean;
  systemNotification: string;
}
