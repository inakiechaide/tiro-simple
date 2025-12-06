// src/views/ScannerView.jsx
import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import ScanResult from '../components/ScanResult';
import SocioController from '../controllers/SocioController';
import { VIEWS } from '../utils/constants';

/**
 * Vista del escáner de carnets
 */
const ScannerView = ({ onNavigate }) => {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!scanInput.trim()) return;

    setLoading(true);
    try {
      const result = await SocioController.verificarCarnet(scanInput.trim());
      
      if (result.success) {
        setScanResult({
          valid: result.valid,
          data: result.socio 
            ? `${result.socio.getNombreCompleto()} - Socio N° ${result.socio.numeroSocio}` 
            : result.mensaje,
          vencimiento: result.socio?.fechaVencimiento,
          timestamp: new Date().toLocaleString('es-AR')
        });
      } else {
        setScanResult({
          valid: false,
          data: 'Error al verificar',
          timestamp: new Date().toLocaleString('es-AR')
        });
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      setScanResult({
        valid: false,
        data: 'Error de conexión',
        timestamp: new Date().toLocaleString('es-AR')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setScanInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={() => onNavigate(VIEWS.ADMIN)} 
            className="flex items-center space-x-2"
          >
            <X className="w-6 h-6" />
            <span>Volver al Panel</span>
          </button>
          <h1 className="font-bold">Verificar Carnet</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="text-center mb-6">
            <Camera className="w-16 h-16 mx-auto text-blue-900 mb-3" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Verificación de Carnet
            </h2>
            <p className="text-gray-600">
              Ingresá el número de socio para verificar
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Socio
              </label>
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="001234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleScan}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </div>

        <ScanResult result={scanResult} onReset={handleReset} />
      </div>
    </div>
  );
};

export default ScannerView;