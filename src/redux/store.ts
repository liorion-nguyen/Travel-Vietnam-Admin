'use client';

import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import dialog from './dialog';

const store = configureStore({
  reducer: {
    dialog,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelectorRedux: TypedUseSelectorHook<RootState> = useSelector;

export default store;
