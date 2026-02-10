import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/Toast';
import { Dashboard } from './components/Dashboard';
import { MintProof } from './components/MintProof';
import { Verify } from './components/Verify';
import { History } from './components/History';
import { useStore } from './store/useStore';

function App() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'mint':
        return <MintProof />;
      case 'verify':
        return <Verify />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Background />
      <Header />
      <ToastContainer />
      
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Navigation />

      {/* Tagline Overlay */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-sm text-gray-600 font-medium tracking-wider"
        >
          Your Payroll = Your Credit
        </motion.p>
      </div>
    </div>
  );
}

export default App;
