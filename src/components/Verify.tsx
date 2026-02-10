import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Shield, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle,
  Hash,
  User,
  Calendar,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateMockNFT, calculateIncomeMetrics, generateMockTransactions } from '../utils/mockData';
import { formatCurrency, formatDate, shortenAddress } from '../utils/wallet';

export const Verify: React.FC = () => {
  const { verificationResult, setVerificationResult, isVerifying, setIsVerifying, addToast } = useStore();
  const [searchType, setSearchType] = useState<'tokenId' | 'hash' | 'wallet'>('tokenId');
  const [searchValue, setSearchValue] = useState('');

  const handleVerify = async () => {
    if (!searchValue.trim()) {
      addToast({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter a value to search',
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification - in production this would query the blockchain
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f1E123';
    const mockTransactions = generateMockTransactions(mockAddress);
    const mockMetrics = calculateIncomeMetrics(mockTransactions);
    
    // Simulate found/not found based on input
    const isFound = searchValue.length > 2;
    
    if (isFound) {
      const mockNFT = generateMockNFT(
        searchType === 'tokenId' ? parseInt(searchValue) || 1 : Math.floor(Math.random() * 100) + 1,
        mockAddress,
        mockMetrics
      );
      setVerificationResult(mockNFT);
      addToast({
        type: 'success',
        title: 'Proof Verified',
        message: 'Income proof NFT found and validated',
      });
    } else {
      setVerificationResult(null);
      addToast({
        type: 'error',
        title: 'Not Found',
        message: 'No income proof found for the given input',
      });
    }

    setIsVerifying(false);
  };

  const clearSearch = () => {
    setSearchValue('');
    setVerificationResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block mb-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-cyan-400/20 border border-neon-blue/30 flex items-center justify-center">
            <Search className="w-10 h-10 text-neon-blue" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-br from-neon-blue/20 to-cyan-400/20 rounded-3xl blur-xl opacity-50 animate-pulse-slow" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Income Proof</h1>
        <p className="text-gray-400">Validate the authenticity of an income verification NFT</p>
      </div>

      {/* Search Type Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
        {[
          { id: 'tokenId', label: 'Token ID', icon: <Hash className="w-4 h-4" /> },
          { id: 'hash', label: 'Verification Hash', icon: <Shield className="w-4 h-4" /> },
          { id: 'wallet', label: 'Wallet Address', icon: <User className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSearchType(tab.id as typeof searchType);
              setSearchValue('');
              setVerificationResult(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              searchType === tab.id
                ? 'bg-neon-blue/20 border border-neon-blue/30 text-neon-blue'
                : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="gradient-border rounded-2xl p-6 mb-6"
      >
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder={
              searchType === 'tokenId'
                ? 'Enter Token ID (e.g., 1, 42, 100)'
                : searchType === 'hash'
                ? 'Enter verification hash (0x...)'
                : 'Enter wallet address (0x...)'
            }
            className="w-full px-4 py-4 pr-12 rounded-xl bg-white/5 border border-cyber-border focus:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/20 text-white placeholder-gray-500 font-mono transition-all duration-300"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || !searchValue.trim()}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-cyan-400 text-white font-semibold transition-all duration-300 hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Verify Proof
            </>
          )}
        </button>
      </motion.div>

      {/* Verification Result */}
      <AnimatePresence mode="wait">
        {isVerifying && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gradient-border rounded-2xl p-8 text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-neon-blue/20 border-t-neon-blue animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 text-neon-blue" />
              </div>
            </div>
            <p className="text-white font-medium">Querying blockchain...</p>
            <p className="text-sm text-gray-400 mt-1">Verifying proof authenticity</p>
          </motion.div>
        )}

        {!isVerifying && verificationResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gradient-border rounded-2xl overflow-hidden"
          >
            {/* Status Header */}
            <div className={`p-6 ${verificationResult.isValid ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  verificationResult.isValid 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {verificationResult.isValid ? (
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${verificationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {verificationResult.isValid ? 'Verified & Valid' : 'Invalid Proof'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    NeuraProof #{verificationResult.tokenId}
                  </p>
                </div>
              </div>
            </div>

            {/* Proof Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <User className="w-5 h-5 text-neon-blue" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Wallet Address</p>
                  <p className="text-white font-mono">{shortenAddress(verificationResult.walletAddress)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Avg. Monthly Income</p>
                    <p className="text-white font-semibold">{formatCurrency(verificationResult.averageMonthlyIncome)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                  <Users className="w-5 h-5 text-neon-purple" />
                  <div>
                    <p className="text-xs text-gray-400">Employer Count</p>
                    <p className="text-white font-semibold">{verificationResult.employerCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-gray-400">Payment Frequency</p>
                    <p className="text-white font-semibold capitalize">{verificationResult.paymentFrequency}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-400">Verified On</p>
                    <p className="text-white font-semibold">{formatDate(verificationResult.verificationTimestamp)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-neon-blue" />
                  <p className="text-xs text-gray-400">Verification Hash</p>
                </div>
                <p className="text-white font-mono text-sm break-all">{verificationResult.verificationHash}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!isVerifying && !verificationResult && searchValue && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gradient-border rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Proof Found</h3>
            <p className="text-gray-400">
              No income verification proof was found for the provided {searchType === 'tokenId' ? 'token ID' : searchType === 'hash' ? 'verification hash' : 'wallet address'}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/10"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300">
              <strong className="text-white">For Lenders & Verifiers:</strong> This verification portal allows you to validate income proofs on-chain. All data is cryptographically secured and tamper-proof.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
