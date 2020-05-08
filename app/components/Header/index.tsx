import React from 'react';
import { useImmer } from 'use-immer';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

type Header = { key: string; value: string };

type HeadersProps = {
  handleAddHeader: (h: Header) => void;
};

type headerHook = [Header, (f: (draft: Header) => void | Header) => void];

export default function Headers({ handleAddHeader }: HeadersProps) {
  const [header, setHeader]: headerHook = useImmer({
    key: '',
    value: ''
  });

  const handleChangeHeaderValue = (key: 'key' | 'value') => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    </Grid>
  );
}
