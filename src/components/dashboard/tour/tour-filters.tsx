'use client';

import React from 'react';
import { Card, Grid, MenuItem, TextField } from '@mui/material';

enum Status {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

interface CustomersFiltersProps {
  search: {
    title: string;
    groupSize: string;
    price: string;
    status: string;
    [key: string]: string;
  };
  handleChange: (
    field: 'title' | 'groupSize' | 'price' | 'status'
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TourFilters(props: CustomersFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={search.title}
            onChange={handleChange('title')}
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
        <Grid item xs={12} sm={3}>
          <TextField select label="Status" value={search.status} onChange={handleChange('status')} fullWidth>
            <MenuItem value="">None</MenuItem>
            {Object.values(Status).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            value={search.groupSize}
            onChange={handleChange('groupSize')}
            fullWidth
            placeholder="Group size"
            type="number"
          />
        </Grid>
      </Grid>
    </Card>
  );
}
