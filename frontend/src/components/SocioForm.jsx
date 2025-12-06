// src/components/SocioForm.jsx
import React from 'react';
import { Save } from 'lucide-react';
import { CATEGORIAS } from '../utils/constants';

/**
 * Componente formulario de socio
 */
const SocioForm = ({ formData, editingUser, loading, onSave, onCancel, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingUser ? 'Editar Socio' : 'Nuevo Socio'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNI (sin puntos) {!editingUser && <span className="text-red-600">*</span>}
          </label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => onChange({...formData, dni: e.target.value.replace(/\D/g, '')})}
            className="w-full px-4 py-2 border rounded-lg"
            maxLength="8"
            disabled={!!editingUser}
            required={!editingUser}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Socio <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.numeroSocio}
            onChange={(e) => onChange({...formData, numeroSocio: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => onChange({...formData, nombre: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => onChange({...formData, apellido: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Vencimiento <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.fechaVencimiento}
            onChange={(e) => onChange({...formData, fechaVencimiento: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            value={formData.categoria}
            onChange={(e) => onChange({...formData, categoria: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={CATEGORIAS.TITULAR}>{CATEGORIAS.TITULAR}</option>
            <option value={CATEGORIAS.ADHERENTE}>{CATEGORIAS.ADHERENTE}</option>
            <option value={CATEGORIAS.VITALICIO}>{CATEGORIAS.VITALICIO}</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña {!editingUser ? <span className="text-red-600">*</span> : '(dejar vacío para no cambiar)'}
          </label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => onChange({...formData, password: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={editingUser ? "Dejar vacío para mantener la actual" : "Mínimo 4 caracteres"}
            required={!editingUser}
          />
          <p className="text-xs text-gray-500 mt-1">
            {!editingUser ? 'La contraseña es obligatoria para nuevos socios (mínimo 4 caracteres)' : 'Solo completar si deseas cambiar la contraseña'}
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center space-x-2 disabled:bg-gray-400"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Guardando...' : 'Guardar'}</span>
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SocioForm;