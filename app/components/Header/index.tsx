import React from 'react';
import { useImmer } from 'use-immer';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';

export type HeaderType = { key: string; value: string };
export type CompleteHeader = { key: string; value: string; id: string };

type HeadersProps = {
  headers: CompleteHeader[];
  handleAddHeader: (h: HeaderType) => void;
};

type headerHook = [
  HeaderType,
  (f: (draft: HeaderType) => void | HeaderType) => void
];

export default function Headers({ handleAddHeader, headers }: HeadersProps) {
  const [header, setHeader]: headerHook = useImmer({
    key: '',
    value: ''
  });

  const handleChangeHeaderValue = (key: 'key' | 'value') => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    evt.persist();
    setHeader(draft => {
      if (key === 'key') draft.key = evt.target.value;
      if (key === 'value') draft.value = evt.target.value;
    });
  };
  const handleAddNewHeader = () => {
    handleAddHeader(header);
  };
  return (
    <Grid container>
      <Grid item>
        <TextField
          fullWidth
          value={header.key}
          onChange={handleChangeHeaderValue('key')}
        />
      </Grid>
      <Grid item>
        <TextField
          onChange={handleChangeHeaderValue('value')}
          fullWidth
          value={header.value}
        />
      </Grid>
      <Grid item>
        <Fab onClick={handleAddNewHeader}>
          <AddIcon />
        </Fab>
      </Grid>

      {headers.map(header => (
        <Typography key={header.id}>
          {header.key} -{header.value}
        </Typography>
      ))}
    </Grid>
  );
}
