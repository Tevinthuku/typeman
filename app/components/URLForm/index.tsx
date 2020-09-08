import React, { FormEvent } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import ButtonGroupComponent from '../ButtonGroup';

// types
import { Method } from 'axios';

type URLFormProps = {
  beginRequestProcessing: () => void;
  methods: Method[];
  url: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<Method>>;
  selectedMethod: string;
  handleURLChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2)
  },
  input: {
    width: '100%'
  },
  submitButton: {
    marginLeft: '10px'
  }
}));

export default function URLForm({
  beginRequestProcessing,
  methods,
  url,
  setSelectedMethod,
  selectedMethod,
  handleURLChange
}: URLFormProps) {
  const classes = useStyles();

  const handleMenuItemClick = (
    handleOpenMenu: React.Dispatch<React.SetStateAction<boolean>>,
    method: Method
  ) => {
    setSelectedMethod(method);
    handleOpenMenu(false);
  };

  const handleSubmitRequestForm = (evt: FormEvent) => {
    evt.preventDefault();
    beginRequestProcessing();
  };

  return (
    <Grid
      className={classes.container}
      alignItems="center"
      justify="center"
      container
    >
      <Grid item xs={3} md={2}>
        <ButtonGroupComponent
          ariaLabel="HTTP Methods"
          buttonGroupLabel="Select HTTP Method"
          itemSelected={selectedMethod}
        >
          {handleClose => (
            <MenuList id="split-button-menu">
              {methods.map(method => (
                <MenuItem
                  key={method}
                  selected={selectedMethod === method}
                  onClick={() => handleMenuItemClick(handleClose, method)}
                >
                  {method}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </ButtonGroupComponent>
      </Grid>
      <Grid item xs={6} md={8}>
        <form onSubmit={handleSubmitRequestForm}>
          <TextField
            className={classes.input}
            fullWidth
            value={url}
            onChange={handleURLChange}
            id="outlined-basic"
            label="Type in the URL"
            variant="outlined"
          />
        </form>
      </Grid>
      <Grid item xs={3} md={2}>
        <Button
          className={classes.submitButton}
          color="primary"
          variant="contained"
          onClick={beginRequestProcessing}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
}
