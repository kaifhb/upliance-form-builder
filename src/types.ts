export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean; // min 8 + number
}

export interface DerivedConfig {
  parentIds: string[];
  formula: string; // uses parent labels/ids as variables
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  validations?: ValidationRules;
  options?: FieldOption[];              // for select/radio/checkbox
  derived?: boolean;
  derivedConfig?: DerivedConfig | null; // if derived === true
}

export interface FormSchema {
  id: string;
  name?: string;
  createdAt?: string;
  fields: FieldSchema[];
}