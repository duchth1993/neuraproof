import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  ArrowUpRight,
  Loader2,
  Scan,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateMockTransactions, calculateIncomeMetrics } from '../utils/mockData';
import { formatCurrency, formatDate, shortenAddress } from '../utils/wallet';

export const Dashboard: React.FC = () => {
  const { wallet, incomeData, setIncomeData, isScanning, setIsScanning, addToast } = useStore();
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    if (!wallet.address) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    clearInterval(progressInterval);
    setScanProgress(100);
    
    const transactions = generateMockTransactions(wallet.address);
    const metrics = calculateIncomeMetrics(transactions);
    setIncomeData(metrics);
    
    setIsScanning(false);
    addToast({
      type: 'success',
      title: 'Scan Complete',
      message: `Found ${transactions.length} transactions from ${metrics.employerCount} employers`,
    });
  };

  useEffect(() => {
    if (wallet.isConnected && !incomeData) {
      handleScan();
    }
  }, [wallet.isConnected]);

  if (!wallet.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center mb-6">
            <Scan className="w-12 h-12 text-neon-blue" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-3xl blur-xl opacity-50" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 max-w-md">
          Connect your wallet to scan your income history and generate verifiable proof of your earnings.
        </p>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full border-4 border-neon-blue/20 flex items-center justify-center relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-t from-neon-blue/30 to-transparent transition-all duration-300"
              style={{ height: `${scanProgress}%`, bottom: 0, top: 'auto' }}
            />
            <div className="relative z-10 text-center">
              <Loader2 className="w-8 h-8 text-neon-blue animate-spin mx-auto mb-2" />
              <span className="text-2xl font-bold text-white">{Math.min(100, Math.round(scanProgress))}%</span>
            </div>
          </div>
          <div className="absolute -inset-4 bg-neon-blue/20 rounded-full blur-xl animate-pulse" />
        </motion.div>
        <h2 className="text-xl font-bold text-white mb-2">Scanning Wallet History</h2>
        <p className="text-gray-400">Analyzing transactions from whitelisted payroll contracts...</p>
      </div>
    );
  }

  if (!incomeData) {
    return null;
  }

  const stats = [
    {
      label: 'Average Monthly Income',
      value: formatCurrency(incomeData.averageMonthlyIncome),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-green-400 to-emerald-500',
      change: '+12.5%',
    },
    {
      label: 'Total Payments',
      value: incomeData.paymentCount.toString(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-neon-blue to-cyan-400',
      change: '+8',
    },
    {
      label: 'Unique Employers',
      value: incomeData.employerCount.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'from-neon-purple to-pink-400',
      change: '+2',
    },
    {
      label: 'Payment Frequency',
      value: incomeData.paymentFrequency.charAt(0).toUpperCase() + incomeData.paymentFrequency.slice(1),
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-amber-400 to-orange-500',
      change: 'Consistent',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Income Dashboard</h1>
          <p className="text-gray-400">
            Last updated: {formatDate(incomeData.lastUpdated)}
          </p>
        </div>
        <button
          onClick={handleScan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Rescan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="gradient-border p-5 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="gradient-border rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-cyber-border">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          <p className="text-sm text-gray-400">Last 6 months of verified income</p>
        </div>
        <div className="divide-y divide-cyber-border">
          {incomeData.transactions.slice(0, 8).map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.memo}</p>
                  <p className="text-xs text-gray-500">
                    From: {shortenAddress(tx.from)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-400">
                  +{formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
