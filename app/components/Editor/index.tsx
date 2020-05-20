import React, { useMemo } from 'react';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';

import 'ace-builds/src-noconflict/theme-xcode';

import 'ace-builds/src-noconflict/theme-solarized_dark';

type EditorType = {
  value: string;
  handleChangeEditorValue: (code: string) => void;
  height?: string;
  width?: string;
};

export default function Editor({
  value,
  handleChangeEditorValue,
  height = '500px',
  width = 'calc(100vw - 200px)'
}: EditorType) {
  const theme = useTheme();
  const editorTheme = useMemo(
    () => (theme.palette.type === 'dark' ? 'solarized_dark' : 'xcode'),
    [theme.palette.type]
  );
  return (
    <Paper>
      <AceEditor
        height={height}
        width={width}
        value={value}
        mode="typescript"
        theme={editorTheme}
        onChange={handleChangeEditorValue}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        style={{
          fontFamily: 'Fira Code, monospace',
          fontSize: 14
        }}
      />
    </Paper>
  );
}
