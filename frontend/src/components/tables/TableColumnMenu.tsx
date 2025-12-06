import React from 'react'
import {
  GridColumnMenuContainer,
  GridColumnMenuFilterItem,
  GridColumnMenuSortItem,
  type GridColumnMenuProps
} from '@mui/x-data-grid'

const TableColumnMenu: React.FC<GridColumnMenuProps> = (props) => {
  const { hideMenu, colDef, open } = props
  
  return (
    <GridColumnMenuContainer hideMenu={hideMenu} colDef={colDef} open={open}>
      <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  )
}

export default TableColumnMenu