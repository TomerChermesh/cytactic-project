import React from 'react'
import { Chip } from '@mui/material'

interface DeletableChipProps {
  label: string
  onDelete?: () => void
  deletable?: boolean
  size?: 'small' | 'medium'
}

const DeletableChip: React.FC<DeletableChipProps> = ({ 
  label, 
  onDelete, 
  deletable = false,
  size = 'medium'
}) => {
  return (
    <Chip
      label={label}
      size={size}
      onDelete={deletable && onDelete ? onDelete : undefined}
      sx={{
        fontSize: size === 'small' ? '0.8rem' : '0.9rem',
        height: size === 'small' ? 20 : 'auto',
      }}
    />
  )
}

export default DeletableChip
