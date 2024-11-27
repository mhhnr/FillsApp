import React, { createContext, useContext, useState } from 'react';
import { templateService } from '../aws/api/templates';
import { filledFormsService } from '../aws/api/filledForms';

const FormDataContext = createContext(null);

export const useFormDataContext = () => {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error('useFormDataContext must be used within a FormDataProvider');
    }
    return context;
};

export function FormDataProvider({ children }) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Save filled form with template-specific validation
    const saveForm = async (templateCode, formData) => {
        setLoading(true);
        try {
            // Validate required fields based on template type
            const missingFields = validateFormData(templateCode, formData);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            const response = await filledFormsService.createFilledForm({
                templateCode,
                data: {
                    ...formData,
                    createdAt: new Date().toISOString()
                }
            });
            
            setForms(prevForms => [...prevForms, response]);
            return response;
        } catch (err) {
            console.error('Save form error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Validate required fields based on template type
    const validateFormData = (templateCode, data) => {
        const requiredFields = {
            general: ['fullName', 'age', 'gender'],
            emergency: ['triageLevel', 'arrivalTime'],
            pediatric: ['childName', 'age', 'dateOfBirth'],
            opd: ['umrNo', 'patientName']
        };

        const fields = requiredFields[templateCode] || [];
        return fields.filter(field => !data[field]);
    };

    // Get all forms with template info
    const getForms = async () => {
        setLoading(true);
        try {
            const response = await filledFormsService.getFilledForms();
            setForms(response);
            return response;
        } catch (err) {
            console.error('Get forms error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update existing form
    const updateForm = async (formId, formData) => {
        setLoading(true);
        try {
            const response = await filledFormsService.updateFilledForm(formId, {
                data: {
                    ...formData,
                    updatedAt: new Date().toISOString()
                }
            });
            setForms(prevForms => 
                prevForms.map(form => form.formId === formId ? response : form)
            );
            return response;
        } catch (err) {
            console.error('Update form error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete form
    const deleteForm = async (formId) => {
        setLoading(true);
        try {
            await filledFormsService.deleteFilledForm(formId);
            setForms(prevForms => prevForms.filter(form => form.formId !== formId));
        } catch (err) {
            console.error('Delete form error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormDataContext.Provider value={{
            forms,
            loading,
            error,
            saveForm,
            getForms,
            updateForm,
            deleteForm,
            clearError: () => setError(null)
        }}>
            {children}
        </FormDataContext.Provider>
    );
} 