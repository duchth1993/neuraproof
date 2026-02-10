import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  History 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { AppView } from '../types';

const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'mint', label: 'Mint Proof', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'verify', label: 'Verify', icon: <Search className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
];

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, wallet } = useStore();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 p-2 rounded-2xl glass-strong border border-neon-blue/20 shadow-neon"
      >
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const isDisabled = !wallet.isConnected && item.id !== 'verify';

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setCurrentView(item.id)}
              disabled={isDisabled}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white'
                  : isDisabled
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">{item.icon}</span>
              <span className="relative text-sm font-medium hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
};
