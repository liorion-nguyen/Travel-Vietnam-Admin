import { type Address } from '.';

export class Phone {
  country: string | undefined;
  number: string | undefined;
}

export interface User {
  status: Status;
  _id?: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  address: Address;
  phone: Phone;
  createdAt: string;
  avatar: string;
  role: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVATED = 'INACTIVATED',
  REMOVED = 'REMOVED',
  NOTACTIVATED = 'NOT ACTIVATED',
}
