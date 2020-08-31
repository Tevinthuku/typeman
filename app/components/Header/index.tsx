import React from 'react';

import FieldsContainer from '../FieldsContainer';
import {
  IDObjectItem,
  HeaderType,
  AxiosHeaderParamType
} from '../../types/data';

type Props = {
  handleAddHeader: (h: HeaderType) => void;
  headers: IDObjectItem;
  handleEditHeaderItem: (id: string) => (value: AxiosHeaderParamType) => void;
  handleDeleteHeader: (id: string) => () => void;
};

export default function Headers({
  handleAddHeader,
  headers,
  handleEditHeaderItem,
  handleDeleteHeader
}: Props) {
  return (
    <FieldsContainer
      items={headers}
      handleDeleteItem={handleDeleteHeader}
      handleAddItem={handleAddHeader}
      handleEditItem={handleEditHeaderItem}
    />
  );
}
