import { API_CONFIG } from '../config/aws-config';
import { auth } from '../../configs/FirebaseConfig';

export const templateService = {
  async getTemplates() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.GET}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return response.json();
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  },

  async createTemplate(template) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      return response.json();
    } catch (error) {
      console.error('Create template error:', error);
      throw error;
    }
  },

  async getTemplateFields(templateCode) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.GET}/${templateCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template fields');
      }

      return response.json();
    } catch (error) {
      console.error('Get template fields error:', error);
      throw error;
    }
  }
};