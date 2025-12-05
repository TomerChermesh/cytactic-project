import React from 'react'
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import CallCard from './CallCard'
import type { CallListItem } from '../../types/call'

interface CallsListProps {
  calls: CallListItem[]
  selectedCallId?: number | null
  isLoading?: boolean
  days?: number
  onCallSelect: (callId: number) => void
  onDaysChange?: (days: number) => void
}

const CallsList: React.FC<CallsListProps> = ({
  calls,
  selectedCallId,
  isLoading = false,
  days = 7,
  onCallSelect,
  onDaysChange,
}) => {
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
        backgroundColor: 'white'
      }}
    >
      <Box sx={{ 
        p: 2, 
        pl: 3, 
        borderBottom: 1, 
        borderColor: 'divider', 
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant='h5'>Calls</Typography>
        <FormControl size='small' sx={{ minWidth: 100 }}>
          <InputLabel>Days</InputLabel>
          <Select
            value={days.toString()}
            label='Days'
            MenuProps={{ PaperProps: { className: 'custom-scrollbar', sx: { maxHeight: 300 } } }}   
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              if (!isNaN(value) && value >= 1 && value <= 30 && onDaysChange) {
                onDaysChange(value)
              }
            }}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <MenuItem key={day} value={day.toString()}>{day}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box className='custom-scrollbar' sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 2, minHeight: 0 }}>   
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          sortedCalls.map((call) => (
            <CallCard key={call.id} call={call} isSelected={selectedCallId === call.id} onClick={() => onCallSelect(call.id)} />
          ))
        )}
      </Box>
    </Box>
  )
}

export default CallsList
