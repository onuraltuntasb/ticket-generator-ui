import React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

const Login = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
          xs
        </Grid>
        <Grid item xs={6}>
          <div>
            <TextField id="outlined-search" label="email" type="email" />
          </div>
          <TextField id="outlined-search" label="password" type="password" />
        </Grid>
        <Grid item xs>
          xs
        </Grid>
      </Grid>
    </Box>
  )
}

export default Login
