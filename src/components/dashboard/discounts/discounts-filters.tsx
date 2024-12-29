'use client';

import React from 'react';
import { Card, Grid, TextField } from '@mui/material';
import { DiscountType } from '@/types/discounts';

interface DiscountFiltersProps {
  search: {
    code: string;
    type: DiscountType | undefined;
    value: number;
    // [key: string]: string;
  };
  handleChange: (field: 'code' | 'type' | 'value') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DiscountFilters(props: DiscountFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={search.code}
            onChange={handleChange('code')}
            fullWidth
            placeholder="Search by code"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={search.value}
            onChange={handleChange('value')}
            fullWidth
            placeholder="Search by value"
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            value={search.type}
            onChange={handleChange('type')}
            fullWidth
            placeholder="Search by type"
            type="text"
          />
        </Grid>
      </Grid>
    </Card>
  );
}
