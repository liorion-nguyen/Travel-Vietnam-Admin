'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CustomerData {
    id: string;
    name: string;
}

export interface CustomerState {
    showDetails: string[];
    datas: CustomerData[];
}

const DialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    customer: [] as string[],
  },
  reducers: {
    setShowCustomer(state, action: PayloadAction<string[]>) {
      state.customer = action.payload;
    },
  },
});

export const DialogActions = DialogSlice.actions;
export default DialogSlice.reducer;
