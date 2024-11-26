// Manual imports for templates
import GeneralMedicalTemplate from './Template1';
import EmergencyTemplate from './Template2';
import PediatricTemplate from './Template3';
import OPDTemplate from './Template4';

// Define template components with metadata
export const TEMPLATE_COMPONENTS = {
  general: GeneralMedicalTemplate,
  emergency: EmergencyTemplate,
  pediatric: PediatricTemplate,
  opd: OPDTemplate,
};

// Helper function to get template component
export function getTemplateComponent(templateCode) {
  return TEMPLATE_COMPONENTS[templateCode] || null;
}

// Helper function to get template details
export function getTemplateDetails(templateCode) {
  const template = TEMPLATE_COMPONENTS[templateCode];
  return {
    title: template?.title || `Template ${templateCode}`,
    description: template?.description || 'Medical form template',
    type: template?.type || 'general'
  };
}

// Helper function to get template icon
export function getTemplateIcon(type) {
  const icons = {
    general: 'medical',
    emergency: 'fitness',
    pediatric: 'people',
    opd: 'document-text',
  };
  return icons[type] || 'document';
}