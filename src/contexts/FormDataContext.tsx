import React, { createContext, useContext, useState, ReactNode } from 'react';
import { filledFormsService } from '../aws/api/filledForms';

interface FormData {
  templateCode: string;
  data: {
    patientInfo: {
      fullName: string;
      age: string | number;
      gender: string;
    };
    vitalSigns: {
      temperature: string;
      bloodPressure: string;
      heartRate: string | number;
    };
  };
}

interface FilledForm extends FormData {
  formId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataContextType {
  forms: FilledForm[];
  loading: boolean;
  error: string | null;
  getForms: () => Promise<void>;
  saveForm: (formData: FormData) => Promise<FilledForm>;
  clearError: () => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FilledForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getForms = async () => {
    try {
      setLoading(true);
      const response = await filledFormsService.getFilledForms();
      console.log('Received forms data:', JSON.stringify(response, null, 2));
      setForms(response);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async (formData: FormData): Promise<FilledForm> => {
    try {
      setLoading(true);
      const response = await filledFormsService.createFilledForm(formData);
      setForms(prevForms => [...prevForms, response]);
      return response;
    } catch (err) {
      console.error('Error saving form:', err);
      setError(err instanceof Error ? err.message : 'Failed to save form');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <FormDataContext.Provider value={{
      forms,
      loading,
      error,
      getForms,
      saveForm,
      clearError
    }}>
      {children}
    </FormDataContext.Provider>
  );
}

export const useFormDataContext = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormDataContext must be used within a FormDataProvider');
  }
  return context;
}; 