import React, { useState, useEffect } from 'react'
import { TextField, Box, Typography } from '@mui/material'
import BaseForm from './BaseForm'
import { TagColor, getTagColor } from '../../constants/colors'
import type { Tag } from '../../types/tag'

interface TagFormProps {
  open: boolean
  tag?: Tag | null
  onClose: () => void
  onSubmit: (name: string, colorId: number) => Promise<void>
}

const TagForm: React.FC<TagFormProps> = ({ open, tag, onClose, onSubmit }) => {
  const [name, setName] = useState('')
  const [colorId, setColorId] = useState<TagColor>(TagColor.GRAY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (tag) {
      setName(tag.name)
      setColorId(tag.color_id as TagColor)
    } else {
      setName('')
      setColorId(TagColor.GRAY)
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
      await onSubmit(name.trim(), colorId)
      setName('')
      setColorId(TagColor.GRAY)
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
      setColorId(TagColor.GRAY)
      setError('')
      onClose()
    }
  }

  return (
    <BaseForm open={open} label='Tag' isEdit={!!tag} onClose={handleClose} onSubmit={handleSubmit} loading={loading} disabled={!name.trim()}>
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        
        <Box>
          <Typography variant='body2' sx={{ mb: 1 }}>Color</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.values(TagColor)
              .filter((v): v is TagColor => typeof v === 'number')
              .map((cid) => (
                <Box
                  key={cid}
                  onClick={() => !loading && setColorId(cid)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: getTagColor(cid),
                    border: colorId === cid ? 3 : 2,
                    borderColor: colorId === cid ? 'primary.main' : 'divider',
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: loading ? 'none' : 'scale(1.1)',
                      boxShadow: loading ? 'none' : 2,
                    },
                  }}
                />
              ))}
          </Box>
        </Box>
      </Box>
    </BaseForm>
  )
}

export default TagForm

