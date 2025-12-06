import React from 'react'
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch'
import DeletableChip from '../common/DeletableChip'
import type { CallListItem } from '../../types/call'

interface CallCardProps {
  call: CallListItem
  isSelected?: boolean
  onClick?: () => void
}

const CallCard: React.FC<CallCardProps> = ({
  call,
  isSelected = false,
  onClick,
}) => {
  const formattedDate = new Date(call.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card
      sx={{
        mb: 1,
        cursor: onClick ? 'pointer' : 'default',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: 2,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant='body2' color='text.secondary' component='span' sx={{ lineHeight: 1.5 }}>#{call.id}</Typography>
              <Typography variant='body1' color='text.primary' component='span' sx={{ lineHeight: 1.5 }}>{call.name}</Typography> 
              <Typography variant='body2' color='text.secondary' component='span' sx={{ lineHeight: 1.5 }}>{formattedDate}</Typography>
            </Box>
            {call.tags && call.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {call.tags.map((tag) => (
                  <DeletableChip key={tag.id} label={tag.name} deletable={false} size='small' colorId={tag.color_id} />
                ))}
              </Box>
            )}
          </Box>
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
            sx={{ ml: 1 }}
          >
            <LaunchIcon fontSize='small' />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CallCard
