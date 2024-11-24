import { API_CONFIG } from '../config/aws-config';
import { auth } from '../../configs/FirebaseConfig';

export const templateService = {
  async getTemplates() {
    try {
      const token = await auth.currentUser?.getIdToken();
      console.log('Firebase Token:', token);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.GET}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch templates: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('Templates Data:', data);
      return data;
    } catch (error) {
      console.error('Template Service Error:', error);
      throw error;
    }
  },

  async createTemplate(template) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(template)
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  },

  async updateTemplate(templateId, template) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.UPDATE}`.replace('{templateId}', templateId), 
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      }
    );
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  },

  async deleteTemplate(templateId) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLATES.DELETE}`.replace('{templateId}', templateId),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to delete template');
    return response.json();
  }
};