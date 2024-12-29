'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import type { User } from '@/types/user';
import { localStorageConfig } from '@/config';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';

export interface UserContextValue {
  user: User | null;
  permissions: string[] | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{
    user: User | null;
    permissions: string[] | null;
    error: string | null;
    isLoading: boolean;
  }>({
    user: null,
    error: null,
    permissions: null,
    isLoading: true,
  });

  const router = useRouter();

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem(localStorageConfig.accessToken);

      if (!accessToken) {
        router.push(paths.auth.signIn);
        setState((prev) => ({ ...prev, user: null, permissions: null, error: null, isLoading: false }));
        return;
      }

      const { data, error } = await authClient.getUser();

      if (error) {
        router.push(paths.auth.signIn);
        toast.error('Something went wrong');
        window.location.reload();
        setState((prev) => ({
          ...prev,
          user: null,
          permissions: null,
          error: 'Something went wrong1',
          isLoading: false,
        }));
        return;
      }

      const response = await authClient.getPermissions(data?.role);

      if (response.error) {
        router.push(paths.auth.signIn);
        toast.error('Something went wrong');
        window.location.reload();
        setState((prev) => ({
          ...prev,
          user: null,
          permissions: null,
          error: 'Something went wrong1',
          isLoading: false,
        }));

        router.push(paths.auth.signIn);
        return;
      }

      setState((prev) => ({
        ...prev,
        user: data ?? null,
        permissions: response.data ?? null,
        error: null,
        isLoading: false,
      }));
    } catch (err) {
      router.push(paths.auth.signIn);
      toast.error('Something went wrong');
      window.location.reload();
      setState((prev) => ({
        ...prev,
        user: null,
        permissions: null,
        error: 'Something went wrong2',
        isLoading: false,
      }));
    }
  }, [router]);

  React.useEffect(() => {
    checkSession().catch(() => {
      router.push(paths.auth.signIn);
      toast.error('Your session has expired. Please log in again.');
      window.location.reload();
    });
  }, [checkSession, router]);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
