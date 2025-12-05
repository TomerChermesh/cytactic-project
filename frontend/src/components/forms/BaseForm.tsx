import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'

interface BaseFormProps {
  open: boolean
  label: string
  isEdit?: boolean
  children: React.ReactNode
  onClose: () => void
  onSubmit: () => void | Promise<void>
  loading?: boolean
  disabled?: boolean
}

const BaseForm: React.FC<BaseFormProps> = ({
  open,
  label,
  isEdit = false,
  children,
  onClose,
  onSubmit,
  loading = false,
  disabled = false,
}) => {
  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const handleSubmit = async () => {
    await onSubmit()
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose()
        }
      }}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? `Edit ${label}` : `Create ${label}`}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || disabled}
          sx={{
            backgroundColor: 'success.main',
            '&:hover': {
              backgroundColor: 'success.dark',
            },
          }}
        >
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BaseForm

