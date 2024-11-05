import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [savedForms, setSavedForms] = useState([]);

  const saveForm = (newForm) => {
    setSavedForms((prevForms) => [...prevForms, newForm]);
  };

  const deleteForm = (formId) => {
    setSavedForms((prevForms) => prevForms.filter(form => form.id !== formId));
  };

  return (
    <FormContext.Provider value={{ savedForms, saveForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 