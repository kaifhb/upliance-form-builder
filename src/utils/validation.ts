import { FieldSchema } from '../types'

export function validateField(field: FieldSchema, value: any): string | null {
  const v = field.validations || {};
  if (v.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length===0))) {
    return 'This field is required';
  }
  const sval = value == null ? '' : String(value);

  if (typeof v.minLength === 'number' && sval.length < v.minLength) {
    return `Minimum length is ${v.minLength}`;
  }
  if (typeof v.maxLength === 'number' && sval.length > v.maxLength) {
    return `Maximum length is ${v.maxLength}`;
  }
  if (v.email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (sval && !re.test(sval)) return 'Invalid email format';
  }
  if (v.passwordRule) {
    if (sval.length < 8 || !/[0-9]/.test(sval)) return 'Password must be ≥8 chars and contain a number';
  }
  return null;
}

export function validateAll(fields: FieldSchema[], values: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const err = validateField(f, values[f.id]);
    if (err) errors[f.id] = err;
  }
  return errors;
}