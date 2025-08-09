
import { FieldSchema } from '../types'
import FieldEditor from './FieldEditor'
import DerivedConfig from './DerivedConfig'
import { IconButton, Stack, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

interface Props {
  fields: FieldSchema[];
  onUpdate: (id: string, patch: Partial<FieldSchema>) => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export default function FieldList({ fields, onUpdate, onDelete, onReorder }: Props) {
  return (
    <Stack>
      {fields.map((f, idx) => (
        <div key={f.id}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb:1 }}>
            <Typography variant="subtitle1" sx={{ flex:1 }}>{idx+1}. {f.label}</Typography>
            <IconButton disabled={idx===0} onClick={()=>onReorder(idx, idx-1)}><ArrowUpwardIcon /></IconButton>
            <IconButton disabled={idx===fields.length-1} onClick={()=>onReorder(idx, idx+1)}><ArrowDownwardIcon /></IconButton>
          </Stack>
          <FieldEditor field={f} onChange={(patch)=>onUpdate(f.id, patch)} onDelete={()=>onDelete(f.id)} />
          <DerivedConfig field={f} allFields={fields} onChange={(patch)=>onUpdate(f.id, patch)} />
        </div>
      ))}
    </Stack>
  )
}