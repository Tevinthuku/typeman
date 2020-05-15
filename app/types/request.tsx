import { Method } from 'axios';

export type axiosObject = {
  url: string;
  method: Method;
  headers: Record<string, string | number>;
  data: Object;
  params: Record<string, string | number>;
};
