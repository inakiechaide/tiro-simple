// src/views/AdminView.jsx
import React from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import Header from '../components/Header';
import SocioForm from '../components/SocioForm';
import { useSocios } from '../hooks/useSocios';

const AdminView = ({ onLogout }) => {
  const {
    socios,
    loading,
    editingUser,
    showForm,
    formData,
    setFormData,
    setShowForm,
    saveSocio,
    deleteSocio,
    editSocio,
    resetForm,

    // 🔍 agregados
    search,
    setSearch
  } = useSocios();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="Panel de Administración"
        subtitle="Gestión de Socios"
        icon={Users}
        showLogout={true}
        onLogout={onLogout}
      />

      <div className="max-w-6xl mx-auto p-4">

        {/* Botón Nuevo Socio */}
        <div className="mb-4 flex justify-between items-center">

          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Socio</span>
          </button>

          {/* 🔍 Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por DNI, nombre, apellido, número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Formulario */}
        {showForm && (
          <SocioForm
            formData={formData}
            editingUser={editingUser}
            loading={loading}
            onSave={saveSocio}
            onCancel={resetForm}
            onChange={setFormData}
          />
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-900 text-white font-bold">
            Lista de Socios ({socios.length})
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              Cargando...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Socio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {socios.map((socio) => (
                    <tr key={socio.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">{socio.dni}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{socio.getNombreCompleto()}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{socio.numeroSocio}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{socio.getFechaFormateada()}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          socio.isVigente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {socio.getEstado()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm space-x-2">
                        <button
                          onClick={() => editSocio(socio)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteSocio(socio.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
