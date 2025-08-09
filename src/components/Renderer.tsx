import * as React from 'react'
import { FieldSchema } from '../types'
import { TextField, MenuItem, FormControlLabel, Checkbox, RadioGroup, Radio, FormGroup, FormLabel, Stack } from '@mui/material'
import { computeDerivedValue } from '../utils/derived'
import { validateField } from '../utils/validation'

interface Props {
  fields: FieldSchema[];
  values: Record<string, any>;
  setValues: (patch: Record<string, any>) => void;
  errors: Record<string, string>;
  setErrors: (patch: Record<string, string>) => void;
}

export default function Renderer({ fields, values, setValues, errors, setErrors }: Props) {
  React.useEffect(()=>{
    // recompute derived on value changes
    const patch: Record<string, any> = {};
    for (const f of fields) {
      if (f.derived) {
        patch[f.id] = computeDerivedValue(f, { ...values, ...patch }, fields);
      }
    }
    if (Object.keys(patch).length) {
      setValues(patch);
    }
  }, [values, fields, setValues]);

  const updateValue = (f: FieldSchema, v: any) => {
    setValues({ [f.id]: v });
    const err = validateField(f, v);
    setErrors({ [f.id]: err ?? '' });
  }

  return (
    <Stack spacing={2}>
      {fields.map(f => {
        const value = values[f.id] ?? f.defaultValue ?? (f.type==='checkbox' ? [] : '');
        const error = errors[f.id] || '';
        const common = {
          key: f.id,
          label: f.label + (f.required ? ' *' : ''),
          helperText: error || ' ',
          error: !!error,
          disabled: f.derived
        };

        if (f.type === 'text' || f.type === 'number' || f.type === 'date') {
          return (
            <TextField
              {...common}
              type={f.type === 'number' ? 'number' : (f.type === 'date' ? 'date' : 'text')}
              value={value ?? ''}
              onChange={e => updateValue(f, e.target.value)}
              InputLabelProps={f.type==='date' ? { shrink: true } : undefined}
              fullWidth
            />
          )
        }
        if (f.type === 'textarea') {
          return (
            <TextField
              {...common}
              value={value ?? ''}
              onChange={e => updateValue(f, e.target.value)}
              multiline minRows={3}
              fullWidth
            />
          )
        }
        if (f.type === 'select') {
          return (
            <TextField {...common} select value={value ?? ''} onChange={e=>updateValue(f, e.target.value)} fullWidth>
              {(f.options||[]).map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )
        }
        if (f.type === 'radio') {
          return (
            <div key={f.id}>
              <FormLabel>{common.label}</FormLabel>
              <RadioGroup value={value ?? ''} onChange={(_,val)=>updateValue(f, val)}>
                {(f.options||[]).map(opt => (
                  <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} disabled={f.derived} />
                ))}
              </RadioGroup>
            </div>
          )
        }
        if (f.type === 'checkbox') {
          const arr: string[] = Array.isArray(value) ? value : [];
          const toggle = (val: string) => {
            const next = arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val];
            updateValue(f, next);
          }
          return (
            <div key={f.id}>
              <FormLabel>{common.label}</FormLabel>
              <FormGroup>
                {(f.options||[]).map(opt => (
                  <FormControlLabel key={opt.value} control={<Checkbox checked={arr.includes(opt.value)} onChange={()=>toggle(opt.value)} />} label={opt.label} disabled={f.derived} />
                ))}
              </FormGroup>
            </div>
          )
        }
        return null;
      })}
    </Stack>
  )
}