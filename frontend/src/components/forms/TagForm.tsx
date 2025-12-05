import React, { useState, useEffect } from 'react'
import { TextField, Box } from '@mui/material'
import BaseForm from './BaseForm'
import type { Tag } from '../../types/tag'

interface TagFormProps {
  open: boolean
  tag?: Tag | null
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

const TagForm: React.FC<TagFormProps> = ({ open, tag, onClose, onSubmit }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (tag) {
      setName(tag.name)
    } else {
      setName('')
    }
    setError('')
  }, [tag, open])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onSubmit(name.trim())
      setName('')
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
      setError('')
      onClose()
    }
  }

  return (
    <BaseForm open={open} label='Tag' isEdit={!!tag} onClose={handleClose} onSubmit={handleSubmit} loading={loading} disabled={!name.trim()}>
      <Box sx={{ pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          error={!!error}
          helperText={error}
          disabled={loading}
        />
      </Box>
    </BaseForm>
  )
}

export default TagForm

