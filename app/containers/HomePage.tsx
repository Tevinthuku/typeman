import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';

import { json2ts } from 'json-ts';
import Axios from 'axios';

import Headers, { HeaderType, CompleteHeader } from '../components/Header';
import URLForm from '../components/URLForm';
import Editor from '../components/Editor';

type headersHooks = [
  CompleteHeader[],
  (f: (draft: CompleteHeader[]) => void | CompleteHeader[]) => void
];

const initialHeaders: CompleteHeader[] = [];

const methods = ['GET', 'POST', 'DELETE', 'PUT'];

export default function HomePage() {
  const [headers, setHeaders]: headersHooks = useImmer(initialHeaders);
  const [response, setResponse] = useState('');
  const [selectedMethod, setSelectedMethod] = React.useState(methods[0]);

  const handleAddHeader = (header: HeaderType) => {
    setHeaders(draft => {
      draft.push({ ...header, id: uuidv4() });
    });
  };

  const handleEditResponse = (anotation: string) => {
    setResponse(anotation);
  };

  const handleMakeAPICall = () => {
    Axios({
      method: 'GET',
      url: `https://jsonplaceholder.typicode.com/posts/1`
    }).then(data => {
      setResponse(json2ts(JSON.stringify(data), { flow: true }));
    });
  };
  return (
    <div>
      <URLForm
        methods={methods}
        selectedMethod={selectedMethod}
        handleMakeAPICall={handleMakeAPICall}
        setSelectedMethod={setSelectedMethod}
      />
      <Headers headers={headers} handleAddHeader={handleAddHeader} />
      <Editor value={response} handleChangeEditorValue={handleEditResponse} />
    </div>
  );
}
