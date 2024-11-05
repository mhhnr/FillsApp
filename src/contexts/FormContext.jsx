import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [savedForms, setSavedForms] = useState([]);

  const saveForm = (form) => {
    setSavedForms(prev => [...prev, form]);
  };

  const deleteForm = (formId) => {
    setSavedForms(prev => prev.filter(form => form.id !== formId));
  };

  return (
    <FormContext.Provider value={{ savedForms, saveForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext); 