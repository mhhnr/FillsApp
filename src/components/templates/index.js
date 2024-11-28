import Template1, { TEMPLATE_FIELDS as GeneralTemplateFields } from './Template1';

// Export template components with their fields
export const TEMPLATE_COMPONENTS = {
  'general': {
    component: Template1,
    TEMPLATE_FIELDS: GeneralTemplateFields,
    title: 'General Medical Form',
    description: 'Standard medical examination form',
    type: 'medical'
  }
};

// Helper functions
export const getTemplateComponent = (templateId) => {
  return TEMPLATE_COMPONENTS[templateId]?.component;
};

export const getTemplateDetails = (templateId) => {
  const template = TEMPLATE_COMPONENTS[templateId];
  return {
    title: template?.title || 'Unknown Template',
    description: template?.description || '',
    type: template?.type || 'general'
  };
};

export const getTemplateFields = (templateId) => {
  return TEMPLATE_COMPONENTS[templateId]?.TEMPLATE_FIELDS;
};