import React from 'react'
import { Chip } from '@mui/material'
import { TagColor } from '../../constants/colors'
import { getTagColor } from '../../utils/colors'

interface DeletableChipProps {
  label: string
  onDelete?: () => void
  deletable?: boolean
  size?: 'small' | 'medium'
  colorId?: number
}

const DeletableChip: React.FC<DeletableChipProps> = ({ 
  label, 
  onDelete, 
  deletable = false,
  size = 'medium',
  colorId = TagColor.GRAY
}) => {
  const color = getTagColor(colorId as TagColor)
  
  return (
    <Chip
      label={label}
      size={size}
      onDelete={deletable && onDelete ? onDelete : undefined}
      sx={{
        fontSize: size === 'small' ? '0.8rem' : '0.9rem',
        height: size === 'small' ? 20 : 'auto',
        backgroundColor: color,
        color: 'white',
        '& .MuiChip-deleteIcon': {
          color: 'white'
        }
      }}
    />
  )
}

export default DeletableChip
