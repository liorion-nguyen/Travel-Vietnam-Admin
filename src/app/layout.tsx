'use client'

import React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { ToastContainer } from 'react-toastify';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

import 'react-toastify/dist/ReactToastify.css';
import store from '@/redux/store';
import { Provider } from 'react-redux';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <ToastContainer />
          <UserProvider>
            <Provider store={store}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
