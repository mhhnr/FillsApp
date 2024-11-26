export const getTemplateIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'emergency':
      return 'medkit-outline';
    case 'dental':
      return 'tooth-outline';
    case 'pediatric':
      return 'people-outline';
    default:
      return 'document-text-outline';
  }
}; 