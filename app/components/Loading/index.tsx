import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
});

export default function LoadingResults() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Skeleton
        animation="wave"
        style={{
          width: '60%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '70%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '30%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '50%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '55%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '65%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '35%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '25%'
        }}
      />
      <Skeleton
        animation="wave"
        style={{
          width: '5%'
        }}
      />
    </div>
  );
}
