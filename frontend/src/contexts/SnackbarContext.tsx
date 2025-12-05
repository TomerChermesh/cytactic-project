import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import SnackbarAlerts from '../components/common/SnackbarAlerts'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface SnackbarContextType {
  showAlert: (type: AlertType, message: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}

interface SnackbarProviderProps {
  children: ReactNode
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<AlertType>('success')
  const [message, setMessage] = useState('')

  const showAlert = (alertType: AlertType, alertMessage: string) => {
    setType(alertType)
    setMessage(alertMessage)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{ showAlert }}>
      {children}
      <SnackbarAlerts
        open={open}
        type={type}
        message={message}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  )
}

