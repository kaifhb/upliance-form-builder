import * as React from 'react'
import { FieldSchema, FieldType, FieldOption } from '../types'
import { Box, TextField, FormControlLabel, Switch, MenuItem, Stack, Button, Typography } from '@mui/material'

const fieldTypes: { value: FieldType, label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
]

interface Props {
  field: FieldSchema;
  onChange: (patch: Partial<FieldSchema>) => void;
  onDelete: () => void;
}

export default function FieldEditor({ field, onChange, onDelete }: Props) {
  const updateOption = (i: number, patch: Partial<FieldOption>) => {
    const options = [...(field.options || [])];
    options[i] = { ...options[i], ...patch };
    onChange({ options });
  }
  const addOption = () => {
    onChange({ options: [...(field.options || []), { value: '', label: '' }] })
  }
  const removeOption = (i: number) => {
    const options = [...(field.options || [])];
    options.splice(i, 1);
    onChange({ options });
  }

  return (
    <Box sx={{ border: '1px solid #ddd', p:2, borderRadius: 2, mb:2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Type"
            value={field.type}
            onChange={e=>onChange({ type: e.target.value as FieldType })}
            sx={{ width: 200 }}
          >
            {fieldTypes.map(ft => <MenuItem key={ft.value} value={ft.value}>{ft.label}</MenuItem>)}
          </TextField>
          <TextField
            label="Label"
            value={field.label}
            onChange={e=>onChange({ label: e.target.value })}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Default Value"
            value={field.defaultValue ?? ''}
            onChange={e=>onChange({ defaultValue: e.target.value })}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControlLabel control={
            <Switch checked={!!field.required} onChange={(_,c)=>onChange({ required: c })} />
          } label="Required" />
          <FormControlLabel control={
            <Switch checked={!!field.validations?.email} onChange={(_,c)=>onChange({ validations: { ...field.validations, email: c } })} />
          } label="Email format" />
          <FormControlLabel control={
            <Switch checked={!!field.validations?.passwordRule} onChange={(_,c)=>onChange({ validations: { ...field.validations, passwordRule: c } })} />
          } label="Password rule" />
          <TextField
            type="number"
            label="Min Length"
            value={field.validations?.minLength ?? ''}
            onChange={e=>onChange({ validations: { ...field.validations, minLength: e.target.value ? Number(e.target.value) : undefined } })}
            sx={{ width: 160 }}
          />
          <TextField
            type="number"
            label="Max Length"
            value={field.validations?.maxLength ?? ''}
            onChange={e=>onChange({ validations: { ...field.validations, maxLength: e.target.value ? Number(e.target.value) : undefined } })}
            sx={{ width: 160 }}
          />
        </Stack>

        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb:1 }}>Options</Typography>
            <Stack spacing={1}>
              {(field.options||[]).map((opt, i)=>(
                <Stack key={i} direction="row" spacing={1}>
                  <TextField label="Label" value={opt.label} onChange={e=>updateOption(i, { label: e.target.value })} sx={{ flex:1 }} />
                  <TextField label="Value" value={opt.value} onChange={e=>updateOption(i, { value: e.target.value })} sx={{ flex:1 }} />
                  <Button onClick={()=>removeOption(i)}>Remove</Button>
                </Stack>
              ))}
              <Button variant="outlined" onClick={addOption}>Add option</Button>
            </Stack>
          </Box>
        )}

        <Stack direction="row" justifyContent="flex-end">
          <Button color="error" onClick={onDelete}>Delete Field</Button>
        </Stack>
      </Stack>
    </Box>
  )
}