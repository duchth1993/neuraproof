import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ChevronDown, 
  LogOut, 
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { connectWallet, switchToNeuraTestnet, getBalance, shortenAddress } from '../utils/wallet';
import { NEURA_TESTNET } from '../utils/mockData';

export const Header: React.FC = () => {
  const { wallet, setWallet, disconnectWallet, addToast } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address, chainId } = await connectWallet();
      
      // Check if on correct network
      if (chainId !== NEURA_TESTNET.chainId) {
        addToast({
          type: 'info',
          title: 'Switching Network',
          message: 'Switching to Neura Testnet...',
        });
        await switchToNeuraTestnet();
      }
      
      const balance = await getBalance(address);
      
      setWallet({
        address,
        isConnected: true,
        chainId: NEURA_TESTNET.chainId,
        balance,
      });
      
      addToast({
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected to ${shortenAddress(address)}`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: error instanceof Error ? error.message : 'Failed to connect wallet',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
    addToast({
      type: 'info',
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected',
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong border-b border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl blur opacity-30 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  NeuraProof
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Income Verification
                </p>
              </div>
            </motion.div>

            {/* Network Badge */}
            <motion.div 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-xs text-neon-blue font-medium">Neura Testnet</span>
            </motion.div>

            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {wallet.isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {shortenAddress(wallet.address || '')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {wallet.balance} ANKR
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl glass-strong border border-neon-blue/20 shadow-neon overflow-hidden"
                    >
                      <div className="p-2">
                        <a
                          href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${wallet.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neon-blue/10 transition-colors group"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-neon-blue" />
                          <span className="text-sm text-gray-300 group-hover:text-white">View on Explorer</span>
                        </a>
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                          <span className="text-sm text-gray-300 group-hover:text-red-400">Disconnect</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="relative group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium transition-all duration-300 hover:shadow-neon-strong disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    {isConnecting ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect Wallet
                      </>
                    )}
                  </span>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
