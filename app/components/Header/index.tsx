import React from 'react';
import { useImmer } from 'use-immer';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

type HeaderItemType = 'string' | 'number';
export type HeaderType = { key: string; value: string; type: HeaderItemType };

export type CompleteHeader = {
  key: string;
  value: string;
  id: string;
  type: HeaderItemType;
};

type HeadersProps = {
  headers: CompleteHeader[];
  handleAddHeader: (h: HeaderType) => void;
};

type headerHook = [
  HeaderType,
  (f: (draft: HeaderType) => void | HeaderType) => void
];

const allTypes: HeaderItemType[] = ['string', 'number'];

export default function Headers({ handleAddHeader, headers }: HeadersProps) {
  const [header, setHeader]: headerHook = useImmer({
    key: '',
    value: '',
    type: 'string'
  });

  const [openHeaderType, setOpenHeaderType] = React.useState(false);

  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleChangeHeaderValue = (key: 'key' | 'value') => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    evt.persist();
    setHeader(draft => {
      if (key === 'key') draft.key = evt.target.value;
      if (key === 'value') draft.value = evt.target.value;
    });
  };
  const handleSelectValueType = (type: HeaderItemType) => () => {
    setHeader(draft => {
      draft.type = type;
    });
    setOpenHeaderType(false);
  };

  const handleCloseHeaderTypeSelection = (
    event: React.MouseEvent<Document, MouseEvent>
  ) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenHeaderType(false);
  };

  const handleToggleHeaderTypeSelection = () => {
    setOpenHeaderType(val => !val);
  };

  const handleAddNewHeader = () => {
    handleAddHeader(header);
  };
  return (
    <Grid container>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Key</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                <TextField
                  variant="outlined"
                  placeholder="Key"
                  fullWidth
                  value={header.key}
                  onChange={handleChangeHeaderValue('key')}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  variant="outlined"
                  onChange={handleChangeHeaderValue('value')}
                  fullWidth
                  value={header.value}
                  placeholder="Value"
                />
              </TableCell>
              <TableCell align="center">
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  ref={anchorRef}
                  aria-label="split button"
                >
                  <Button>{header.type}</Button>
                  <Button
                    color="primary"
                    size="small"
                    aria-controls={
                      openHeaderType ? 'split-button-menu' : undefined
                    }
                    aria-expanded={openHeaderType ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggleHeaderTypeSelection}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={openHeaderType}
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
                          placement === 'bottom'
                            ? 'center top'
                            : 'center bottom'
                      }}
                    >
                      <Paper>
                        <ClickAwayListener
                          onClickAway={handleCloseHeaderTypeSelection}
                        >
                          <MenuList id="split-button-menu">
                            {allTypes.map(option => (
                              <MenuItem
                                key={option}
                                selected={option === header.type}
                                onClick={handleSelectValueType(option)}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
                <Button onClick={handleAddNewHeader}>Create</Button>
              </TableCell>
            </TableRow>
            {headers.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">
                  <TextField
                    variant="outlined"
                    placeholder="Key"
                    value={row.key}
                    fullWidth
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    variant="outlined"
                    value={row.value}
                    placeholder="Value"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
