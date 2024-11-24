export interface Template {
    templateId: string;
    userId: string;
    title: string;
    description?: string;
    fields: Field[];
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface FilledForm {
    formId: string;
    userId: string;
    templateId: string;
    responses: FormResponse[];
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface Field {
    id: string;
    type: 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'date' | 'time' | 'scale';
    question: string;
    required: boolean;
    options?: string[];
    scaleStart?: number;
    scaleEnd?: number;
    lowLabel?: string;
    highLabel?: string;
  }
  
  export interface FormResponse {
    fieldId: string;
    value: string | string[] | number;
  }