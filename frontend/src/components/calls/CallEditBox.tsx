import React from 'react'
import { Box, Typography, IconButton, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import EditIcon from '@mui/icons-material/Edit'
import CallTasksTable from '../tables/TasksTable'
import SuggestedTasksTable from '../tables/SuggestedTasksTable'
import DeletableChip from '../common/DeletableChip'
import type { CallDetail } from '../../types/call'
import type { CallTask, TemplateTask } from '../../types/task'

interface CallEditBoxProps {
  call: CallDetail | null
  callTasks?: CallTask[]
  isLoadingCallTasks?: boolean
  suggestedTasks?: TemplateTask[]
  isLoadingSuggestedTasks?: boolean
  onCompleteTask?: (task: CallTask) => void
  onEditCallTask?: (task: CallTask) => void
  onDeleteCallTask?: (task: CallTask) => void
  onCreateCallTask?: () => void
  onAddSuggestedTask?: (task: TemplateTask) => void
  onCreateNewCall?: () => void
  onClose?: () => void
  onEdit?: () => void
}

const CallEditBox: React.FC<CallEditBoxProps> = ({
  call,
  callTasks = [],
  isLoadingCallTasks = false,
  suggestedTasks = [],
  isLoadingSuggestedTasks = false,
  onCompleteTask,
  onEditCallTask,
  onDeleteCallTask,
  onCreateCallTask,
  onAddSuggestedTask,
  onCreateNewCall,
  onClose,
  onEdit
}) => {
  if (!call) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 3, position: 'relative', height: '100%', minHeight: 0 }}>
        <Paper
          elevation={3}
          onClick={onCreateNewCall}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: 3,
            position: 'relative',
            height: '100%',
            minHeight: 0,
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              }
          }}
        >
            <Typography variant='h5' sx={{ color: 'success.main' }}>Create a new Call</Typography>
            <AddIcon sx={{ fontSize: 40, color: 'success.main' }}/>
        </Paper>
      </Box>
    )
  }

  const formattedDate = new Date(call.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 3, height: '100%', minHeight: 0 }}>
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 3, position: 'relative', height: '100%', minHeight: 0, borderRadius: 2 }}>
        {onClose && (
          <IconButton size='medium' onClick={onClose} sx={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
            <CloseFullscreenIcon fontSize='medium' />
          </IconButton>
        )}

        <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {onEdit && (
            <IconButton size='medium' onClick={onEdit}>
              <EditIcon fontSize='medium' />
            </IconButton>
          )}
          <Typography variant='h4' sx={{ flex: 1, fontFamily: '"TT Chocolates Trial Bold", sans-serif !important' }}>
            {call.name}
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {formattedDate}
        </Typography>
        <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          {call.tags && call.tags.length > 0 ? (
            call.tags.map((tag) => (
              <DeletableChip key={tag.id} label={tag.name} deletable={false} colorId={tag.color_id} />
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>No tags</Typography>
          )}
        </Box>
        {call.description && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant='body1' color='text.primary' sx={{ whiteSpace: 'pre-wrap' }}>{call.description}</Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, alignItems: 'stretch' }}>
        <Box sx={{ flex: '0 0 50%', display: 'flex', minWidth: 0, overflow: 'hidden', height: '100%', alignItems: 'stretch' }}>
          <CallTasksTable
            tasks={callTasks}
            isLoading={isLoadingCallTasks}
            onCreate={onCreateCallTask}
            onComplete={onCompleteTask}
            onEdit={onEditCallTask}
            onDelete={onDeleteCallTask}
          />
        </Box>
        <Box sx={{ flex: '0 0 50%', display: 'flex', minWidth: 0, overflow: 'hidden', height: '100%', alignItems: 'stretch' }}>
          <SuggestedTasksTable
            tasks={suggestedTasks}
            isLoading={isLoadingSuggestedTasks}
            mode='user'
            onAddToCall={onAddSuggestedTask}
          />
        </Box>
      </Box>
      </Paper>
    </Box>
  )
}

export default CallEditBox
