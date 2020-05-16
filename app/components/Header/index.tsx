import React from 'react';

import FieldsContainer, { IDObjectItem, HeaderType } from '../FieldsContainer';

type Props = {
  handleAddHeader: (h: HeaderType) => void;
  headers: IDObjectItem;
  handleEditHeaderItem: (
    id: string
  ) => (prop: 'key' | 'value' | 'type') => (value: string) => void;
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
