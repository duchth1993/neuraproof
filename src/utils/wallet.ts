import { NEURA_TESTNET } from './mockData';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export const connectWallet = async (): Promise<{ address: string; chainId: number }> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    }) as string;

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
      throw new Error('Connection rejected. Please approve the connection request.');
    }
    throw error;
  }
};

export const switchToNeuraTestnet = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NEURA_TESTNET.chainId.toString(16)}` }],
    });
  } catch (error: unknown) {
    // Chain not added, try to add it
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${NEURA_TESTNET.chainId.toString(16)}`,
            chainName: NEURA_TESTNET.chainName,
            nativeCurrency: NEURA_TESTNET.nativeCurrency,
            rpcUrls: NEURA_TESTNET.rpcUrls,
            blockExplorerUrls: NEURA_TESTNET.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw error;
    }
  }
};

export const getBalance = async (address: string): Promise<string> => {
  if (!window.ethereum) {
    return '0';
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }) as string;

    // Convert from wei to ETH
    const balanceInEth = parseInt(balance, 16) / 1e18;
    return balanceInEth.toFixed(4);
  } catch {
    return '0';
  }
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
