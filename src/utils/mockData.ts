import { Transaction, IncomeData, IncomeProofNFT } from '../types';

// Generate mock transactions for demo
export const generateMockTransactions = (walletAddress: string): Transaction[] => {
  const employers = [
    { address: '0x1234...5678', name: 'NeuraTech Labs' },
    { address: '0x8765...4321', name: 'DeFi Protocol Inc' },
    { address: '0xabcd...efgh', name: 'Web3 Ventures' },
    { address: '0x9999...1111', name: 'Crypto Consulting' },
  ];
  
  const memos = [
    'Monthly salary payment',
    'Project milestone completion',
    'Freelance development work',
    'Smart contract audit',
    'UI/UX design services',
    'Technical consultation',
    'Bug bounty reward',
    'Protocol integration work',
  ];
  
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate 6 months of transactions
  for (let month = 0; month < 6; month++) {
    const paymentsThisMonth = Math.floor(Math.random() * 3) + 2; // 2-4 payments per month
    
    for (let i = 0; i < paymentsThisMonth; i++) {
      const employer = employers[Math.floor(Math.random() * employers.length)];
      const amount = Math.floor(Math.random() * 5000) + 1500; // $1500 - $6500
      const day = Math.floor(Math.random() * 28) + 1;
      
      const date = new Date(now);
      date.setMonth(date.getMonth() - month);
      date.setDate(day);
      
      transactions.push({
        id: `tx-${month}-${i}`,
        from: employer.address,
        to: walletAddress,
        amount: amount,
        timestamp: date,
        memo: memos[Math.floor(Math.random() * memos.length)],
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      });
    }
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Calculate income metrics from transactions
export const calculateIncomeMetrics = (transactions: Transaction[]): IncomeData => {
  const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyTotals: { [key: string]: number } = {};
  const uniqueEmployers = new Set<string>();
  
  transactions.forEach((tx) => {
    const monthKey = `${tx.timestamp.getFullYear()}-${tx.timestamp.getMonth()}`;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + tx.amount;
    uniqueEmployers.add(tx.from);
  });
  
  const months = Object.keys(monthlyTotals).length;
  const averageMonthlyIncome = months > 0 ? totalIncome / months : 0;
  
  // Determine payment frequency
  const avgPaymentsPerMonth = transactions.length / months;
  let paymentFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'irregular';
  
  if (avgPaymentsPerMonth >= 4) {
    paymentFrequency = 'weekly';
  } else if (avgPaymentsPerMonth >= 2) {
    paymentFrequency = 'bi-weekly';
  } else if (avgPaymentsPerMonth >= 0.8) {
    paymentFrequency = 'monthly';
  } else {
    paymentFrequency = 'irregular';
  }
  
  return {
    totalIncome,
    averageMonthlyIncome,
    paymentCount: transactions.length,
    employerCount: uniqueEmployers.size,
    paymentFrequency,
    transactions,
    lastUpdated: new Date(),
  };
};

// Generate mock NFT data
export const generateMockNFT = (
  tokenId: number,
  walletAddress: string,
  incomeData: IncomeData
): IncomeProofNFT => {
  const verificationHash = `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
  
  return {
    tokenId,
    walletAddress,
    verificationTimestamp: new Date(),
    averageMonthlyIncome: incomeData.averageMonthlyIncome,
    paymentFrequency: incomeData.paymentFrequency,
    employerCount: incomeData.employerCount,
    verificationHash,
    isValid: true,
    tokenURI: `ipfs://QmNeuraProof${tokenId}`,
  };
};

// Permitted jurisdictions
export const PERMITTED_JURISDICTIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export const BLOCKED_JURISDICTIONS = [
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
];

// Neura Testnet configuration
export const NEURA_TESTNET = {
  chainId: 267,
  chainName: 'Neura Testnet',
  nativeCurrency: {
    name: 'ANKR',
    symbol: 'ANKR',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.ankr.com/neura_testnet'],
  blockExplorerUrls: ['https://testnet.explorer.neura.network'],
};

// Contract addresses (mock for demo)
export const CONTRACT_ADDRESSES = {
  neuraProofNFT: '0x742d35Cc6634C0532925a3b844Bc9e7595f1E123',
  neuraPay: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  mockUSN: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
};
