// Manual imports for templates
import GeneralMedicalTemplate from './Template1';
import EmergencyTemplate from './Template2';
import PediatricTemplate from './Template3';

// Define template components with metadata
export const TEMPLATE_COMPONENTS = {
  'template1': {
    component: GeneralMedicalTemplate,
    title: 'General Medical Form',
    description: 'Standard medical examination template',
    type: 'general'
  },
  'template2': {
    component: EmergencyTemplate,
    title: 'Emergency Assessment',
    description: 'Critical care and emergency evaluation form',
    type: 'emergency'
  },
  'template3': {
    component: PediatricTemplate,
    title: 'Pediatric Assessment',
    description: 'Child health examination form',
    type: 'pediatric'
  }
};

// Helper function to get template component
export function getTemplateComponent(templateCode) {
  return TEMPLATE_COMPONENTS[templateCode]?.component || null;
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