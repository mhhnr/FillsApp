import { API_CONFIG } from '../config/aws-config';
import { auth } from '../../configs/FirebaseConfig';
import { TEMPLATE_COMPONENTS } from '../../components/templates';

export const filledFormsService = {
  async getFilledForms() {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      console.log('[FilledFormsService] Getting forms...');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.GET}`;
      console.log('[FilledFormsService] Request URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[FilledFormsService] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[FilledFormsService] Error response:', errorText);
        throw new Error(`Failed to fetch forms: ${response.status}`);
      }
      
      const forms = await response.json();
      console.log('[FilledFormsService] Received forms:', forms);
      return forms;
    } catch (error) {
      console.error('[FilledFormsService] Error:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication expired. Please login again.');
      }
      throw error;
    }
  },

  async createFilledForm(formData) {
    try {
      const token = await auth.currentUser?.getIdToken();
      console.log('[FilledFormsService] Creating form with data:', formData);
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.CREATE}`;
      console.log('[FilledFormsService] Request URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('[FilledFormsService] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[FilledFormsService] Error response:', errorText);
        throw new Error(`Failed to create form: ${response.status}`);
      }

      const result = await response.json();
      console.log('[FilledFormsService] Created form result:', result);
      return result;
    } catch (error) {
      console.error('[FilledFormsService] Create form error:', error);
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
    try {
      const token = await auth.currentUser?.getIdToken();
      console.log('[FilledFormsService] Deleting form:', formId);
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILLED_FORMS.DELETE.replace('{formId}', formId)}`;
      console.log('[FilledFormsService] Delete URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[FilledFormsService] Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[FilledFormsService] Delete error response:', errorText);
        throw new Error(`Failed to delete form: ${response.status}`);
      }

      return true; // Successfully deleted
    } catch (error) {
      console.error('[FilledFormsService] Delete form error:', error);
      throw error;
    }
  }
};

const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        throw new Error('Please login again');
      case 403:
        throw new Error('You do not have permission to perform this action');
      case 404:
        throw new Error('The requested resource was not found');
      default:
        throw new Error(error.response.data?.message || defaultMessage);
    }
  }
  throw error;
};