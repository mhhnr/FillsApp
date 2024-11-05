import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormContext = createContext();
const STORAGE_KEY = '@form_builder_forms';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_FORMS':
      return action.payload;
    case 'ADD_FORM':
      return [...state, action.payload];
    case 'DELETE_FORM':
      return state.filter(form => form.id !== action.payload);
    default:
      return state;
  }
};

export function FormProvider({ children }) {
  const [forms, dispatch] = useReducer(formReducer, []);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const savedForms = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedForms) {
          dispatch({ type: 'INIT_FORMS', payload: JSON.parse(savedForms) });
        }
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    };
    loadForms();
  }, []);

  useEffect(() => {
    const saveForms = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      } catch (error) {
        console.error('Error saving forms:', error);
      }
    };
    saveForms();
  }, [forms]);

  const saveForm = async (form) => {
    dispatch({ type: 'ADD_FORM', payload: form });
  };

  const deleteForm = async (formId) => {
    dispatch({ type: 'DELETE_FORM', payload: formId });
  };

  return (
    <FormContext.Provider value={{ forms, saveForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext); 