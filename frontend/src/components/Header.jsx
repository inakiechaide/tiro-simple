// src/components/Header.jsx
import React from 'react';
import { Shield, Menu, X, LogOut, Users } from 'lucide-react';

/**
 * Componente Header reutilizable
 */
const Header = ({ title, subtitle, icon: Icon = Shield, menuOpen, onMenuToggle, onLogout, showLogout = false }) => {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <Icon className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-lg">{title}</h1>
            {subtitle && <p className="text-xs text-blue-200">{subtitle}</p>}
          </div>
        </div>
        
        {showLogout ? (
          <button 
            onClick={onLogout} 
            className="flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Salir</span>
          </button>
        ) : (
          <button onClick={onMenuToggle} className="p-2">
            {menuOpen ? <X /> : <Menu />}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;