import React from 'react'
import { Typography, IconButton, Box, CircularProgress } from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import NewButton from '../common/NewButton'
import { TagColor } from '../../constants/colors'
import { getTagColor } from '../../utils/colors'
import type { Tag } from '../../types/tag'

interface TagsTableProps {
  tags?: Tag[]
  isLoading?: boolean
  onCreate?: () => void
  onEdit?: (tag: Tag) => void
  onDelete?: (tag: Tag) => void
}

const TagsTable: React.FC<TagsTableProps> = ({ 
  tags = [], 
  isLoading = false,
  onCreate,
  onEdit,
  onDelete
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
      renderCell: (params: GridRenderCellParams<Tag>) => (
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
      field: 'color_id',
      headerName: 'Color',
      headerAlign: 'left',
      width: 100,
      renderHeader: () => (
        <Typography variant='body1'>Color</Typography>
      ),
      renderCell: (params: GridRenderCellParams<Tag>) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'left' 
        }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: getTagColor(params.row.color_id as TagColor),
              border: 1,
              borderColor: 'divider',
            }}
          />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<Tag>) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 0.5 
        }}>
          <IconButton
            size='medium'
            color='info'
            onClick={() => onEdit?.(params.row as Tag)}
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize='medium' />
          </IconButton>
          <IconButton
            size='medium'
            color='error'
            onClick={() => onDelete?.(params.row as Tag)}
            sx={{ p: 0.5 }}
          >
            <ClearIcon fontSize='medium' />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ p: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, height: 40 }}>
        <Typography variant='h5'>Tags</Typography>
        <NewButton label='Tag' onClick={onCreate} />
      </Box>

      {isLoading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={tags}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{ flex: 1, minHeight: 0 }}
          getRowId={(row) => row.id}
        />
      )}
    </Box>
  )
}

export default TagsTable
