import React from 'react';

import FieldsContainer from '../FieldsContainer';
import {
  IDObjectItem,
  HeaderType,
  AxiosHeaderParamType
} from '../../types/data';

type Props = {
  handleAddParam: (h: HeaderType) => void;
  params: IDObjectItem;
  handleEditParam: (id: string) => (value: AxiosHeaderParamType) => void;
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
