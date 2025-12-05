import React from 'react'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import type { UserRole } from '../../types/user'

interface LayoutProps {
  mode: UserRole
  onToggleMode: (mode: UserRole) => void
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ mode, onToggleMode, children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', width: '100%', position: 'relative' }}>
      <Navbar mode={mode} onToggleMode={onToggleMode} />
      <Box
        component='main'
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%',
          height: 'calc(100vh - 64px)',
          mt: '64px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout
