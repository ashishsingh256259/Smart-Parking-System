import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const Footer = () => (
  <footer className="border-t border-gray-800 bg-black/40 backdrop-blur-lg mt-auto py-8">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[var(--color-neon-blue)] rounded-full animate-pulse shadow-[0_0_10px_var(--color-neon-blue)]"></div>
        <p className="text-sm font-bold tracking-widest text-gray-300">SMART CITY OS <span className="text-[var(--color-neon-green)] ml-2">v2.4.1</span></p>
      </div>
      <div className="text-gray-500 text-xs text-center md:text-left flex flex-col md:flex-row items-center gap-4">
        <p>© 2026 AI Enterprise Platforms. All systems nominal.</p>
        <a href="https://github.com/ashishsingh256259" target="_blank" rel="noreferrer" className="hover:text-[var(--color-neon-blue)] transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.28-3.315.72-4.02-1.515-4.02-1.515-.545-1.38-1.335-1.755-1.335-1.755-1.095-.75.09-.735.09-.735 1.2.09 1.83 1.23 1.83 1.23 1.065 1.83 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.64-.3-5.415-1.32-5.415-5.895 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.59-2.79 5.58-5.43 5.88.435.375.825 1.11.825 2.235 0 1.62-.015 2.925-.015 3.315 0 .315.225.69.84.57A12.005 12.005 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default App;
