import { FieldSchema } from '../types'

// Very small evaluator: builds a Function with variables mapped from parent field labels and ids.
// Example: if parents are 'dob', derived formula could be 'Math.floor((Date.now() - new Date(dob).getTime()) / (365.25*24*3600*1000))'
// Note: This is a simple approach suitable for the assignment; in production consider a safe expression parser.
export function computeDerivedValue(field: FieldSchema, values: Record<string, any>, fields: FieldSchema[]): any {
  if (!field.derived || !field.derivedConfig) return undefined;
  const { parentIds, formula } = field.derivedConfig;
  const scope: Record<string, any> = {};
  for (const id of parentIds) {
    const p = fields.find(f => f.id === id);
    if (!p) continue;
    const keyById = id;
    const keyByLabel = p.label.replace(/\s+/g, '_');
    scope[keyById] = values[id];
    scope[keyByLabel] = values[id];
  }
  try {
    const argNames = Object.keys(scope);
    const argValues = Object.values(scope);
    const fn = new Function(...argNames, `return (${formula});`);
    return fn(...argValues);
  } catch (e) {
    return undefined;
  }
}