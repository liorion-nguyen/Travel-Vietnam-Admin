'use client';

import React from 'react';
import { Card, Grid, TextField } from '@mui/material';

interface HotelFiltersProps {
  search: {
    name: string;
    maxGroupSize: string;
    price: string;
    // [key: string]: string;
  };
  handleChange: (field: 'name' | 'maxGroupSize' | 'price') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HotelFilters(props: HotelFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={search.name}
            onChange={handleChange('name')}
            fullWidth
            placeholder="Search by title"
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
            value={search.maxGroupSize}
            onChange={handleChange('maxGroupSize')}
            fullWidth
            placeholder="Group size"
            type="number"
          />
        </Grid>
      </Grid>
    </Card>
  );
}
