import React from 'react';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

// types
import { Method } from 'axios';
import { axiosObject } from '../../types/request';

type URLFormProps = {
  axiosObject: axiosObject;
  handleMakeAPICall: () => void;
  methods: Method[];
  setSelectedMethod: React.Dispatch<React.SetStateAction<Method>>;
  selectedMethod: string;
  handleURLChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function URLForm({
  handleMakeAPICall,
  methods,
  setSelectedMethod,
  selectedMethod,
  handleURLChange,
  axiosObject
}: URLFormProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {};

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    method: Method
  ) => {
    setSelectedMethod(method);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button onClick={handleClick}>{selectedMethod}</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {methods.map(method => (
                      <MenuItem
                        key={method}
                        selected={selectedMethod === method}
                        onClick={event => handleMenuItemClick(event, method)}
                      >
                        {method}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          value={axiosObject.url}
          onChange={handleURLChange}
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
