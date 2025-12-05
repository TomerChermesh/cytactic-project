import React from 'react'
import { DataGrid, type DataGridProps } from '@mui/x-data-grid'

interface BaseTableProps extends Omit<DataGridProps, 'sx'> {
  sx?: DataGridProps['sx']
}

const BaseTable: React.FC<BaseTableProps> = ({ sx, ...props }) => {
  return (
    <DataGrid
      {...props}
      sx={{
        flex: 1,
        minHeight: 0,
        '& .MuiDataGrid-virtualScroller': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        ...sx,
      }}
    />
  )
}

export default BaseTable

