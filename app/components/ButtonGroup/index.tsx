import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

export type handleCloseButtonGroupType = React.Dispatch<
  React.SetStateAction<boolean>
>;

type Props = {
  ariaLabel: string;
  buttonGroupLabel: string;
  itemSelected: string;
  children: (fn: handleCloseButtonGroupType) => React.ReactNode;
};

const useStyles = makeStyles(() => ({
  poper: {
    zIndex: 100000
  }
}));
export default function ButtonGroupComponent({
  ariaLabel,
  itemSelected,
  children,
  buttonGroupLabel
}: Props) {
  const [isMenuOpen, setMenuState] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const classes = useStyles();
  const handleToggle = () => {
    setMenuState(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setMenuState(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label={ariaLabel}
        >
          <Button>{itemSelected}</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={isMenuOpen ? 'split-button-menu' : undefined}
            aria-expanded={isMenuOpen ? 'true' : undefined}
            aria-label={buttonGroupLabel}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <div>
          <Popper
            open={isMenuOpen}
            anchorEl={anchorRef.current}
            className={classes.poper}
            role={undefined}
            transition
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
                    {children(setMenuState)}
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Grid>
    </Grid>
  );
}
