import React, { useState, useEffect } from 'react'
import { TextField, Box, Autocomplete } from '@mui/material'
import BaseForm from './BaseForm'
import type { CallDetail } from '../../types/call'
import type { Tag } from '../../types/tag'

interface CallFormProps {
  open: boolean
  call?: CallDetail | null
  tags: Tag[]
  onClose: () => void
  onSubmit: (name: string, description: string | null, tagIds: number[]) => Promise<void>
}

const CallForm: React.FC<CallFormProps> = ({
  open,
  call,
  tags,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (call) {
      setName(call.name)
      setDescription(call.description || '')
      setSelectedTags(call.tags)
      setError('')
    } else {
      resetForm()
    }
  }, [call, open])

  const resetForm = () => {
    setName('')
    setDescription('')
    setSelectedTags([])
    setError('')
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')
    try {
      const tagIds = selectedTags.map((tag) => tag.id)
      await onSubmit(name.trim(), description.trim() || null, tagIds)
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  return (
    <BaseForm open={open} label='Call' isEdit={!!call} onClose={handleClose} onSubmit={handleSubmit} loading={loading} disabled={!name.trim()}>
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
        <TextField
          fullWidth
          label='Description'
          value={description}
          onChange={(e) => { setDescription(e.target.value) }}
          multiline
          rows={3}
          disabled={loading}
        />
        <Autocomplete
          multiple
          options={tags}
          getOptionLabel={(option) => option.name}
          value={selectedTags}
          onChange={(_, newValue) => { setSelectedTags(newValue) }}
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

export default CallForm
