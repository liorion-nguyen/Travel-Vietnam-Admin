'use client';

import React from 'react';
import { Card, Grid, MenuItem, TextField } from '@mui/material';
import { BookingType } from '@/types/booking';

enum Status {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

interface BookingFiltersProps {
  search: {
    amount: string;
    status: string;
    bookingType: string;
    [key: string]: string;
  };
  handleChange: (field: 'amount' | 'status' | 'bookingType') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BookingFilters(props: BookingFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            value={search.amount}
            onChange={handleChange('amount')}
            fullWidth
            placeholder="Search by amount"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select label="Status" value={search.status} onChange={handleChange('status')} fullWidth>
            <MenuItem value="">None</MenuItem>
            {Object.values(Status).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select label="Booking Type" value={search.bookingType} onChange={handleChange('bookingType')} fullWidth>
            <MenuItem value="">None</MenuItem>
            {Object.values(BookingType).map((bookingType) => (
              <MenuItem key={bookingType} value={bookingType}>
                {bookingType}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Card>
  );
}
