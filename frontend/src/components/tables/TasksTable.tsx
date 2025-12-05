import React, { useState, useMemo } from 'react'
import { Typography, IconButton, Box, CircularProgress, Tooltip } from '@mui/material'
import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import BaseTable from './BaseTable'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import NewButton from '../common/NewButton'
import type { CallTask } from '../../types/task'

interface CallTasksTableProps {
  tasks?: CallTask[]
  isLoading?: boolean
  onCreate?: () => void
  onComplete?: (task: CallTask) => void
  onEdit?: (task: CallTask) => void
  onDelete?: (task: CallTask) => void
}

const CallTasksTable: React.FC<CallTasksTableProps> = ({
  tasks = [],
  isLoading = false,
  onCreate,
  onComplete,
  onEdit,
  onDelete
}) => {
  const [showCompleted, setShowCompleted] = useState(false)

  const filteredTasks = useMemo(() => {
    if (showCompleted) {
      return tasks
    }
    return tasks.filter((task) => task.status !== 'completed')
  }, [tasks, showCompleted])
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      headerAlign: 'left',
      flex: 1,
      renderHeader: () => <Typography variant='body1'>Name</Typography>,
      renderCell: (params: GridRenderCellParams<CallTask>) => {
        const task = params.row as CallTask
        const isCompleted = task.status === 'completed'
        return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <Typography variant='body1' sx={{ color: isCompleted ? 'text.disabled' : 'text.primary' }}>{params.value}</Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'left',
      width: 120,
      renderHeader: () => <Typography variant='body1'>Status</Typography>,
      renderCell: (params: GridRenderCellParams<CallTask>) => {
        const task = params.row as CallTask
        const isCompleted = task.status === 'completed'
        return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <Typography 
              variant='body1' 
              sx={{ 
                textTransform: 'capitalize',
                color: isCompleted ? 'text.disabled' : 'text.primary'
              }}
            >
              {params.value.replace('_', ' ')}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<CallTask>) => (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <IconButton 
            size='medium'
            color='success'
            onClick={() => onComplete?.(params.row as CallTask)}
            disabled={(params.row as CallTask).status === 'completed'}
            sx={{ p: 0.5 }}
          >
            <CheckCircleIcon fontSize='medium' />
          </IconButton>
          <IconButton
            size='medium'
            color='info'
            onClick={() => onEdit?.(params.row as CallTask)}
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize='medium' />
          </IconButton>
          <IconButton
            size='medium'
            color='error'
            onClick={() => onDelete?.(params.row as CallTask)}
            sx={{ p: 0.5 }}
          >
            <ClearIcon fontSize='medium' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ p: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, height: 40 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h5'>Call Tasks</Typography>
          <Tooltip title={showCompleted ? 'Hide Completed' : 'Show Completed'}>
            <IconButton
              size='small'
              color={showCompleted ? 'success' : 'default'}
              onClick={() => setShowCompleted(!showCompleted)}
              sx={{ color: showCompleted ? 'success.main' : 'action.disabled' }}
            >
              <CheckCircleIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        <NewButton label='Call Task' onClick={onCreate} />
      </Box>

      {isLoading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <BaseTable
          rows={filteredTasks}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      )}
    </Box>
  )
}

export default CallTasksTable
