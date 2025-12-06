import React from 'react'
import { DataGrid, type DataGridProps } from '@mui/x-data-grid'
import TableColumnMenu from './TableColumnMenu'

interface BaseTableProps extends Omit<DataGridProps, 'sx'> {
  sx?: DataGridProps['sx']
}

const BaseTable: React.FC<BaseTableProps> = ({ sx, pageSizeOptions = [5, 10, 25], ...props }) => {
  return (
    <DataGrid
      {...props}
      pageSizeOptions={pageSizeOptions}
      slots={{
        columnMenu: TableColumnMenu,
        ...props.slots,
      }}
      className='custom-scrollbar'
      sx={{
        flex: 1,
        minHeight: 0
      }}
    />
  )
}

export default BaseTable

