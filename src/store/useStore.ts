import { create } from 'zustand';
import { WalletState, IncomeData, IncomeProofNFT, AppView, ToastMessage } from '../types';

interface AppStore {
  // Wallet state
  wallet: WalletState;
  setWallet: (wallet: Partial<WalletState>) => void;
  disconnectWallet: () => void;
  
  // Income data
  incomeData: IncomeData | null;
  setIncomeData: (data: IncomeData | null) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  
  // NFT state
  mintedNFTs: IncomeProofNFT[];
  addMintedNFT: (nft: IncomeProofNFT) => void;
  isMinting: boolean;
  setIsMinting: (minting: boolean) => void;
  
  // Verification
  verificationResult: IncomeProofNFT | null;
  setVerificationResult: (result: IncomeProofNFT | null) => void;
  isVerifying: boolean;
  setIsVerifying: (verifying: boolean) => void;
  
  // UI state
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Jurisdiction
  selectedJurisdiction: string;
  setSelectedJurisdiction: (jurisdiction: string) => void;
}

export const useStore = create<AppStore>((set) => ({
  // Wallet state
  wallet: {
    address: null,
    isConnected: false,
    chainId: null,
    balance: '0',
  },
  setWallet: (wallet) => set((state) => ({ 
    wallet: { ...state.wallet, ...wallet } 
  })),
  disconnectWallet: () => set({ 
    wallet: { address: null, isConnected: false, chainId: null, balance: '0' },
    incomeData: null,
  }),
  
  // Income data
  incomeData: null,
  setIncomeData: (data) => set({ incomeData: data }),
  isScanning: false,
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  
  // NFT state
  mintedNFTs: [],
  addMintedNFT: (nft) => set((state) => ({ 
    mintedNFTs: [...state.mintedNFTs, nft] 
  })),
  isMinting: false,
  setIsMinting: (minting) => set({ isMinting: minting }),
  
  // Verification
  verificationResult: null,
  setVerificationResult: (result) => set({ verificationResult: result }),
  isVerifying: false,
  setIsVerifying: (verifying) => set({ isVerifying: verifying }),
  
  // UI state
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Toast notifications
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now().toString() }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  
  // Jurisdiction
  selectedJurisdiction: 'US',
  setSelectedJurisdiction: (jurisdiction) => set({ selectedJurisdiction: jurisdiction }),
}));
