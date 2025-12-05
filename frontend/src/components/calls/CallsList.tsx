import React from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import CallCard from './CallCard'
import type { CallListItem } from '../../types/call'

interface CallsListProps {
  calls: CallListItem[]
  selectedCallId?: number | null
  isLoading?: boolean
  onCallSelect: (callId: number) => void
}

const CallsList: React.FC<CallsListProps> = ({
  calls,
  selectedCallId,
  isLoading = false,
  onCallSelect,
}) => {
  // Sort calls from newest to oldest (by created_at)
  const sortedCalls = [...calls].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })

  return (
    <Box
      sx={{
        flex: '0 0 20%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Box sx={{ p: 2, pl: 3, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant='h5'>Calls</Typography>
      </Box>
      <Box
        className='custom-scrollbar'
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 2,
          minHeight: 0,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          sortedCalls.map((call) => (
            <CallCard
              key={call.id}
              call={call}
              isSelected={selectedCallId === call.id}
              onClick={() => onCallSelect(call.id)}
            />
          ))
        )}
      </Box>
    </Box>
  )
}

export default CallsList

