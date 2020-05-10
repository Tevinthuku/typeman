import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-xcode';

type EditorType = {
  value: string;
  handleChangeEditorValue: (code: string) => void;
  theme?: string;
};

export default function Editor({
  value,
  handleChangeEditorValue,
  theme = 'xcode'
}: EditorType) {
  return (
    <AceEditor
      value={value}
      mode="typescript"
      theme={theme}
      onChange={handleChangeEditorValue}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
    />
  );
}
