import React from 'react'
import { Typography, IconButton, Box, CircularProgress } from '@mui/material'
import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import BaseTable from './BaseTable'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import AddIcon from '@mui/icons-material/Add'
import DeletableChip from '../common/DeletableChip'
import NewButton from '../common/NewButton'
import type { TemplateTask } from '../../types/task'

type SuggestedTasksTableMode = 'admin' | 'user'

interface SuggestedTasksTableProps {
  tasks?: TemplateTask[]
  isLoading?: boolean
  mode?: SuggestedTasksTableMode
  onCreate?: () => void
  onEdit?: (task: TemplateTask) => void
  onDelete?: (task: TemplateTask) => void
  onAddToCall?: (task: TemplateTask) => void
}

const SuggestedTasksTable: React.FC<SuggestedTasksTableProps> = ({
  tasks = [],
  isLoading = false,
  mode = 'admin',
  onCreate,
  onEdit,
  onDelete,
  onAddToCall,
}) => {
  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name',
      headerAlign: 'left',
      flex: 1,
      renderHeader: () => (
        <Typography variant='body1'>Name</Typography>
      ),
      renderCell: (params: GridRenderCellParams<TemplateTask>) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'left' 
        }}>
          <Typography variant='body1'>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'tags',
      headerName: 'Tags',
      headerAlign: 'left',
      flex: 1,
      renderHeader: () => (
        <Typography variant='body1'>Tags</Typography>
      ),
      renderCell: (params: GridRenderCellParams<TemplateTask>) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'left',
          gap: 0.5, 
          flexWrap: 'wrap', 
        }}>
          {(params.row as TemplateTask).tags?.map((tag) => (
            <DeletableChip 
              key={tag.id} 
              label={tag.name}
              deletable={false}
              colorId={tag.color_id}
            />
          )) || <Typography variant='body1' color='text.secondary'>No tags</Typography>}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: mode === 'admin' ? 100 : 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<TemplateTask>) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          {mode === 'admin' ? (
            <>
              <IconButton
                size='medium'
                color='info'
                onClick={() => onEdit?.(params.row as TemplateTask)}
                sx={{ p: 0.5 }}
              >
                <EditIcon fontSize='medium' />
              </IconButton>
              <IconButton
                size='medium'
                color='error'
                onClick={() => onDelete?.(params.row as TemplateTask)}
                sx={{ p: 0.5 }}
              >
                <ClearIcon fontSize='medium' />
              </IconButton>
            </>
          ) : (
            <IconButton
              size='medium'
              color='success'
              onClick={() => onAddToCall?.(params.row as TemplateTask)}
              sx={{ p: 0.5 }}
            >
              <AddIcon fontSize='medium' />
            </IconButton>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ p: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, height: 40 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h5'>Suggested Tasks</Typography>
        </Box>
        {mode === 'admin' && <NewButton label='Suggested Tasks' onClick={onCreate} />}
      </Box>

      {isLoading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <BaseTable
          rows={tasks}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      )}
    </Box>
  )
}

export default SuggestedTasksTable
