'use client';

import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import type { User } from '@/types/user';
import { envConfig, localStorageConfig } from '@/config';

import { setupAxiosInterceptors } from '../axios-instance';

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface SuccessResponse<T> {
  data?: T;
  message: string;
  statusCode: string | number;
}

export interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
}

export const fetchUser = async (): Promise<User | null> => {
  const { data, error } = await authClient.getUser();

  if (error) {
    throw new Error(error); // Throwing an error to let useSWR handle it
  }

  return data ?? null;
};

class AuthClient {
  constructor() {
    setupAxiosInterceptors((): Promise<void> => Promise.resolve());
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<LoginResponse>> = await axios.post(
        `${envConfig.serverURL}/auth/login`,
        params
      );

      localStorage.setItem(localStorageConfig.accessToken, res.data.data?.access_token || '');
      Cookies.set(localStorageConfig.refreshToken, res.data.data?.refresh_token || '', {
        path: '/',
        secure: true,
        sameSite: 'Strict',
        expires: 1 / 1440,
      });
      return {};
    } catch (error) {
      toast.error('Failed to sign in');
      return {};
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<User>> = await axios.get(`${envConfig.serverURL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(localStorageConfig.accessToken)}`,
        },
      });

      return { data: res.data.data };
    } catch (error) {
      localStorage.removeItem(localStorageConfig.accessToken);
      return { error: 'User not found' };
    }
  }

  async getPermissions(role: string | undefined): Promise<{ data?: string[]; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<string[]>> = await axios.post(
        `${envConfig.serverURL}/roles/permissions`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(localStorageConfig.accessToken)}`,
          },
        }
      );
      return { data: res.data?.data };
    } catch (error) {
      return { error: 'Tour not found' };
    }
  }

  async refreshToken(): Promise<{ data?: User | null; error?: string }> {
    try {
      const res: AxiosResponse<SuccessResponse<LoginResponse>> = await axios.post(
        `${envConfig.serverURL}/auth/refresh-token`,
        {
          access_token: localStorage.getItem(localStorageConfig.accessToken),
        }
      );
      localStorage.setItem(localStorageConfig.accessToken, res.data.data?.access_token || '');
      return {};
    } catch (error) {
      localStorage.removeItem(localStorageConfig.accessToken);
      Cookies.remove(localStorageConfig.refreshToken);
      return { error: 'Failed to refresh token' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await axios.post(`${envConfig.serverURL}/auth/logout`, {
        refresh_token: Cookies.get(localStorageConfig.refreshToken),
      });

      localStorage.removeItem(localStorageConfig.accessToken);
      Cookies.remove(localStorageConfig.refreshToken);
      return {};
    } catch (error) {
      localStorage.removeItem(localStorageConfig.accessToken);
      Cookies.remove(localStorageConfig.refreshToken);
      return {};
    }
  }
}

export const authClient = new AuthClient();
