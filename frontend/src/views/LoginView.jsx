// src/views/LoginView.jsx
import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

/**
 * Vista de Login
 */
const LoginView = ({ onLoginSocio, onLoginAdmin, loading }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = isAdminMode
      ? await onLoginAdmin(username, password)
      : await onLoginSocio(dni, password);

    if (!result.success) {
      setError(result.error);
    }
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setDni('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tiro Federal Tandil</h1>
          <p className="text-gray-600">Carnet Virtual de Socio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdminMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario Admin
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoComplete="username"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI (sin puntos)
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                placeholder="12345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="8"
                required
                autoComplete="off"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
                autoComplete={isAdminMode ? "current-password" : "off"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : (isAdminMode ? 'Acceso Admin' : 'Ingresar')}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-sm text-blue-900 hover:text-blue-700"
          >
            {isAdminMode ? '← Volver a login de socios' : 'Acceso administrador →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;