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
    if (!response.ok) throw new Error('Failed to fetch filled forms');
    return response.json();
  },

  async createFilledForm(filledForm) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filledForm)
    });
    if (!response.ok) throw new Error('Failed to create filled form');
    return response.json();
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