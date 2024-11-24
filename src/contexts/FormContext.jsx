import React, { createContext, useContext, useReducer, useState, useCallback } from 'react';
import { templateService } from '../aws/api/templates';
import { filledFormsService } from '../aws/api/filledForms';
import { auth } from '../configs/FirebaseConfig';
import { Alert } from 'react-native';

const FormContext = createContext();

const initialState = {
  templates: [],
  filledForms: [],
  error: null
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'SET_FILLED_FORMS':
      return { ...state, filledForms: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(false);

  const clearData = useCallback(() => {
    dispatch({ type: 'CLEAR_DATA' });
  }, []);

  const loadData = useCallback(async () => {
    if (!auth.currentUser) {
      clearData();
      return;
    }
    
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      
      const [templatesData, filledFormsData] = await Promise.all([
        templateService.getTemplates(userId),
        filledFormsService.getFilledForms(userId)
      ]);
      
      // Filter data for current user only
      const userTemplates = templatesData.filter(t => t.userId === userId);
      const userForms = filledFormsData.filter(f => f.userId === userId);
      
      dispatch({ type: 'SET_TEMPLATES', payload: userTemplates });
      dispatch({ type: 'SET_FILLED_FORMS', payload: userForms });
    } catch (err) {
      console.error('Error in loadData:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
      Alert.alert('Error', 'Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [clearData]);

  const value = {
    templates: state.templates,
    filledForms: state.filledForms,
    error: state.error,
    loading,
    loadData,
    clearData
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 