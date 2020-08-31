export type HeaderItemType = 'string' | 'number';
export type HeaderType = { key: string; value: string; type: HeaderItemType };

export type IDObjectItem = {
  [S in string]: {
    key: string;
    value: string;
    id: string;
    type: HeaderItemType;
  };
};
export const supportedDataTypes: HeaderItemType[] = ['string', 'number'];

export type AxiosHeaderParamType =
  | {
      item: 'key' | 'value';
      itemValue: string;
    }
  | {
      item: 'type';
      itemType: HeaderItemType;
    };
