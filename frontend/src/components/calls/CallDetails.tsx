import React from 'react'
import { Typography, Paper, Box } from '@mui/material'

interface Props {
  callId: string | null
}

const CallDetails: React.FC<Props> = ({ callId }) => {
  if (!callId) {
    return <Typography>Select a call from the sidebar</Typography>
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant='h5'>Call #{callId}</Typography>
      <Box mt={2}>Tags, tasks, actions will go here…</Box>
    </Paper>
  )
}

export default CallDetails