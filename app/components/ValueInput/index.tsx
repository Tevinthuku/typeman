import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

export default function ValueInputComponent(props: any) {
  const [focusState, setFocusedState] = useState('blur');
  const changeFocusState = (val: string) => () => {
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
