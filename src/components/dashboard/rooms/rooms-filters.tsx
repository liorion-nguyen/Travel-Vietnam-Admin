'use client';

import React from 'react';
import { Card, Grid, TextField } from '@mui/material';
import { RoomType } from '@/types/rooms';

interface RoomFiltersProps {
  search: {
    roomNumber: number;
    roomType: RoomType | '';
    price: number;
  };
  handleChange: (field: 'roomNumber' | 'roomType' | 'price') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RoomFilters(props: RoomFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={search.roomNumber}
            onChange={handleChange('roomNumber')}
            fullWidth
            placeholder="Search by room number"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={search.price}
            onChange={handleChange('price')}
            fullWidth
            placeholder="Search by price"
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            value={search.roomType}
            onChange={handleChange('roomType')}
            fullWidth
            placeholder="Search by room type"
            type="text"
          />
        </Grid>
      </Grid>
    </Card>
  );
}
