import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const methods = ['GET', 'POST', 'DELETE', 'PUT'];

type URLFormProps = {
  handleMakeAPICall: () => void;
};

export default function URLForm({ handleMakeAPICall }: URLFormProps) {
  const [method, setMethod] = useState('GET');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectMethod = (method: string) => () => {
    setMethod(method);
    handleClose();
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {method}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {methods.map(method => (
            <MenuItem key={method} onClick={handleSelectMethod(method)}>
              {method}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Type in the URL"
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <Button onClick={handleMakeAPICall}>Run</Button>
      </Grid>
    </Grid>
  );
}
