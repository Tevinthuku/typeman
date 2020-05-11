import { Method } from 'axios';

export type axiosObject = {
  url: string;
  method: Method;
  headers: Record<string, string | number>;
  body: Object;
};
