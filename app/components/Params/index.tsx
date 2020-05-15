import React from 'react';

import FieldsContainer, { CompleteItem, HeaderType } from '../FieldsContainer';

type Props = {
  handleAddParam: (h: HeaderType) => void;
  params: CompleteItem[];
  handleEditParam: (
    id: string
  ) => (prop: 'key' | 'value' | 'type') => (value: string) => void;
  handleDeleteParam: (id: string) => () => void;
};

export default function Params({
  handleAddParam,
  params,
  handleEditParam,
  handleDeleteParam
}: Props) {
  return (
    <FieldsContainer
      items={params}
      handleDeleteItem={handleDeleteParam}
      handleAddItem={handleAddParam}
      handleEditItem={handleEditParam}
    />
  );
}
