export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
}

export interface IncomeData {
  totalIncome: number;
  averageMonthlyIncome: number;
  paymentCount: number;
  employerCount: number;
  paymentFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'irregular';
  transactions: Transaction[];
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  memo: string;
  txHash: string;
}

export interface IncomeProofNFT {
  tokenId: number;
  walletAddress: string;
  verificationTimestamp: Date;
  averageMonthlyIncome: number;
  paymentFrequency: string;
  employerCount: number;
  verificationHash: string;
  isValid: boolean;
  tokenURI: string;
}

export interface VerificationResult {
  isValid: boolean;
  proof: IncomeProofNFT | null;
  error?: string;
}

export type AppView = 'dashboard' | 'mint' | 'verify' | 'history';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
