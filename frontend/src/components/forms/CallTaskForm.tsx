import React, { useState, useEffect } from 'react'
import { TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import BaseForm from './BaseForm'
import type { CallTask } from '../../types/task'
import type { TaskStatus } from '../../types/task'

interface CallTaskFormProps {
  open: boolean
  task?: CallTask | null
  onClose: () => void
  onSubmit: (name: string, status: TaskStatus) => Promise<void>
}

const CallTaskForm: React.FC<CallTaskFormProps> = ({
  open,
  task,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<TaskStatus>('open')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setName(task.name)
      setStatus(task.status)
    } else {
      setName('')
      setStatus('open')
    }
    setError('')
  }, [task, open])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onSubmit(name.trim(), status)
      setName('')
      setStatus('open')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setStatus('open')
      setError('')
      onClose()
    }
  }

  return (
    <BaseForm
      open={open}
      label='Call Task'
      isEdit={!!task}
      onClose={handleClose}
      onSubmit={handleSubmit}
      loading={loading}
      disabled={!name.trim()}
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          autoFocus
          fullWidth
          label='Name'
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          error={!!error && !name.trim()}
          helperText={error && !name.trim() ? error : ''}
          disabled={loading}
        />
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label='Status'
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <MenuItem value='open'>Open</MenuItem>
            <MenuItem value='in_progress'>In Progress</MenuItem>
            <MenuItem value='completed'>Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </BaseForm>
  )
}

export default CallTaskForm

