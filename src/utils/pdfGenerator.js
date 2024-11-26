import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getTemplateDetails } from '../components/templates';

const generateFormHTML = (form) => {
  const templateDetails = getTemplateDetails(form.templateId);
  const date = new Date(form.createdAt).toLocaleDateString();
  
  let formFields = '';
  for (const [key, value] of Object.entries(form.data)) {
    if (value) { // Only add non-empty fields
      formFields += `
        <div style="margin-bottom: 10px;">
          <strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
          <span>${value}</span>
        </div>
      `;
    }
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; }
          .date { color: #666; margin-top: 10px; }
          .form-content { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${templateDetails.title}</div>
          <div class="date">Date: ${date}</div>
        </div>
        <div class="form-content">
          ${formFields}
        </div>
      </body>
    </html>
  `;
};

export const generateAndSharePDF = async (form) => {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available on this platform');
    }

    // Generate HTML
    const html = generateFormHTML(form);
    
    // Create PDF file
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });
    
    // Share the PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Medical Form',
      UTI: 'com.adobe.pdf' // for iOS
    });

    return true;
  } catch (error) {
    console.error('Error generating/sharing PDF:', error);
    return false;
  }
}; 