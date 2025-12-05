import React from 'react'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface NewButtonProps {
  label: string
  onClick?: () => void
}

const NewButton: React.FC<NewButtonProps> = ({ label, onClick }) => {
  return (
    <Button
      variant='outlined'
      onClick={onClick}
      endIcon={<AddIcon />}
      sx={{
        backgroundColor: 'success.main',
        color: 'white',
        '&:hover': {
          backgroundColor: 'success.light',
        },
        textTransform: 'none',
        fontFamily: 'TT Chocolates Trial Bold'
      }}
    >
      New {label}
    </Button>
  )
}

export default NewButton
