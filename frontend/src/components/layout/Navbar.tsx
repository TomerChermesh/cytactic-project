import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import Toggle from './Toggle'
import type { UserRole } from '../../types/user'

interface NavbarProps {
  mode: UserRole
  onToggleMode: (mode: UserRole) => void
}

const Navbar: React.FC<NavbarProps> = ({ mode, onToggleMode }) => {
  return (
    <AppBar position='fixed' color='primary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4' component='div'>Centriq</Typography>
        <Toggle value={mode} onChange={onToggleMode} />
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
