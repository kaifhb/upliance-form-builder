import * as React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import Renderer from '../components/Renderer'
import { useParams } from 'react-router-dom'
import { getFormById } from '../services/storage'
import { Box, Button, Stack, Typography } from '@mui/material'
import { validateAll } from '../utils/validation'

export default function PreviewForm() {
  const { id } = useParams();
  const draft = useSelector((s: RootState)=>s.form.current);
  const form = id ? (getFormById(id) ?? draft) : draft;

  const [values, setValuesState] = React.useState<Record<string, any>>({});
  const [errors, setErrorsState] = React.useState<Record<string, string>>({});

  const setValues = (patch: Record<string, any>) => setValuesState(v => ({ ...v, ...patch }));
  const setErrors = (patch: Record<string, string>) => setErrorsState(e => ({ ...e, ...patch }));

  const onSubmit = () => {
    const errs = validateAll(form.fields, values);
    setErrorsState(errs);
    if (Object.keys(errs).length === 0) {
      alert('Valid form! Values:\n' + JSON.stringify(values, null, 2));
    } else {
      alert('Please fix errors');
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Preview: {form.name ?? 'Draft'}</Typography>
      <Renderer fields={form.fields} values={values} setValues={setValues} errors={errors} setErrors={setErrors} />
      <Box>
        <Button variant="contained" onClick={onSubmit}>Submit</Button>
      </Box>
    </Stack>
  )
}