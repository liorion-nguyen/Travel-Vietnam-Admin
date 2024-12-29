import axios, { type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import type { CreateRoleForm, Permission, Roles, SearchRoles } from '@/types/roles';
import { envConfig } from '@/config';

import { type SuccessResponse } from '../auth/client';
import { setupAxiosInterceptors } from '../axios-instance';

class RolesApi {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async searchRoles(params: SearchRoles): Promise<{ data?: Roles[] | undefined; total?: number; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<{ data: Roles[]; total: number }>> = await axios.get(
        `${envConfig.serverURL}/roles/search`,
        {
          params,
        }
      );
      return { data: res.data.data?.data, total: res.data.data?.total };
    } catch (error) {
      return { error: 'Tour not found' };
    }
  }
  async getPermissions(): Promise<{ data?: Permission[]; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Permission[]>> = await axios.get(`${envConfig.serverURL}/permissions`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Tour not found' };
    }
  }

  async createRoles(form: CreateRoleForm): Promise<{ data?: Roles; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Roles>> = await axios.post(`${envConfig.serverURL}/roles`, form);
      toast.success('Create roles successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.success('Create roles failed');
      return { error: 'Failed to create roles' };
    }
  }

  async updateRole(form: CreateRoleForm, tourId: string): Promise<{ data?: Roles; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Roles>> = await axios.put(
        `${envConfig.serverURL}/roles/${tourId}`,
        form
      );
      toast.success('Update role successfully');
      return { data: res.data.data };
    } catch (error) {
      toast.error('Update role failed');
      return { error: 'Failed to create role' };
    }
  }

  async getRoles(roleId: string): Promise<{ data?: Roles; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<Roles>> = await axios.get(`${envConfig.serverURL}/roles/get/${roleId}`);
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Role not found' };
    }
  }

  async deleteRole(tourId: unknown): Promise<void> {
    try {
      await axios.delete(`${envConfig.serverURL}/roles/${tourId as string}`);
    } catch (error) {
      throw new Error('Failed to delete role');
    }
  }
}

export const rolesApi = new RolesApi();
