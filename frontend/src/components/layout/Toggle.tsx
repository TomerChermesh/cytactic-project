import React from 'react'
import { Box, Switch, Typography } from '@mui/material'
import type { UserRole } from '../../types/user'

interface ToggleProps {
  value: UserRole
  onChange: (value: UserRole) => void
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => {
  const isUser = value === 'user'
  
  const handleToggle = () => {
    onChange(isUser ? 'admin' : 'user')
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='h6' color='white'>Admin</Typography>
      <Switch checked={isUser} onChange={handleToggle} color='default' />
      <Typography variant='h6' color='white'>User</Typography>
    </Box>
  )
}

export default Toggle
