export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "password";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
}

export interface DerivedFieldConfig {
  parents: string[];
  formula: string;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: string | number | boolean | string[];
  options?: string[];
  validations?: ValidationRule;
  derived?: DerivedFieldConfig;
  isEmail?: boolean;
  isPassword?: boolean;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: Field[];
}
