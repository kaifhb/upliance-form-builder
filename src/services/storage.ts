import { FormSchema } from '../types'

const KEY = 'upliance_forms_v1';
const DRAFT_KEY = 'upliance_current_draft_v1';

export function loadForms(): FormSchema[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as FormSchema[] } catch { return [] }
}

export function saveForms(forms: FormSchema[]) {
  localStorage.setItem(KEY, JSON.stringify(forms));
}

export function saveForm(form: FormSchema) {
  const all = loadForms();
  const idx = all.findIndex(f => f.id === form.id);
  if (idx >= 0) all[idx] = form; else all.unshift(form);
  saveForms(all);
}

export function getFormById(id: string): FormSchema | undefined {
  return loadForms().find(f => f.id === id);
}

export function saveDraft(form: FormSchema) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
}

export function loadDraft(): FormSchema | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as FormSchema } catch { return null }
}