import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    h1: {
      fontFamily: '"Karina", sans-serif',
    },
    h2: {
      fontFamily: '"Karina", sans-serif',
    },
    h3: {
      fontFamily: '"Karina", sans-serif',
    },
    h4: {
      fontFamily: '"TT Chocolates Trial Bold", sans-serif',
    },
    h5: {
      fontFamily: '"TT Chocolates Trial Bold", sans-serif',
    },
    h6: {
      fontFamily: '"TT Chocolates Trial Bold", sans-serif',
    },
    body1: {
      fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    },
    body2: {
      fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    },
    button: {
      fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    },
    caption: {
      fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    },
    overline: {
      fontFamily: '"TT Chocolates Trial Regular", sans-serif',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily: '"Karina", sans-serif !important',
        },
        h2: {
          fontFamily: '"Karina", sans-serif !important',
        },
        h3: {
          fontFamily: '"Karina", sans-serif !important',
        },
        h4: {
          fontFamily: '"Karina", sans-serif !important',
        },
        h5: {
          fontFamily: '"TT Chocolates Trial Bold", sans-serif !important',
        },
        h6: {
          fontFamily: '"TT Chocolates Trial Bold", sans-serif !important',
        },
        body1: {
          fontFamily: '"TT Chocolates Trial Regular", sans-serif !important',
        },
        body2: {
          fontFamily: '"TT Chocolates Trial Regular", sans-serif !important',
        },
      },
    },
  },
})

export default theme

