import { createContext, useContext, useState } from 'react';
import { filledFormsService } from '../aws/api/filledForms';

const FormDataContext = createContext();

export function FormDataProvider({ children }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getForms = async () => {
    try {
      setLoading(true);
      const response = await filledFormsService.getFilledForms();
      setForms(response);
    } catch (err) {
      console.error('Get forms error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async (formData) => {
    try {
      setLoading(true);
      const response = await filledFormsService.createFilledForm(formData);
      setForms(prevForms => [...prevForms, response]);
      return response;
    } catch (err) {
      console.error('Save form error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (formId, formData) => {
    try {
      setLoading(true);
      const response = await filledFormsService.updateFilledForm(formId, formData);
      setForms(prevForms => 
        prevForms.map(form => 
          form.formId === formId ? response : form
        )
      );
      return response;
    } catch (err) {
      console.error('Update form error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    try {
      await filledFormsService.deleteFilledForm(formId);
      setForms(prevForms => prevForms.filter(form => form.formId !== formId));
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    forms,
    loading,
    error,
    getForms,
    saveForm,
    updateForm,
    deleteForm,
    clearError
  };

  return (
    <FormDataContext.Provider value={value}>
      {children}
    </FormDataContext.Provider>
  );
}

export const useFormDataContext = () => useContext(FormDataContext); 