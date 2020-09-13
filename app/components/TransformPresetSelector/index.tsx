import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Settings from '@material-ui/icons/Settings';

import { TransformationKeys } from '../../hooks/useTransform';

const options: TransformationKeys[] = ['flow', 'typescript'];

export interface ConfirmationDialogRawProps {
  classes: Record<'paper', string>;
  id: string;
  keepMounted: boolean;
  value: TransformationKeys;
  open: boolean;
  onClose: (value?: TransformationKeys) => void;
}

type Props = {
  transformTo: TransformationKeys;
  setTransformPreset: (t: TransformationKeys) => void;
};

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const radioGroupRef = React.useRef<HTMLElement>(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(valueProp);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    onClose(value as TransformationKeys);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        Select Transformation Preset
      </DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={valueProp}
          onChange={handleChange}
        >
          {options.map(option => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: '80%',
      maxHeight: 435
    }
  })
);

export default function ConfirmationDialog(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: TransformationKeys) => {
    setOpen(false);
    if (newValue) {
      props.setTransformPreset(newValue);
    }
  };

  return (
    <div>
      <Button onClick={handleClickListItem} endIcon={<Settings />}>
        {props.transformTo}
      </Button>
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper
        }}
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        value={props.transformTo}
      />
    </div>
  );
}
