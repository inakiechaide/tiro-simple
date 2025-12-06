// src/services/SocioService.js
import ApiService from './ApiService';
import StorageService from './StorageService';
import Socio from '../models/Socio';

/**
 * Servicio para operaciones de Socios
 * Principio: Single Responsibility - Solo maneja operaciones de socios
 */
class SocioService {
  async getCarnet() {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.get('/carnet', token);
    
    if (response.ok) {
      return { success: true, data: Socio.fromApiResponse(response.data) };
    }
    
    return { success: false, error: 'Error al cargar carnet' };
  }

  async verificarSocio(numeroSocio) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.post('/verificar', { numeroSocio }, token);
    
    if (response.ok) {
      return {
        success: true,
        valid: response.data.valido,
        socio: response.data.socio ? Socio.fromApiResponse(response.data.socio) : null,
        mensaje: response.data.mensaje
      };
    }
    
    return { success: false, error: 'Error al verificar' };
  }

  async getAllSocios(search = '') {
    try {
      const token = await StorageService.getAuthToken();
      let endpoint = '/admin/socios';
      
      // Si hay un término de búsqueda, lo agregamos como query param
      if (search && search.trim() !== '') {
        endpoint += `?search=${encodeURIComponent(search.trim())}`;
      }
      
      const response = await ApiService.get(endpoint, token);
      
      if (response.ok) {
        return {
          success: true,
          data: Array.isArray(response.data) 
            ? response.data.map(s => Socio.fromApiResponse(s))
            : []
        };
      }
      
      return { 
        success: false, 
        error: response.data?.error || 'Error al cargar socios' 
      };
    } catch (error) {
      console.error('Error en getAllSocios:', error);
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  }

  async createSocio(socioData) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.post('/admin/socios', socioData, token);
    
    if (response.ok) {
      return { success: true, mensaje: response.data.mensaje };
    }
    
    return { success: false, error: response.data.error };
  }

  async updateSocio(id, socioData) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.put(`/admin/socios/${id}`, socioData, token);
    
    if (response.ok) {
      return { success: true, mensaje: response.data.mensaje };
    }
    
    return { success: false, error: response.data.error };
  }

  async deleteSocio(id) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.delete(`/admin/socios/${id}`, token);
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: 'Error al eliminar' };
  }
}

export default new SocioService();