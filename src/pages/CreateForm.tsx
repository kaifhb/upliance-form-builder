
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { addField, updateField, deleteField, reorderFields, saveCurrentForm, setFormName, resetDraft } from '../features/formSlice'
import FieldList from '../components/FieldList'
import { Button, Stack, TextField, Typography } from '@mui/material'

export default function CreateForm() {
  const dispatch = useDispatch()
  const form = useSelector((s: RootState) => s.form.current)

  const onAddField = () => {
    dispatch(addField({ type: 'text', label: 'New Field' }))
  }

  const onSave = () => {
    const name = form.name || prompt('Enter form name') || undefined
    if (name) {
      dispatch(setFormName(name))
      dispatch(saveCurrentForm(name))
      alert('Form saved to localStorage')
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Form Builder</Typography>
      <Stack direction="row" spacing={2}>
        <TextField label="Form Name" value={form.name ?? ''} onChange={e=>dispatch(setFormName(e.target.value))} sx={{ flex:1 }} />
        <Button variant="contained" onClick={onSave}>Save</Button>
        <Button onClick={()=>dispatch(resetDraft())}>New Draft</Button>
      </Stack>
      <Button variant="outlined" onClick={onAddField}>Add Field</Button>
      <FieldList
        fields={form.fields}
        onUpdate={(id, patch)=>dispatch(updateField({ id, patch }))}
        onDelete={(id)=>dispatch(deleteField(id))}
        onReorder={(from,to)=>dispatch(reorderFields({ from, to }))}
      />
    </Stack>
  )
}