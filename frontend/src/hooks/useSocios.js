// src/hooks/useSocios.js
import { useState, useEffect } from 'react';
import SocioController from '../controllers/SocioController';
import { CATEGORIAS } from '../utils/constants';

/**
 * Hook personalizado para gestión de socios
 */
export const useSocios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(getEmptyForm());

  // 🔍 Nuevo: estado de búsqueda
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSocios(search);
  }, [search]); // 🔍 Se actualiza la lista cuando cambia el texto

  function getEmptyForm() {
    return {
      dni: '',
      nombre: '',
      apellido: '',
      numeroSocio: '',
      fechaVencimiento: '',
      categoria: CATEGORIAS.TITULAR,
      password: '1234'
    };
  }

  const loadSocios = async (searchTerm = "") => {
    setLoading(true);
    try {
      const result = await SocioController.loadAllSocios(searchTerm);
      if (result.success) {
        setSocios(result.data);
      }
    } catch (error) {
      console.error('Error loading socios:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSocio = async () => {
    setLoading(true);
    try {
      const result = editingUser
        ? await SocioController.updateSocio(editingUser, formData)
        : await SocioController.createSocio(formData);

      if (result.success) {
        alert(result.mensaje || 'Operación exitosa');
        resetForm();
        await loadSocios(search);
      } else {
        alert(result.error || 'Error en la operación');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSocio = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este socio?')) return;

    setLoading(true);
    try {
      const result = await SocioController.deleteSocio(id);
      if (result.success) {
        alert('Socio eliminado correctamente');
        await loadSocios(search);
      } else {
        alert('Error al eliminar el socio');
      }
    } finally {
      setLoading(false);
    }
  };

  const editSocio = (socio) => {
    setFormData({
      dni: socio.dni,
      nombre: socio.nombre,
      apellido: socio.apellido,
      numeroSocio: socio.numeroSocio,
      fechaVencimiento: socio.fechaVencimiento,
      categoria: socio.categoria,
      password: ''
    });
    setEditingUser(socio.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(getEmptyForm());
    setEditingUser(null);
    setShowForm(false);
  };

  return {
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

    // 🔍 Nuevo: exportamos búsqueda
    search,
    setSearch
  };
};
