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
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import ValueInputComponent from '../ValueInput';

import ButtonGroupComponent, {
  handleCloseButtonGroupType
} from '../ButtonGroup';

import {
  IDObjectItem,
  HeaderType,
  supportedDataTypes,
  HeaderItemType,
  AxiosHeaderParamType
} from '../../types/data';
import { makeStyles } from '@material-ui/core';

type Props = {
  items: IDObjectItem;
  handleAddItem: (h: HeaderType) => void;
  handleEditItem: (id: string) => (value: AxiosHeaderParamType) => void;
  handleDeleteItem: (id: string) => () => void;
};

const initialItem: HeaderType = {
  key: '',
  value: '',
  type: supportedDataTypes[0]
};

const useClasses = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default
  }
}));

export default function FieldsContainer({
  handleAddItem,
  items,
  handleEditItem,
  handleDeleteItem
}: Props) {
  const [item, setItem] = useImmer<HeaderType>(initialItem);

  const handleChangeHeaderValue = (key: 'key' | 'value') => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    evt.persist();
    setItem(draft => {
      if (key === 'key') draft.key = evt.target.value;
      if (key === 'value') draft.value = evt.target.value;
    });
  };
  const handleSelectValueType = (
    handleClose: handleCloseButtonGroupType,
    type: HeaderItemType
  ) => () => {
    setItem(draft => {
      draft.type = type;
    });
    handleClose(false);
  };

  const handleAddNewItem = () => {
    handleAddItem(item);
    setItem(() => initialItem);
  };

  const handleEditTypeOfItem = (
    handleClose: handleCloseButtonGroupType,
    option: HeaderItemType,
    id: string
  ) => () => {
    handleEditItem(id)({ item: 'type', itemType: option });
    handleClose(false);
  };

  const handleEditKeyOrValue = (itemType: 'key' | 'value', id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleEditItem(id)({ item: itemType, itemValue: event.target.value });
  };

  const classes = useClasses();

  return (
    <Grid container className={classes.root}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" className={classes.root}>
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
                  value={item.key}
                  onChange={handleChangeHeaderValue('key')}
                />
              </TableCell>
              <TableCell align="center">
                <ValueInputComponent
                  variant="outlined"
                  onChange={handleChangeHeaderValue('value')}
                  fullWidth
                  value={item.value}
                  placeholder="Value"
                  multiline
                />
              </TableCell>
              <TableCell align="center">
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <ButtonGroupComponent
                      ariaLabel="Prop data type selection"
                      buttonGroupLabel="Select Data type of the property"
                      itemSelected={item.type}
                    >
                      {handleClose => (
                        <MenuList id="split-button-menu">
                          {supportedDataTypes.map(option => (
                            <MenuItem
                              key={option}
                              selected={option === item.type}
                              onClick={handleSelectValueType(
                                handleClose,
                                option
                              )}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      )}
                    </ButtonGroupComponent>
                  </Grid>
                  <Grid item>
                    <Fab
                      size="small"
                      onClick={handleAddNewItem}
                      color="primary"
                      aria-label="add"
                    >
                      <AddIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
            {Object.values(items).map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">
                  <TextField
                    variant="outlined"
                    placeholder="Key"
                    value={row.key}
                    onChange={handleEditKeyOrValue('key', row.id)}
                    fullWidth
                  />
                </TableCell>
                <TableCell align="center">
                  <ValueInputComponent
                    variant="outlined"
                    value={row.value}
                    placeholder="Value"
                    fullWidth
                    multiline
                    onChange={handleEditKeyOrValue('value', row.id)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <ButtonGroupComponent
                        ariaLabel={`edit ${row.key} 's  data type`}
                        buttonGroupLabel={`Select ${row.key} 's Data type`}
                        itemSelected={row.type}
                      >
                        {handleClose => (
                          <MenuList id="split-button-menu">
                            {supportedDataTypes.map(option => (
                              <MenuItem
                                key={option}
                                selected={option === row.type}
                                onClick={handleEditTypeOfItem(
                                  handleClose,
                                  option,
                                  row.id
                                )}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        )}
                      </ButtonGroupComponent>
                    </Grid>
                    <Grid item>
                      <Fab
                        size="small"
                        color="primary"
                        style={{ background: 'red' }}
                        onClick={handleDeleteItem(row.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
