import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './components/layout/Layout'
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import { SnackbarProvider } from './components/layout/SnackbarContext'
import type { UserRole } from './types/user'
import theme from './theme'

const App: React.FC = () => {
  const [mode, setMode] = useState<UserRole>('user')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Layout mode={mode} onToggleMode={setMode}>
          {mode === 'admin' ? <AdminPage /> : <UserPage />}
        </Layout>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App