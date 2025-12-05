import React from 'react'
import { Snackbar, Alert } from '@mui/material'

type AlertSeverity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarAlertsProps {
  open: boolean
  type: AlertSeverity
  message: string
  onClose?: () => void
  autoHideDuration?: number
}

const SnackbarAlerts: React.FC<SnackbarAlertsProps> = ({
  open,
  type,
  message,
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        position: 'fixed',
        top: '80px !important',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant='filled'
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarAlerts

