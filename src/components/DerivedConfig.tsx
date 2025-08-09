import * as React from 'react'
import { FieldSchema } from '../types'
import { Box, FormControlLabel, Switch, TextField, Typography, Stack, MenuItem, Chip } from '@mui/material'

interface Props {
  field: FieldSchema;
  allFields: FieldSchema[];
  onChange: (patch: Partial<FieldSchema>) => void;
}

export default function DerivedConfig({ field, allFields, onChange }: Props) {
  const nonSelfFields = allFields.filter(f => f.id !== field.id);
  return (
    <Box sx={{ borderTop: '1px dashed #ccc', mt:2, pt:2 }}>
      <FormControlLabel
        control={<Switch checked={!!field.derived} onChange={(_,c)=>onChange({ derived: c, derivedConfig: c ? (field.derivedConfig ?? { parentIds: [], formula: '' }) : null })} />}
        label="Derived field"
      />

      {field.derived && field.derivedConfig && (
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField
            select
            label="Parent fields"
            SelectProps={{ multiple: true, renderValue: (selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => {
                  const f = nonSelfFields.find(ff=>ff.id===value);
                  return <Chip key={value} label={f?.label ?? value} />
                })}
              </Box>
            ) }}
            value={field.derivedConfig.parentIds}
            onChange={(e)=>onChange({ derivedConfig: { ...field.derivedConfig!, parentIds: e.target.value as string[] } })}
          >
            {nonSelfFields.map(f => (
              <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>
            ))}
          </TextField>
          <Typography variant="body2">
            Use parent IDs or labels (spaces become _ ) as variables in the formula. Example:<br/>
            <code>(Date.now() - new Date(dob).getTime()) / (365.25*24*3600*1000)</code>
          </Typography>
          <TextField
            label="Formula (JS expression)"
            value={field.derivedConfig.formula}
            onChange={(e)=>onChange({ derivedConfig: { ...field.derivedConfig!, formula: e.target.value } })}
            multiline minRows={2}
          />
        </Stack>
      )}
    </Box>
  )
}