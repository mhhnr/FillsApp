import { API_CONFIG } from '../config/aws-config';
import { auth } from '../../configs/FirebaseConfig';

export const filledFormsService = {
  async getFilledForms() {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.GET}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch filled forms');
    }
    
    const forms = await response.json();
    return forms.map(form => ({
      ...form,
      data: form.data || {}
    }));
  },

  async createFilledForm(filledForm) {
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const formPayload = {
        templateId: filledForm.templateCode,
        data: filledForm.data.responses || filledForm.data,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create filled form: ${errorData}`);
      }

      const data = await response.json();
      return {
        ...data,
        data: formPayload.data
      };
    } catch (error) {
      console.error('Create form service error:', error);
      throw error;
    }
  },

  async updateFilledForm(formId, filledForm) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.UPDATE}`.replace('{formId}', formId),
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filledForm)
      }
    );
    if (!response.ok) throw new Error('Failed to update filled form');
    return response.json();
  },

  async deleteFilledForm(formId) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.DELETE}`.replace('{formId}', formId),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to delete filled form');
    return response.json();
  }
};