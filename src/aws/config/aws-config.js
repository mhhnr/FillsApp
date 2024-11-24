// AWS API Gateway endpoint
export const API_CONFIG = {
    BASE_URL: 'https://2zt8mwfww5.execute-api.us-east-1.amazonaws.com',
    REGION: 'us-east-1',
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