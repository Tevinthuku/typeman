export type HeaderItemType = 'string' | 'number';
export type HeaderType = { key: string; value: string };

export type IDObjectItem = {
  [S in string]: {
    key: string;
    value: string;
    id: string;
  };
};

export type AxiosHeaderParamType = {
  item: 'key' | 'value';
  itemValue: string;
};
