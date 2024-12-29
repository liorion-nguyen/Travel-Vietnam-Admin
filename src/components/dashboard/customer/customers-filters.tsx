'use client';

import React from 'react';
import { Card, Grid, InputAdornment, TextField } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

interface CustomersFiltersProps {
  search: {
    fullName: string;
    email: string;
    [key: string]: string;
  };
  handleChange: (field: 'fullName' | 'email') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersFilters(props: CustomersFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {['fullName', 'email'].map((field) => (
          <Grid item xs={12} sm={4} key={field}>
            <TextField
              value={search[field]}
              onChange={handleChange(field as 'fullName' | 'email')}
              fullWidth
              placeholder={`Search ${field}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
