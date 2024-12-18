export type TemplateCode = 'general' | 'emergency' | 'pediatric' | 'opd';

export interface Template {
    templateId: string;
    code: TemplateCode;
    title: string;
    description: string;
    type: TemplateCode;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface FilledForm {
    formId: string;
    userId: string;
    templateCode: TemplateCode;
    data: {
        [key: string]: any; // This will store all form fields
    };
    createdAt: string;
    updatedAt?: string;
}

export interface FormField {
    id: string;
    type: FormFieldType;
    question: string;
    required: boolean;
    options?: string[];
    scaleStart?: number;
    scaleEnd?: number;
    lowLabel?: string;
    highLabel?: string;
    characterLimit?: number;
}

export type FormFieldType = 
    | 'short_text' 
    | 'long_text' 
    | 'multiple_choice' 
    | 'checkbox' 
    | 'date' 
    | 'time' 
    | 'scale';

export interface FormResponse {
    fieldId: string;
    value: string | string[] | number;
}