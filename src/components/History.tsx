import React from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Shield, 
  ExternalLink,
  Copy,
  Check,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, shortenAddress } from '../utils/wallet';
import { NEURA_TESTNET } from '../utils/mockData';

export const History: React.FC = () => {
  const { wallet, mintedNFTs, setCurrentView } = useStore();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!wallet.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center mb-6">
            <HistoryIcon className="w-12 h-12 text-amber-400" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-50" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 max-w-md">
          Connect your wallet to view your minted income proof NFTs.
        </p>
      </div>
    );
  }

  if (mintedNFTs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 border border-gray-600/30 flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-gray-500" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">No Proofs Yet</h2>
        <p className="text-gray-400 max-w-md mb-6">
          You haven't minted any income proof NFTs yet. Mint your first proof to get started.
        </p>
        <button
          onClick={() => setCurrentView('mint')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium hover:shadow-neon transition-all duration-300"
        >
          Mint Your First Proof
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Proof History</h1>
        <p className="text-gray-400">Your minted income verification NFTs</p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="gradient-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mintedNFTs.length}</p>
              <p className="text-sm text-gray-400">Total Proofs</p>
            </div>
          </div>
        </div>
        <div className="gradient-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mintedNFTs.filter(n => n.isValid).length}</p>
              <p className="text-sm text-gray-400">Valid Proofs</p>
            </div>
          </div>
        </div>
        <div className="gradient-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mintedNFTs.length > 0 ? formatDate(mintedNFTs[mintedNFTs.length - 1].verificationTimestamp).split(',')[0] : '-'}
              </p>
              <p className="text-sm text-gray-400">Latest Mint</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NFT List */}
      <div className="space-y-4">
        {mintedNFTs.map((nft, index) => (
          <motion.div
            key={nft.tokenId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="gradient-border rounded-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">NeuraProof #{nft.tokenId}</h3>
                    <p className="text-sm text-gray-400">
                      Minted on {formatDate(nft.verificationTimestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    nft.isValid 
                      ? 'bg-green-400/10 text-green-400 border border-green-400/30' 
                      : 'bg-red-400/10 text-red-400 border border-red-400/30'
                  }`}>
                    {nft.isValid ? 'Valid' : 'Invalid'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-xs font-medium border border-neon-purple/30">
                    Soulbound
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Avg. Monthly</span>
                  </div>
                  <p className="text-white font-semibold">{formatCurrency(nft.averageMonthlyIncome)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-neon-purple" />
                    <span className="text-xs text-gray-400">Employers</span>
                  </div>
                  <p className="text-white font-semibold">{nft.employerCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-gray-400">Frequency</span>
                  </div>
                  <p className="text-white font-semibold capitalize">{nft.paymentFrequency}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-neon-blue" />
                    <span className="text-xs text-gray-400">Token ID</span>
                  </div>
                  <p className="text-white font-semibold">#{nft.tokenId}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => copyToClipboard(nft.verificationHash, `hash-${nft.tokenId}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-cyber-border hover:border-neon-blue/30 transition-colors text-sm"
                >
                  {copiedId === `hash-${nft.tokenId}` ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Copy Hash</span>
                    </>
                  )}
                </button>
                <a
                  href={`${NEURA_TESTNET.blockExplorerUrls[0]}/token/${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 hover:bg-neon-blue/20 transition-colors text-sm text-neon-blue"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
