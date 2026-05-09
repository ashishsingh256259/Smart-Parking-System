import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, BarChart3, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2 rounded-lg bg-[rgba(0,243,255,0.1)] group-hover:bg-[rgba(0,243,255,0.2)] transition-colors">
          <Car className="text-[var(--color-neon-blue)]" size={24} />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">
          AI<span className="text-gradient">PARK</span>
        </span>
      </Link>

      <div className="flex gap-6 items-center">
        <Link 
          to="/" 
          className={`text-sm font-medium transition-colors hover:text-[var(--color-neon-blue)] ${isActive('/') ? 'text-[var(--color-neon-blue)]' : 'text-gray-300'}`}
        >
          Home
        </Link>
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--color-neon-blue)] ${isActive('/dashboard') ? 'text-[var(--color-neon-blue)]' : 'text-gray-300'}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link 
          to="/admin" 
          className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--color-neon-blue)] ${isActive('/admin') ? 'text-[var(--color-neon-blue)]' : 'text-gray-300'}`}
        >
          <BarChart3 size={16} />
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
