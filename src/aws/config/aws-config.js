import { AWS_API_BASE_URL, AWS_REGION } from '@env';


// AWS API Gateway endpoint
export const API_CONFIG = {
    BASE_URL: AWS_API_BASE_URL,
    REGION: AWS_REGION,
    ENDPOINTS: {
      TEMPLATES: {
        GET: '/templates',
        CREATE: '/templates',
        UPDATE: '/templates/{templateId}',
        DELETE: '/templates/{templateId}'
      },
      FILLED_FORMS: {
        GET: '/forms',
        CREATE: '/forms',
        UPDATE: '/forms/{formId}',
        DELETE: '/forms/{formId}'
      }
    }
  };