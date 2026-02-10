import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  ChevronDown,
  Loader2,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PERMITTED_JURISDICTIONS, BLOCKED_JURISDICTIONS, generateMockNFT, NEURA_TESTNET } from '../utils/mockData';
import { formatCurrency, shortenAddress } from '../utils/wallet';

export const MintProof: React.FC = () => {
  const { 
    wallet, 
    incomeData, 
    selectedJurisdiction, 
    setSelectedJurisdiction,
    isMinting,
    setIsMinting,
    addMintedNFT,
    mintedNFTs,
    addToast,
    setCurrentView
  } = useStore();
  
  const [isJurisdictionOpen, setIsJurisdictionOpen] = useState(false);
  const [mintStep, setMintStep] = useState<'idle' | 'confirming' | 'minting' | 'success'>('idle');
  const [mintedNFT, setMintedNFT] = useState<ReturnType<typeof generateMockNFT> | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedJurisdictionData = PERMITTED_JURISDICTIONS.find(j => j.code === selectedJurisdiction);
  const isBlocked = BLOCKED_JURISDICTIONS.some(j => j.code === selectedJurisdiction);

  const handleMint = async () => {
    if (!wallet.address || !incomeData || isBlocked) return;

    setMintStep('confirming');
    setIsMinting(true);

    // Simulate confirmation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMintStep('minting');

    // Simulate minting delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    const nft = generateMockNFT(mintedNFTs.length + 1, wallet.address, incomeData);
    addMintedNFT(nft);
    setMintedNFT(nft);
    setMintStep('success');
    setIsMinting(false);

    addToast({
      type: 'success',
      title: 'NFT Minted Successfully!',
      message: `Your income proof NFT #${nft.tokenId} has been minted`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetMint = () => {
    setMintStep('idle');
    setMintedNFT(null);
  };

  if (!wallet.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-neon-purple" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-3xl blur-xl opacity-50" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect to Mint</h2>
        <p className="text-gray-400 max-w-md">
          Connect your wallet and scan your income to mint a verifiable proof NFT.
        </p>
      </div>
    );
  }

  if (!incomeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle className="w-16 h-16 text-amber-400 mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">No Income Data</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Please scan your wallet first to analyze your income history.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium hover:shadow-neon transition-all duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {mintStep === 'success' && mintedNFT ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            {/* Success Animation */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: 2 }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-green-400 mx-auto"
              />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Proof Minted!</h2>
            <p className="text-gray-400 mb-8">Your income verification NFT is now on-chain</p>

            {/* NFT Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="gradient-border rounded-2xl p-6 mb-6 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">NeuraProof #{mintedNFT.tokenId}</h3>
                    <p className="text-sm text-gray-400">Soulbound Income Verification</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-xs font-medium">
                  Verified
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-cyber-border">
                  <span className="text-gray-400 text-sm">Wallet</span>
                  <span className="text-white font-mono text-sm">{shortenAddress(mintedNFT.walletAddress)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-border">
                  <span className="text-gray-400 text-sm">Avg. Monthly Income</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(mintedNFT.averageMonthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-border">
                  <span className="text-gray-400 text-sm">Payment Frequency</span>
                  <span className="text-white capitalize">{mintedNFT.paymentFrequency}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-border">
                  <span className="text-gray-400 text-sm">Employer Count</span>
                  <span className="text-white">{mintedNFT.employerCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Verification Hash</span>
                  <button
                    onClick={() => copyToClipboard(mintedNFT.verificationHash)}
                    className="flex items-center gap-2 text-neon-blue hover:text-neon-blue/80 transition-colors"
                  >
                    <span className="font-mono text-sm">{shortenAddress(mintedNFT.verificationHash)}</span>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-4">
              <a
                href={`${NEURA_TESTNET.blockExplorerUrls[0]}/token/${mintedNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
              <button
                onClick={resetMint}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium hover:shadow-neon transition-all duration-300"
              >
                Mint Another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative inline-block mb-4"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-neon-purple" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-3xl blur-xl opacity-50 animate-pulse-slow" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Mint Income Proof</h1>
              <p className="text-gray-400">Create a verifiable on-chain proof of your income</p>
            </div>

            {/* Income Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="gradient-border rounded-2xl p-6 mb-6"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-4">Income Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(incomeData.averageMonthlyIncome)}</p>
                  <p className="text-sm text-gray-400">Avg. Monthly</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{incomeData.employerCount}</p>
                  <p className="text-sm text-gray-400">Employers</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white capitalize">{incomeData.paymentFrequency}</p>
                  <p className="text-sm text-gray-400">Frequency</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{incomeData.paymentCount}</p>
                  <p className="text-sm text-gray-400">Payments</p>
                </div>
              </div>
            </motion.div>

            {/* Jurisdiction Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="gradient-border rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-neon-blue" />
                <h3 className="text-sm font-medium text-gray-400">Jurisdiction Compliance</h3>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsJurisdictionOpen(!isJurisdictionOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-cyber-border hover:border-neon-blue/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedJurisdictionData?.flag || '🌍'}</span>
                    <span className="text-white">{selectedJurisdictionData?.name || 'Select Jurisdiction'}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isJurisdictionOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isJurisdictionOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl glass-strong border border-neon-blue/20 overflow-hidden z-10 max-h-60 overflow-y-auto"
                    >
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-2">Permitted Jurisdictions</p>
                        {PERMITTED_JURISDICTIONS.map((j) => (
                          <button
                            key={j.code}
                            onClick={() => {
                              setSelectedJurisdiction(j.code);
                              setIsJurisdictionOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neon-blue/10 transition-colors"
                          >
                            <span className="text-xl">{j.flag}</span>
                            <span className="text-white">{j.name}</span>
                            {selectedJurisdiction === j.code && (
                              <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                            )}
                          </button>
                        ))}
                        <div className="border-t border-cyber-border my-2" />
                        <p className="text-xs text-red-400 px-3 py-2">Blocked Jurisdictions</p>
                        {BLOCKED_JURISDICTIONS.map((j) => (
                          <button
                            key={j.code}
                            onClick={() => {
                              setSelectedJurisdiction(j.code);
                              setIsJurisdictionOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-50"
                          >
                            <span className="text-xl">{j.flag}</span>
                            <span className="text-gray-400">{j.name}</span>
                            <AlertTriangle className="w-4 h-4 text-red-400 ml-auto" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isBlocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium">Jurisdiction Not Permitted</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Minting is not available in your selected jurisdiction due to regulatory restrictions.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Mint Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleMint}
              disabled={isMinting || isBlocked}
              className="w-full relative group py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg transition-all duration-300 hover:shadow-neon-strong disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {mintStep === 'confirming' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming Transaction...
                  </>
                ) : mintStep === 'minting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting NFT...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Mint Income Proof NFT
                  </>
                )}
              </span>
            </motion.button>

            {/* Info */}
            <p className="text-center text-sm text-gray-500 mt-4">
              This NFT is soulbound and cannot be transferred. Gas fees apply.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
