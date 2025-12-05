import React, { useState, useEffect } from 'react'
import { TextField, Box, Autocomplete } from '@mui/material'
import BaseForm from './BaseForm'
import type { TemplateTask } from '../../types/task'
import type { Tag } from '../../types/tag'

interface SuggestedTaskFormProps {
  open: boolean
  task?: TemplateTask | null
  tags: Tag[]
  onClose: () => void
  onSubmit: (name: string, tagIds: number[]) => Promise<void>
}

const SuggestedTaskForm: React.FC<SuggestedTaskFormProps> = ({
  open,
  task,
  tags,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setName(task.name)
      setSelectedTags(task.tags || [])
    } else {
      setName('')
      setSelectedTags([])
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
      const tagIds = selectedTags.map((tag) => tag.id)
      await onSubmit(name.trim(), tagIds)
      setName('')
      setSelectedTags([])
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
      setSelectedTags([])
      setError('')
      onClose()
    }
  }

  return (
    <BaseForm open={open} label='Suggested Task' isEdit={!!task} onClose={handleClose} onSubmit={handleSubmit} loading={loading} disabled={!name.trim()}>
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
        <Autocomplete
          multiple
          options={tags}
          getOptionLabel={(option) => option.name}
          value={selectedTags}
          onChange={(_, newValue) => {
            setSelectedTags(newValue)
          }}
          disabled={loading}
          renderInput={(params) => (
            <TextField {...params} label='Tags' placeholder='Select tags' />
          )}
          slotProps={{ chip: { size: 'small' } }}
        />
      </Box>
    </BaseForm>
  )
}

export default SuggestedTaskForm
