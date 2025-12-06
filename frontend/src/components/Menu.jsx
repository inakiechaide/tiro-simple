// src/components/Menu.jsx
import React from 'react';
import { QrCode, LogOut } from 'lucide-react';

/**
 * Componente Menu desplegable
 */
const Menu = ({ onScannerClick, onLogout }) => {
  return (
    <div className="bg-white shadow-lg border-b">
      <div className="max-w-4xl mx-auto py-2">
        <button
          onClick={onScannerClick}
          className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-3"
        >
          <QrCode className="w-5 h-5" />
          <span>Verificar Carnet</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-3 text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;