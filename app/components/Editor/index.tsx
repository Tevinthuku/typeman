import React from 'react';
import Paper from '@material-ui/core/Paper';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';

import 'ace-builds/src-noconflict/theme-xcode';

type EditorType = {
  value: string;
  handleChangeEditorValue: (code: string) => void;
  theme?: string;
  height?: string;
  width?: string;
};

export default function Editor({
  value,
  handleChangeEditorValue,
  theme = 'xcode',
  height = '500px',
  width = 'calc(100vw - 200px)'
}: EditorType) {
  return (
    <Paper>
      <AceEditor
        height={height}
        width={width}
        value={value}
        mode="typescript"
        theme={theme}
        onChange={handleChangeEditorValue}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
    </Paper>
  );
}
