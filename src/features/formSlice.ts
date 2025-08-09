import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormSchema, FieldSchema } from '../types'
import { v4 as uuid } from 'uuid'
import { loadDraft, saveDraft, saveForm } from '../services/storage'

const initialDraft: FormSchema = loadDraft() ?? {
  id: uuid(),
  name: undefined,
  createdAt: undefined,
  fields: []
};

interface ReorderPayload { from: number; to: number; }

const formSlice = createSlice({
  name: 'form',
  initialState: {
    current: initialDraft
  } as { current: FormSchema },
  reducers: {
    resetDraft(state) {
      state.current = { id: uuid(), fields: [] }
      saveDraft(state.current)
    },
    setFormName(state, action: PayloadAction<string>) {
      state.current.name = action.payload;
      saveDraft(state.current)
    },
    addField(state, action: PayloadAction<Partial<FieldSchema>>) {
      const f: FieldSchema = {
        id: uuid(),
        type: action.payload.type || 'text',
        label: action.payload.label || 'Untitled',
        required: !!action.payload.required,
        defaultValue: action.payload.defaultValue ?? '',
        validations: action.payload.validations ?? {},
        options: action.payload.options ?? [],
        derived: action.payload.derived ?? false,
        derivedConfig: action.payload.derivedConfig ?? null
      }
      state.current.fields.push(f)
      saveDraft(state.current)
    },
    updateField(state, action: PayloadAction<{ id: string, patch: Partial<FieldSchema> }>) {
      const idx = state.current.fields.findIndex(f => f.id === action.payload.id);
      if (idx >= 0) {
        state.current.fields[idx] = { ...state.current.fields[idx], ...action.payload.patch }
        saveDraft(state.current)
      }
    },
    deleteField(state, action: PayloadAction<string>) {
      state.current.fields = state.current.fields.filter(f => f.id !== action.payload);
      saveDraft(state.current)
    },
    reorderFields(state, action: PayloadAction<ReorderPayload>) {
      const { from, to } = action.payload;
      const arr = state.current.fields;
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return;
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      saveDraft(state.current)
    },
    saveCurrentForm(state, action: PayloadAction<string>) {
      state.current.name = action.payload;
      if (!state.current.createdAt) state.current.createdAt = new Date().toISOString();
      saveForm(state.current);
    }
  }
})

export const { resetDraft, setFormName, addField, updateField, deleteField, reorderFields, saveCurrentForm } = formSlice.actions
export default formSlice.reducer