import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { motion } from 'framer-motion';

type Props = {
  value: string;
  isSelected: boolean;
  layoutId: string;
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    zIndex: 10
  },
  outline: {
    border: '3px solid white',
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    zIndex: 20,
    borderRadius: 20
  },
  text: {
    padding: theme.spacing(1)
  }
}));
export default function TabLabel(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      <Typography className={classes.text}>{props.value}</Typography>
      {props.isSelected && (
        <motion.div
          className={classes.outline}
          layoutId={props.layoutId}
          initial={false}
          animate={{ borderColor: theme.palette.primary.main }}
        ></motion.div>
      )}
    </div>
  );
}
