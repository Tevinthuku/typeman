import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

type FocusState = 'blur' | 'focused';
export default function ValueInputComponent(props: any) {
  const [focusState, setFocusedState] = useState<FocusState>('blur');
  const changeFocusState = (val: FocusState) => () => {
    setFocusedState(val);
  };
  return (
    <TextField
      {...props}
      rowsMax={focusState === 'blur' ? 1 : Infinity}
      onBlur={changeFocusState('blur')}
      onFocus={changeFocusState('focused')}
    />
  );
}
