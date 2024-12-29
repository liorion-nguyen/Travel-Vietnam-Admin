export interface Roles {
  _id: string;
  role: string;
  name: string;
  description: string;
  permissions: string[];
  status: Status;
  createdAt: number;
  updatedAt: number;
}

export interface SearchRoles {
  page: number;
  limit: number;
}

export interface SearchPermission {
  page: number;
  limit: number;
  search?: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  group: GroupPermission;
  version: string;
  status: StatusPermission;
  createdAt: number;
  updatedAt: number;
}

export enum GroupPermission {
  HOTEL = 'HOTEL',
  ROLES = 'ROLES',
}

export enum StatusPermission {
  DRAFTED = 'DRAFTED',
  PUBLISHED = 'PUBLISHED',
  LOCKED = 'LOCKED',
}

export interface CreateRoleForm {
  name: string;
  description: string;
  permissions: string[];
  status: Status | null;
}

export enum Status {
  ACTIVATED = 'ACTIVATED',
  INACTIVATED = 'INACTIVATED',
  REMOVED = 'REMOVED',
  NOTACTIVATED = 'NOT ACTIVATED',
}
